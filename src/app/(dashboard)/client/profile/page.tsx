"use client";

import { useState, useEffect } from "react";
import PhoneInput from "../../../../components/forms/PhoneInput";

// ==========================================
// 1. Inline SVG Icons for Zero-Dependency UI
// ==========================================

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconEye = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const IconPencil = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const IconBuilding = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="9" y1="22" x2="9" y2="16" />
    <line x1="15" y1="22" x2="15" y2="16" />
    <line x1="9" y1="16" x2="15" y2="16" />
    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01M12 10h.01" />
  </svg>
);

const IconGlobe = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const IconUsers = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBarChart3 = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const IconBriefcase = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const IconSparkles = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
  </svg>
);

const IconPlus = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconX = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconUser = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconPhone = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ==========================================
// 2. PCard Components
// ==========================================

function PCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const hasPaddingClass = /\bp-/.test(className);
  return (
    <div className={`bg-white border border-slate-200 rounded-3xl ${hasPaddingClass ? "" : "p-6"} shadow-xs transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function PCardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-extrabold text-slate-900 text-base tracking-tight">{title}</h3>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
}

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

function Button({ 
  variant = "primary", 
  size = "md",
  className = "", 
  children,
  onClick,
  type = "button"
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full cursor-pointer";
  
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
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// ==========================================
// 3. Main Page Component
// ==========================================

export default function Page() {
  const [profile, setProfile] = useState({
    companyName: "",
    industry: "",
    companySize: "1-10",
    companyWebsite: "",
    companyDescription: "",
    avatar: null as string | null,
    coverImage: null as string | null,
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState<"company" | "avatar" | "cover" | null>(null);

  // Edit Forms state
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    industry: "",
    companySize: "1-10",
    companyWebsite: "",
    companyDescription: "",
  });

  const [aboutForm, setAboutForm] = useState("");
  const [avatarForm, setAvatarForm] = useState<string | null>(null);
  const [coverForm, setCoverForm] = useState<string | null>(null);

  // Load profile on mount
  useEffect(() => {
    const saved = localStorage.getItem("client_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile({
          companyName: parsed.companyName || "",
          industry: parsed.industry || "",
          companySize: parsed.companySize || "1-10",
          companyWebsite: parsed.companyWebsite || "",
          companyDescription: parsed.companyDescription || "",
          avatar: parsed.avatar || null,
          coverImage: parsed.coverImage || null,
        });
      } catch (e) {
        console.error("Failed to load client profile from storage:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Compute profile strength %
  const strength = (() => {
    let score = 20;
    if (profile.companyName?.trim()) score += 20;
    if (profile.industry?.trim()) score += 20;
    if (profile.companyWebsite?.trim()) score += 20;
    if (profile.companyDescription?.trim().length > 20) score += 20;
    return Math.min(score, 100);
  })();

  // Save changes
  const saveToStorage = async (updated: typeof profile) => {
    // 1. Save to local state and trigger re-render
    setProfile(updated);
    localStorage.setItem("client_profile_data", JSON.stringify(updated));
    window.dispatchEvent(new Event("clientProfileUpdate"));
    
    // 2. Persist to backend
    try {
      await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Failed to save profile to backend:", e);
    }
  };

  // Open edit modals
  const openEditCover = () => {
    setCoverForm(profile.coverImage || "");
    setActiveModal("cover");
  };

  const openEditAvatar = () => {
    setAvatarForm(profile.avatar || "");
    setActiveModal("avatar");
  };

  const openEditProfile = () => {
    setCompanyForm({
      companyName: profile.companyName,
      industry: profile.industry,
      companySize: profile.companySize,
      companyWebsite: profile.companyWebsite,
      companyDescription: profile.companyDescription,
    });
    setActiveModal("company");
  };

  // Submit Handlers
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...profile, ...companyForm };
    saveToStorage(updated);
    setActiveModal(null);
  };

  // Image Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "avatar") {
          setAvatarForm(reader.result as string);
        } else {
          setCoverForm(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarForm !== null) {
      saveToStorage({ ...profile, avatar: avatarForm });
    }
    setActiveModal(null);
  };

  const handleSaveCover = (e: React.FormEvent) => {
    e.preventDefault();
    if (coverForm !== null) {
      saveToStorage({ ...profile, coverImage: coverForm });
    }
    setActiveModal(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E84E29] border-t-transparent" />
      </div>
    );
  }

  const initials = profile.companyName?.trim()
    ? profile.companyName.trim().split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "CO";

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* ==========================================
          COVER BANNER & CARD DETAILS
          ========================================== */}
      <PCard className="overflow-hidden p-0 relative hover:scale-[1.002] transition-transform duration-500">
        <div 
          className="h-40 bg-cover bg-center border-b border-slate-200 bg-black relative group"
          style={{ backgroundImage: `url(${profile.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=300&q=80"})` }}
        >
          {/* Pencil edit icon for Cover Banner */}
          <button 
            type="button"
            onClick={openEditCover}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-900 hover:scale-110 transition-all shadow-md cursor-pointer flex items-center justify-center"
            title="Edit cover photo"
          >
            <IconPencil className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 relative">
              <div className="relative group shrink-0 z-10">
                <div className="w-34 h-34 rounded-full border-4 border-white overflow-hidden shadow-md relative bg-slate-50 -mt-20">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.companyName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-gradient-to-br from-[#E84E29] to-amber-500 text-2xl font-black text-white">
                      {initials}
                    </span>
                  )}
                </div>
                {/* Pencil edit icon on bottom left */}
                <button 
                  type="button"
                  onClick={openEditAvatar}
                  className="absolute bottom-0 left-0 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 hover:scale-110 transition-all shadow-md cursor-pointer flex items-center justify-center"
                  title="Edit profile photo"
                >
                  <IconPencil className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="pt-5 sm:pt-0">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{profile.companyName || "Your Company Name"}</h1>
                <p className="text-sm font-semibold text-slate-500">{profile.industry || "Add Industry"} · {profile.companySize} employees</p>
                {profile.companyWebsite && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-400">
                    <IconGlobe className="h-3.5 w-3.5 text-slate-400" />
                    <a 
                      href={profile.companyWebsite.startsWith("http") ? profile.companyWebsite : `https://${profile.companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-[#E84E29]"
                    >
                      {profile.companyWebsite}
                    </a>
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:pt-5">
              <Button variant="primary" className="rounded-full flex items-center gap-1.5 text-xs py-2 px-5 shadow-md text-white" onClick={openEditProfile}>
                <IconPencil className="h-4 w-4" /> Edit company
              </Button>
            </div>
          </div>
          
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Actively Hiring
            </span>
          </div>
        </div>
      </PCard>

      {/* ==========================================
          TWO-COLUMN MAIN GRID LAYOUT
          ========================================== */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        
        {/* LEFT COLUMN: Main Details Panels */}
        <div className="space-y-6">
          
          {/* ABOUT SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Company Description" 
            />
            <p className="text-sm leading-relaxed text-slate-655 font-medium whitespace-pre-line">
              {profile.companyDescription || "Provide a summary about your company culture, mission, and remote workspace environment to attract the best VAs."}
            </p>
          </PCard>

        </div>

        {/* RIGHT COLUMN: ANALYTICS + COMPLETENESS */}
        <div className="space-y-6">
          
          {/* PROFILE COMPLETION SCORE */}
          <PCard className="hover:border-slate-350">
            <PCardHeader title="Profile completion" />
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-500">Overall Score</span>
              <span className="text-[#E84E29]">{strength}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#E84E29] h-full rounded-full transition-all duration-750" 
                style={{ width: `${strength}%` }}
              />
            </div>
            <ul className="mt-3.5 space-y-1.5 text-[11px] font-bold text-slate-500">
              <li className="flex items-center gap-1.5">
                {profile.companyName ? "✅" : "⚠️"} Company name
              </li>
              <li className="flex items-center gap-1.5">
                {profile.industry ? "✅" : "⚠️"} Industry details
              </li>
              <li className="flex items-center gap-1.5">
                {profile.companyDescription.length > 20 ? "✅" : "⚠️"} Company desc
              </li>
              <li className="flex items-center gap-1.5">
                {profile.companyWebsite ? "✅" : "⚠️"} Website url
              </li>
            </ul>
          </PCard>



        </div>

      </div>

      {/* ==========================================
          MODALS & OVERLAY FORMS
          ========================================== */}
      
      {activeModal && (
        <div className="fixed inset-0 bg-[#000312]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
              <h3 className="font-extrabold text-slate-900 text-base">
                {activeModal === "company" && "Edit Company Details"}
                {activeModal === "avatar" && "Change Profile Logo"}
                {activeModal === "cover" && "Change Cover Banner"}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* 1. Edit Company Details */}
              {activeModal === "company" && (
                <form onSubmit={handleSaveCompany} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Company Name</label>
                    <input 
                      type="text"
                      required
                      value={companyForm.companyName}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">Industry</label>
                      <input 
                        type="text"
                        required
                        value={companyForm.industry}
                        onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">Company Size</label>
                      <select
                        value={companyForm.companySize}
                        onChange={(e) => setCompanyForm({ ...companyForm, companySize: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs bg-white text-slate-800 font-medium"
                      >
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="200+">200+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Company Website</label>
                    <input 
                      type="text"
                      value={companyForm.companyWebsite}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyWebsite: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
                      placeholder="e.g. acme.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Company Description</label>
                    <textarea 
                      rows={4}
                      value={companyForm.companyDescription}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyDescription: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs resize-none"
                      placeholder="Tell VAs about your company culture, mission, and work style..."
                    />
                    <p className="text-[10px] font-semibold text-slate-500 mt-1.5 ml-1">
                      * Minimum 20 characters required for profile completion score.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" className="text-white">Save Changes</Button>
                  </div>
                </form>
              )}



              {/* 4. Upload Logo / Avatar */}
              {activeModal === "avatar" && (
                <form onSubmit={handleSaveAvatar} className="space-y-4">
                  <div className="space-y-2 p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "avatar")}
                      className="hidden"
                      id="logo-file"
                    />
                    <label 
                      htmlFor="logo-file"
                      className="inline-flex items-center justify-center font-bold px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer text-xs transition-all shadow-xs"
                    >
                      Choose Image File
                    </label>
                    <p className="text-[10px] font-bold text-slate-400">Max size: 1.5MB (JPG, PNG)</p>

                    {avatarForm && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="w-16 h-16 rounded-3xl overflow-hidden border border-slate-200 bg-white">
                          <img src={avatarForm} alt="Logo Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600">Image loaded successfully!</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" className="text-white">Save Logo</Button>
                  </div>
                </form>
              )}

              {/* 5. Upload Cover Banner */}
              {activeModal === "cover" && (
                <form onSubmit={handleSaveCover} className="space-y-4">
                  <div className="space-y-2 p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "cover")}
                      className="hidden"
                      id="cover-file"
                    />
                    <label 
                      htmlFor="cover-file"
                      className="inline-flex items-center justify-center font-bold px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer text-xs transition-all shadow-xs"
                    >
                      Choose Cover Image
                    </label>
                    <p className="text-[10px] font-bold text-slate-400">Max size: 1.5MB (JPG, PNG)</p>

                    {coverForm && (
                      <div className="mt-4">
                        <div className="w-full h-20 rounded-xl overflow-hidden border border-slate-200 bg-white">
                          <img src={coverForm} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-bold text-emerald-600 mt-2">Cover loaded successfully!</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" className="text-white">Save Cover</Button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
