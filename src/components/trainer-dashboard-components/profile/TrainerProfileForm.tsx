"use client";

import { useState, useEffect } from "react";
import { TrainerProfileMain } from "./TrainerProfileMain";
import { TrainerProfileRightSidebar } from "./TrainerProfileRightSidebar";

// ==========================================
// 1. Inline SVG Icons
// ==========================================

const IconPencil = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const IconCamera = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const IconX = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// ==========================================
// 2. Reusable Button Component
// ==========================================
type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  onClick,
  type = "button",
  disabled = false
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#E84E29] hover:bg-[#DA431E] text-white shadow-xs",
    secondary: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  };
 
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };
 
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// ==========================================
// 3. Main Page Component
// ==========================================

const DEFAULT_COVER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80";

const compressImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
};

export default function TrainerProfileForm() {
  const [profile, setProfile] = useState({
    fullName: "",
    bio: "",
    expertise: "",
    veemConnected: true, // Assuming true for now since they had to connect during setup
    avatar: null as string | null,
    coverImage: null as string | null,
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState<"profile" | "payout" | "avatar" | "cover" | null>(null);
  const [avatarUploadError, setAvatarUploadError] = useState("");
  const [coverUploadError, setCoverUploadError] = useState("");
  const [avatarForm, setAvatarForm] = useState("");
  const [coverForm, setCoverForm] = useState("");

  // Edit Forms state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    bio: "",
    expertise: "",
  });

  const [saving, setSaving] = useState(false);

  // Load profile data
  useEffect(() => {
    function loadProfile() {
      const savedProfile = localStorage.getItem("trainer_profile_data");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile({
            fullName: parsed.fullName || "",
            bio: parsed.bio || "",
            expertise: parsed.expertise || "",
            veemConnected: parsed.veemConnected !== undefined ? parsed.veemConnected : true,
            avatar: parsed.avatar || null,
            coverImage: parsed.coverImage || null,
          });
        } catch (e) {
          console.error("Failed to parse cached profile", e);
        }
      }
      setIsLoaded(true);
    }
    loadProfile();

    window.addEventListener("trainerProfileUpdate", loadProfile);
    return () => window.removeEventListener("trainerProfileUpdate", loadProfile);
  }, []);

  const handleOpenProfileModal = () => {
    setProfileForm({
      fullName: profile.fullName,
      bio: profile.bio,
      expertise: profile.expertise,
    });
    setActiveModal("profile");
  };

  const handleOpenAvatarModal = () => {
    setAvatarForm("");
    setAvatarUploadError("");
    setActiveModal("avatar");
  };

  const handleOpenCoverModal = () => {
    setCoverForm("");
    setCoverUploadError("");
    setActiveModal("cover");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/trainer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("trainer_profile_data", JSON.stringify(updated.data));
        window.dispatchEvent(new Event("trainerProfileUpdate"));
        setActiveModal(null);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  // Avatar Upload Logic (Preview only)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1.5 * 1024 * 1024) {
      setAvatarUploadError("Max size is 1.5MB. Please select a smaller image.");
      return;
    }

    try {
      const base64Url = await compressImage(file, 200, 200);
      setAvatarForm(base64Url);
    } catch (err) {
      setAvatarUploadError("Image processing failed.");
    }
  };

  const handleSaveAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarForm) return;

    setSaving(true);
    try {
      await fetch("/api/trainer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: avatarForm })
      });

      const updatedProfile = { ...profile, avatar: avatarForm };
      setProfile(updatedProfile);
      localStorage.setItem("trainer_profile_data", JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event("trainerProfileUpdate"));
      setActiveModal(null);
    } catch (err) {
      console.error("Failed to save avatar", err);
      setAvatarUploadError("Failed to save avatar.");
    } finally {
      setSaving(false);
    }
  };

  // Cover Upload Logic (Preview only)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1.5 * 1024 * 1024) {
      setCoverUploadError("Max size is 1.5MB. Please select a smaller image.");
      return;
    }

    try {
      const base64Url = await compressImage(file, 1200, 300);
      setCoverForm(base64Url);
    } catch (err) {
      setCoverUploadError("Image processing failed.");
    }
  };

  const handleSaveCover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverForm) return;

    setSaving(true);
    try {
      await fetch("/api/trainer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage: coverForm })
      });

      const updatedProfile = { ...profile, coverImage: coverForm };
      setProfile(updatedProfile);
      localStorage.setItem("trainer_profile_data", JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event("trainerProfileUpdate"));
      setActiveModal(null);
    } catch (err) {
      console.error("Failed to save cover", err);
      setCoverUploadError("Failed to save cover.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="space-y-6">
        
        {/* ================= HEADER CARD ================= */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          
          {/* Cover Image Area */}
          <div className="relative h-40 group bg-slate-900">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
              style={{ backgroundImage: `url(${profile.coverImage || DEFAULT_COVER})` }}
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
            
            {/* Edit Cover Button */}
            <button
              onClick={handleOpenCoverModal}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-900 hover:scale-110 transition-all shadow-md cursor-pointer flex items-center justify-center"
              title="Edit cover photo"
            >
              <IconPencil className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Profile Info Area */}
          <div className="px-6 sm:px-10 pb-8 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
              
              {/* Avatar */}
              <div className="relative -mt-20 shrink-0 z-10 group">
                <div className="w-[136px] h-[136px] rounded-full border-4 border-white overflow-hidden shadow-md bg-slate-50 relative">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#E84E29] to-amber-500 grid place-items-center">
                      <span className="text-4xl font-black text-white">
                        {profile.fullName?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "T"}
                      </span>
                    </div>
                  )}
                </div>
                {/* Edit Avatar Button */}
                <button
                  onClick={handleOpenAvatarModal}
                  className="absolute bottom-0 left-0 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 hover:scale-110 transition-all shadow-md cursor-pointer flex items-center justify-center"
                  title="Edit profile photo"
                >
                  <IconPencil className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={handleOpenProfileModal}>
                  <IconPencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="pt-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {profile.fullName}
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                {profile.expertise}
              </p>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          
          {/* Main Feed */}
          <TrainerProfileMain profile={profile} onOpenEdit={handleOpenProfileModal} />

          {/* Right Sidebar */}
          <TrainerProfileRightSidebar profile={profile} />

        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Profile Details Modal */}
      {activeModal === "profile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Edit Profile Info</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm(prev => ({...prev, fullName: e.target.value}))}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Expertise</label>
                <input
                  type="text"
                  value={profileForm.expertise}
                  onChange={(e) => setProfileForm(prev => ({...prev, expertise: e.target.value}))}
                  required
                  placeholder="e.g. Meta Ads, Copywriting"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Bio / About</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({...prev, bio: e.target.value}))}
                  rows={5}
                  required
                  placeholder="Tell students about your background..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Upload Modal */}
      {activeModal === "avatar" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Update Photo</h3>
              <button onClick={() => { setActiveModal(null); setAvatarUploadError(""); }} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAvatar} className="p-6">
              <div className="space-y-1.5 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Upload from Computer</label>
                <div className="flex flex-wrap items-center gap-3">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-file-upload"
                  />
                  <label 
                    htmlFor="avatar-file-upload"
                    className="inline-flex items-center justify-center font-bold px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer text-xs transition-all shadow-sm shrink-0"
                  >
                    Select Image File
                  </label>
                  {avatarForm && (
                    <button 
                      type="button"
                      onClick={() => setAvatarForm("")}
                      className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center shadow-sm"
                      title="Clear profile photo"
                    >
                      Clear Photo
                    </button>
                  )}
                  <span className="text-[10px] font-bold text-slate-400">Max size: 1.5MB (JPG, PNG)</span>
                </div>
                {avatarUploadError && <p className="text-[10px] font-bold text-red-500 mt-1">{avatarUploadError}</p>}
                
                {avatarForm && avatarForm.startsWith("data:image/") && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-white">
                      <img src={avatarForm} alt="Upload preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">Image loaded successfully</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-6">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="secondary" size="sm" disabled={saving || !avatarForm}>
                  {saving ? "Saving..." : "Save Photo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cover Upload Modal */}
      {activeModal === "cover" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Update Cover Image</h3>
              <button onClick={() => { setActiveModal(null); setCoverUploadError(""); }} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCover} className="p-6">
              <div className="space-y-1.5 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Upload Cover Photo from Computer</label>
                <div className="flex flex-wrap items-center gap-3">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    id="cover-file-upload"
                  />
                  <label 
                    htmlFor="cover-file-upload"
                    className="inline-flex items-center justify-center font-bold px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer text-xs transition-all shadow-sm shrink-0"
                  >
                    Select Cover Image
                  </label>
                  {coverForm && (
                    <button 
                      type="button"
                      onClick={() => setCoverForm("")}
                      className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center shadow-sm"
                      title="Clear cover image"
                    >
                      Clear Cover
                    </button>
                  )}
                  <span className="text-[10px] font-bold text-slate-400">Max size: 1.5MB (JPG, PNG)</span>
                </div>
                {coverUploadError && <p className="text-[10px] font-bold text-red-500 mt-1">{coverUploadError}</p>}
                
                {coverForm && coverForm.startsWith("data:image/") && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img src={coverForm} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">Cover loaded successfully</span>
                   </div>
                 )}
               </div>

               <div className="flex items-center justify-end gap-3 pt-6">
                 <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                 <Button type="submit" variant="secondary" size="sm" disabled={saving || !coverForm}>
                   {saving ? "Saving..." : "Save Cover"}
                 </Button>
               </div>
              </form>
            </div>
          </div>
      )}

    </div>
  );
}
