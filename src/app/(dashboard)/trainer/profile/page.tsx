"use client";

import { useState, useEffect } from "react";

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

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    bio: "",
    expertise: "",
    avatar: null as string | null,
    coverImage: null as string | null,
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState<"profile" | "avatar" | "cover" | null>(null);

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

  // Avatar Upload Logic
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create local object URL for instant feedback (in a real app, you'd upload this to S3/Cloudinary first)
    const localUrl = URL.createObjectURL(file);
    
    const updatedProfile = { ...profile, avatar: localUrl };
    setProfile(updatedProfile);
    localStorage.setItem("trainer_profile_data", JSON.stringify(updatedProfile));
    window.dispatchEvent(new Event("trainerProfileUpdate"));
    setActiveModal(null);

    // TODO: Send to backend
  };

  // Cover Upload Logic
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create local object URL for instant feedback
    const localUrl = URL.createObjectURL(file);
    
    const updatedProfile = { ...profile, coverImage: localUrl };
    setProfile(updatedProfile);
    localStorage.setItem("trainer_profile_data", JSON.stringify(updatedProfile));
    window.dispatchEvent(new Event("trainerProfileUpdate"));
    setActiveModal(null);

    // TODO: Send to backend
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
              onClick={() => setActiveModal("cover")}
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
                  onClick={() => setActiveModal("avatar")}
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
          <div className="space-y-6">
            {/* About Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative group">
              <button 
                onClick={handleOpenProfileModal}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-[#E84E29] hover:bg-orange-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <IconPencil className="w-4 h-4" />
              </button>
              
              <h2 className="text-lg font-black text-slate-900 mb-4">About</h2>
              <div className="prose prose-sm max-w-none text-slate-600">
                {profile.bio ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
                ) : (
                  <p className="italic text-slate-400">No bio provided yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Dashboard Link Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E84E29]/5 rounded-bl-full -z-10 blur-xl"></div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">Trainer Dashboard</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">Head to your dashboard to manage your courses and students.</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = "/trainer/dashboard"}
              >
                View Dashboard
              </Button>
            </div>
          </div>

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
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative hover:bg-slate-100 hover:border-[#E84E29]/50 transition-all">
                <IconCamera className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-600">Click to upload photo</p>
                <p className="text-xs text-slate-400 mt-1">JPEG, PNG up to 5MB</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cover Upload Modal */}
      {activeModal === "cover" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Update Cover Image</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="w-full h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative hover:bg-slate-100 hover:border-[#E84E29]/50 transition-all">
                <IconCamera className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-600">Click to upload cover image</p>
                <p className="text-xs text-slate-400 mt-1">Optimal size: 1200 x 300px</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleCoverUpload}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
