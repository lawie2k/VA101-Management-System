"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

const IconBarChart3 = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const IconSparkles = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
  </svg>
);

const IconBriefcase = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const IconGraduationCap = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
  </svg>
);

const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconWrench = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
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

const IconCheck = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// ==========================================
// 2. Constants & Initial Mock Profile Data
// ==========================================

const ALL_SKILLS = [
  "Lead Generation",
  "Cold Calling",
  "Email Management",
  "Data Entry",
  "Social Media",
  "Scheduling",
  "Customer Support",
  "CRM Administration",
  "Canva Design",
  "Copywriting",
  "SEO Optimization",
  "Project Management"
];

const ALL_TOOLS = [
  "HubSpot",
  "Google Workspace",
  "Salesforce",
  "Slack",
  "Asana",
  "Trello",
  "Zoom",
  "Canva",
  "ActiveCampaign",
  "Mailchimp",
  "Zapier",
  "Airtable"
];

const ALL_NICHES = [
  "Real Estate",
  "E-commerce",
  "SaaS & Tech",
  "Healthcare",
  "Finance & Insurance",
  "Professional Services",
  "Digital Marketing",
  "E-learning"
];

const INITIAL_PROFILE = {
  fullName: "",
  avatar: "",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80",
  title: "Real Estate Lead-Gen VA",
  experienceYears: 4,
  location: "Manila, Philippines",
  niche: "Real Estate",
  expectedRate: 12,
  openToOpportunities: true,
  about: "I help real estate teams book seller appointments through outbound email and cold calling. Trained on HubSpot and Google Workspace. Past clients include boutique brokerages in the US east coast.",
  portfolio: [
    { id: "p-1", icon: "📎", title: "Harbor Realty — Outbound playbook", sub: "PDF · 18 pages" },
    { id: "p-2", icon: "🎙️", title: "Cold-call recording sample", sub: "Audio · 3 min" }
  ],
  experience: [
    { id: "e-1", company: "Harbor Realty Group", role: "Lead-Gen VA", period: "2024 – Present" },
    { id: "e-2", company: "BrewKit Coffee Co.", role: "Customer Support VA", period: "2022 – 2024" }
  ],
  skills: ["Lead Generation", "Cold Calling", "Email Management", "Social Media"],
  tools: ["HubSpot", "Google Workspace", "Slack", "Asana"],
  availability: {
    hours: "30 hrs/week",
    schedule: "Mon–Fri, 9am–3pm EST",
    timezone: "EST (UTC-5)"
  },
  certifications: [
    { id: "c-1", title: "VA Foundations", provider: "Coach Erika R.", progress: 100, completed: true },
    { id: "c-2", title: "Cold Email Mastery", provider: "Daniel K.", progress: 60, completed: false }
  ]
};

// ==========================================
// 3. UI Component Blocks (Self-Contained)
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
    secondary: "bg-orange-600 hover:bg-orange-700 text-white shadow-xs",
    outline: "border border-slate-200 bg-white hover:bg-slate-55/70 text-slate-700",
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
 
function CtaButton({ size = "md", className = "", children, onClick }: { size?: "sm" | "md"; className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Button variant="primary" size={size} className={className} onClick={onClick}>
      {children}
    </Button>
  );
}
 
function Badge({ children, className = "", variant = "default" }: { children: React.ReactNode; className?: string; variant?: "default" | "secondary" | "success" }) {
  const variants = {
    default: "bg-[#E84E29] text-white",
    secondary: "bg-slate-100 text-slate-650 border border-slate-200/50",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100"
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ==========================================
// 4. Main Profile Component
// ==========================================

export function VAProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Edit Modes & Modal states
  const [activeModal, setActiveModal] = useState<"profile" | "about" | "experience" | "portfolio" | "certification" | "availability" | "avatar" | "cover" | null>(null);
  const [avatarForm, setAvatarForm] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverForm, setCoverForm] = useState("");
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  // Cards direct edit modes (Skills & Tools)
  const [editSkills, setEditSkills] = useState(false);
  const [editTools, setEditTools] = useState(false);
  const [editNiches, setEditNiches] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    title: "",
    experienceYears: 4,
    location: "",
    niche: "",
    expectedRate: 12,
    openToOpportunities: true,
  });

  const [aboutForm, setAboutForm] = useState("");

  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    period: "",
  });

  const [portForm, setPortForm] = useState({
    icon: "📎",
    title: "",
    sub: "",
  });

  const [certForm, setCertForm] = useState({
    title: "",
    provider: "",
    completed: true,
    progress: 100,
  });

  const [availForm, setAvailForm] = useState({
    hours: "",
    schedule: "",
    timezone: "",
  });

  // Load from database on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/va/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          localStorage.setItem("va_profile_data", JSON.stringify(data));
          window.dispatchEvent(new Event("profileUpdate"));
        }
      } catch (e) {
        console.error("Failed to load database profile data", e);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchProfile();
  }, []);

  // Save to database and localStorage when state changes
  const saveProfileData = async (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
    localStorage.setItem("va_profile_data", JSON.stringify(updatedProfile));
    window.dispatchEvent(new Event("profileUpdate"));

    try {
      await fetch("/api/va/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile)
      });
    } catch (e) {
      console.error("Failed to save profile to database", e);
    }
  };

  const openEditAvatar = () => {
    setAvatarForm(profile.avatar || "");
    setUploadError(null);
    setActiveModal("avatar");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 1.5MB to preserve LocalStorage browser space
    if (file.size > 1.5 * 1024 * 1024) {
      setUploadError("Image is too large. Please select an image under 1.5MB for browser performance.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarForm(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData({
      ...profile,
      avatar: avatarForm,
    });
    setActiveModal(null);
  };

  const openEditCover = () => {
    setCoverForm(profile.coverImage || "");
    setCoverUploadError(null);
    setActiveModal("cover");
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 1.5MB for LocalStorage space constraints
    if (file.size > 1.5 * 1024 * 1024) {
      setCoverUploadError("Cover image is too large. Please select an image under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCoverForm(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setCoverUploadError("Failed to read cover image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCover = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData({
      ...profile,
      coverImage: coverForm,
    });
    setActiveModal(null);
  };

  // Open modals with prefilled values
  const openEditProfile = () => {
    setProfileForm({
      fullName: profile.fullName,
      title: profile.title,
      experienceYears: profile.experienceYears,
      location: profile.location,
      niche: profile.niche,
      expectedRate: profile.expectedRate,
      openToOpportunities: profile.openToOpportunities,
    });
    setActiveModal("profile");
  };

  const openEditAbout = () => {
    setAboutForm(profile.about);
    setActiveModal("about");
  };

  const openAddExperience = () => {
    setExpForm({ company: "", role: "", period: "" });
    setActiveModal("experience");
  };

  const openAddPortfolio = () => {
    setPortForm({ icon: "📎", title: "", sub: "" });
    setActiveModal("portfolio");
  };

  const openAddCertification = () => {
    setCertForm({ title: "", provider: "", completed: true, progress: 100 });
    setActiveModal("certification");
  };

  const openEditAvailability = () => {
    setAvailForm({
      hours: profile.availability.hours,
      schedule: profile.availability.schedule,
      timezone: profile.availability.timezone,
    });
    setActiveModal("availability");
  };

  // Form submissions
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData({
      ...profile,
      ...profileForm,
    });
    setActiveModal(null);
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData({
      ...profile,
      about: aboutForm,
    });
    setActiveModal(null);
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.company || !expForm.role || !expForm.period) return;
    const newExp = {
      id: `e-${Date.now()}`,
      ...expForm,
    };
    saveProfileData({
      ...profile,
      experience: [...profile.experience, newExp],
    });
    setActiveModal(null);
  };

  const handleDeleteExperience = (id: string) => {
    saveProfileData({
      ...profile,
      experience: profile.experience.filter(e => e.id !== id),
    });
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portForm.title || !portForm.sub) return;
    const newPort = {
      id: `p-${Date.now()}`,
      ...portForm,
    };
    saveProfileData({
      ...profile,
      portfolio: [...profile.portfolio, newPort],
    });
    setActiveModal(null);
  };

  const handleDeletePortfolio = (id: string) => {
    saveProfileData({
      ...profile,
      portfolio: profile.portfolio.filter(p => p.id !== id),
    });
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.provider) return;
    const newCert = {
      id: `c-${Date.now()}`,
      ...certForm,
      progress: certForm.completed ? 100 : certForm.progress,
    };
    saveProfileData({
      ...profile,
      certifications: [...profile.certifications, newCert],
    });
    setActiveModal(null);
  };

  const handleDeleteCertification = (id: string) => {
    saveProfileData({
      ...profile,
      certifications: profile.certifications.filter(c => c.id !== id),
    });
  };

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData({
      ...profile,
      availability: { ...availForm },
    });
    setActiveModal(null);
  };

  // Inline Toggles for Skills, Tools, Niches
  const toggleSkill = (skill: string) => {
    const updatedSkills = profile.skills.includes(skill)
      ? profile.skills.filter(s => s !== skill)
      : [...profile.skills, skill];
    saveProfileData({ ...profile, skills: updatedSkills });
  };

  const toggleTool = (tool: string) => {
    const updatedTools = profile.tools.includes(tool)
      ? profile.tools.filter(t => t !== tool)
      : [...profile.tools, tool];
    saveProfileData({ ...profile, tools: updatedTools });
  };

  const toggleNiche = (niche: string) => {
    saveProfileData({ ...profile, niche });
  };

  // Dynamic Profile Strength Calculation
  const calculateStrength = () => {
    let score = 10; // base rating
    if (profile.about.length > 20) score += 20;
    if (profile.portfolio.length > 0) score += 20;
    if (profile.portfolio.length > 1) score += 10;
    if (profile.experience.length > 0) score += 20;
    if (profile.skills.length >= 3) score += 10;
    if (profile.tools.length >= 2) score += 10;
    return Math.min(score, 100);
  };

  const strength = calculateStrength();

  // Initial loading guard
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E84E29]"></div>
      </div>
    );
  }
 
  // Get Initials for Avatar Icon
  const initials = profile.fullName
    ? profile.fullName.trim().split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "VA";
 
  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
      
      {/* ==========================================
          COVER BANNER & CARD DETAILS
          ========================================== */}
      <PCard className="overflow-hidden p-0 relative hover:scale-[1.002] transition-transform duration-500">
        <div 
          className="h-40 bg-cover bg-center border-b border-slate-200 bg-black relative group"
          style={{ backgroundImage: `url(${profile.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80"})` }}
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
                      alt={profile.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-black text-white">
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
                <h1 className="text-2xl  font-black tracking-tight text-slate-900">{profile.fullName}</h1>
                <p className="text-sm font-semibold text-slate-500">{profile.title} · {profile.experienceYears} yrs experience</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-400">
                  <IconMapPin className="h-3.5 w-3.5 text-slate-400" /> {profile.location} · {profile.niche} niche
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:pt-5">
              <Button variant="outline" className="rounded-full flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm">
                <IconEye className="h-4 w-4" /> Preview public profile
              </Button>
              <CtaButton className="rounded-full flex items-center gap-1.5 text-xs py-2 px-5 shadow-md" onClick={openEditProfile}>
                <IconPencil className="h-4 w-4" /> Edit profile
              </CtaButton>
            </div>
          </div>
          
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            {profile.openToOpportunities ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-700 bg-orange-500/10 border border-orange-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                 Open to opportunities
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-550 bg-slate-50 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                 Unavailable
              </span>
            )}
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected rate</span>
            <span className="font-extrabold text-slate-900 text-base">${profile.expectedRate}/hr</span>
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
              title="About" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full p-2" onClick={openEditAbout}>
                  <IconPencil className="h-4 w-4 text-slate-500" />
                </Button>
              } 
            />
            <p className="text-sm leading-relaxed text-slate-650 font-medium">
              {profile.about || "Write a short summary about your background and specialty to attract potential clients."}
            </p>
          </PCard>

          {/* FEATURED / PORTFOLIO SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Featured / portfolio" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full px-3 py-1 text-[#E84E29] hover:text-[#DA431E]" onClick={openAddPortfolio}>
                  <span className="flex items-center gap-1"><IconPlus className="h-3.5 w-3.5" /> Add</span>
                </Button>
              } 
            />
            {profile.portfolio.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic">No portfolio items added yet. Click Add to show work samples.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {profile.portfolio.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-150 bg-slate-50/50 p-3 hover:border-slate-300 hover:bg-white transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white border border-slate-100 text-xl shadow-xs">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800 leading-tight">{item.title}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all cursor-pointer animate-in fade-in duration-200"
                      title="Delete sample"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </PCard>

          {/* EXPERIENCE SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Experience" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full px-3 py-1 text-[#E84E29] hover:text-[#DA431E]" onClick={openAddExperience}>
                  <span className="flex items-center gap-1"><IconPlus className="h-3.5 w-3.5" /> Add</span>
                </Button>
              } 
            />
            {profile.experience.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic">No work experience listed yet.</p>
            ) : (
              <ul className="space-y-4">
                {profile.experience.map((exp) => (
                  <li key={exp.id} className="group flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 border border-orange-100 text-[#E84E29]">
                        <IconBriefcase className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">{exp.role}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-1">{exp.company}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{exp.period}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all cursor-pointer animate-in fade-in duration-200"
                      title="Delete experience"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </PCard>

          {/* SKILLS SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Skills" 
              action={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full px-3 py-1 ${editSkills ? "text-[#E84E29] bg-orange-50" : "text-slate-500"}`}
                  onClick={() => setEditSkills(!editSkills)}
                >
                  {editSkills ? "Done" : "Edit"}
                </Button>
              } 
            />
            <div className="flex flex-wrap gap-2">
              {editSkills ? (
                ALL_SKILLS.map((s) => {
                  const active = profile.skills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        active 
                          ? "bg-[#E84E29] text-white border-[#E84E29]" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-650"
                      }`}
                    >
                      {active && <IconCheck className="h-3.5 w-3.5" />} {s}
                    </button>
                  );
                })
              ) : (
                profile.skills.map((s) => (
                  <Badge key={s} variant="default" className="rounded-full font-bold">
                    {s}
                  </Badge>
                ))
              )}
            </div>
          </PCard>

          {/* TOOLS & PLATFORMS SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Tools & platforms" 
              action={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full px-3 py-1 ${editTools ? "text-[#E84E29] bg-orange-50" : "text-slate-500"}`}
                  onClick={() => setEditTools(!editTools)}
                >
                  {editTools ? "Done" : "Edit"}
                </Button>
              } 
            />
            <div className="flex flex-wrap gap-2">
              {editTools ? (
                ALL_TOOLS.map((t) => {
                  const active = profile.tools.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTool(t)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        active 
                          ? "bg-orange-50 text-orange-700 border-orange-200" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-650"
                      }`}
                    >
                      {active && <IconCheck className="h-3.5 w-3.5 text-[#E84E29]" />} {t}
                    </button>
                  );
                })
              ) : (
                profile.tools.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold bg-orange-50 border border-orange-100 text-orange-750"
                  >
                    <IconWrench className="h-3 w-3 text-[#E84E29]" /> {t}
                  </span>
                ))
              )}
            </div>
          </PCard>

          {/* NICHE SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Niche" 
              action={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full px-3 py-1 ${editNiches ? "text-[#E84E29] bg-orange-50" : "text-slate-500"}`}
                  onClick={() => setEditNiches(!editNiches)}
                >
                  {editNiches ? "Done" : "Edit"}
                </Button>
              } 
            />
            <div className="flex flex-wrap gap-2">
              {editNiches ? (
                ALL_NICHES.map((n) => {
                  const active = profile.niche === n;
                  return (
                    <button
                      key={n}
                      onClick={() => toggleNiche(n)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        active 
                          ? "bg-[#E84E29] text-white border-[#E84E29] shadow-xs" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-650"
                      }`}
                    >
                      {active && <IconCheck className="h-3.5 w-3.5" />} {n}
                    </button>
                  );
                })
              ) : (
                <Badge variant="default" className="rounded-full font-bold">
                  {profile.niche}
                </Badge>
              )}
            </div>
          </PCard>

          {/* AVAILABILITY SECTION */}
          <PCard className="hover:border-slate-355">
            <PCardHeader 
              title="Availability" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full p-2" onClick={openEditAvailability}>
                  <IconPencil className="h-4 w-4 text-slate-500" />
                </Button>
              } 
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4 text-[#E84E29]" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours</span>
                </div>
                <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability.hours}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2">
                  <IconBriefcase className="h-4 w-4 text-[#E84E29]" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule</span>
                </div>
                <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability.schedule}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2">
                  <IconMapPin className="h-4 w-4 text-[#E84E29]" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time zone</span>
                </div>
                <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability.timezone}</p>
              </div>
            </div>
          </PCard>

          {/* CERTIFICATIONS & COURSES SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Certifications & courses" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full px-3 py-1 text-[#E84E29] hover:text-[#DA431E]" onClick={openAddCertification}>
                  <span className="flex items-center gap-1"><IconPlus className="h-3.5 w-3.5" /> Add</span>
                </Button>
              } 
            />
            {profile.certifications.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic">No courses or certifications listed.</p>
            ) : (
              <ul className="space-y-3">
                {profile.certifications.map((cert) => (
                  <li key={cert.id} className="group flex items-center justify-between gap-3 rounded-2xl bg-slate-50/30 border border-slate-100 p-3 hover:bg-slate-50/70 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-50 text-[#E84E29] border border-orange-100/50">
                        <IconGraduationCap className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800">{cert.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold ml-2">— {cert.provider}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {cert.completed ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-0.5 flex items-center gap-0.5">
                          <IconCheck className="w-3.5 h-3.5 text-emerald-500" /> Completed
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5">
                          In progress {cert.progress}%
                        </span>
                      )}
                      <button 
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all cursor-pointer animate-in fade-in duration-200"
                        title="Remove certification"
                      >
                        <IconX className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </PCard>
        </div>

        {/* ==========================================
            RIGHT SIDEBAR: ANALYTICS + WIDGETS
            ========================================== */}
        <div className="space-y-4">
          
          {/* PROFILE COMPLETION RADAR */}
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
                {profile.about.length > 20 ? "✅" : "⚠️"} About summary ({profile.about.length > 20 ? "Complete" : "Needs work"})
              </li>
              <li className="flex items-center gap-1.5">
                {profile.portfolio.length >= 2 ? "✅" : "⚠️"} Portfolio ({profile.portfolio.length}/2+ samples)
              </li>
              <li className="flex items-center gap-1.5">
                {profile.experience.length > 0 ? "✅" : "⚠️"} Work experience ({profile.experience.length} listed)
              </li>
              <li className="flex items-center gap-1.5">
                {profile.skills.length >= 3 ? "✅" : "⚠️"} Skills & Tools tag list
              </li>
            </ul>
          </PCard>

          {/* PROFILE ANALYTICS STATS */}
          <PCard className="hover:border-slate-350">
            <PCardHeader title="Profile analytics" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-[#E84E29]"><IconEye className="h-4.5 w-4.5" /></span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Profile views</p>
                  <p className="text-xs font-black text-slate-800">74 this week</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-[#E84E29]"><IconBarChart3 className="h-4.5 w-4.5" /></span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Search appearances</p>
                  <p className="text-xs font-black text-slate-800">123 times</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-[#E84E29]"><IconBriefcase className="h-4.5 w-4.5" /></span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Application views</p>
                  <p className="text-xs font-black text-slate-800">9 by verified clients</p>
                </div>
              </div>
            </div>
          </PCard>

          {/* SUGGESTED IMPROVEMENTS */}
          <PCard className="bg-amber-50/40 border border-amber-100 p-5">
            <PCardHeader 
              title="Suggested improvements" 
              action={<IconSparkles className="h-4.5 w-4.5 text-amber-500" />} 
            />
            <ul className="space-y-3 text-xs leading-relaxed font-semibold text-slate-650">
              <li className="flex items-start gap-2 bg-white/70 border border-amber-100/70 p-2.5 rounded-xl">
                <span>🎥</span>
                <p>Add a 30-sec intro video — boosts shortlists by 2.4×.</p>
              </li>
              <li className="flex items-start gap-2 bg-white/70 border border-amber-100/70 p-2.5 rounded-xl">
                <span>📂</span>
                <p>Add {profile.portfolio.length < 2 ? "another" : "a third"} portfolio work sample to showcase your range.</p>
              </li>
            </ul>
          </PCard>


        </div>
      </div>

      {/* ==========================================
          MODALS & OVERLAY FORMS
          ========================================== */}
      
      {activeModal && (
        <div className="fixed inset-0 bg-[#000312]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-base">
                {activeModal === "profile" && "Edit Profile Details"}
                {activeModal === "about" && "Edit About Bio"}
                {activeModal === "experience" && "Add Experience"}
                {activeModal === "portfolio" && "Add Portfolio Item"}
                {activeModal === "certification" && "Add Certification"}
                {activeModal === "availability" && "Edit Availability"}
              </h3>
              <button 
                type="button"
                onClick={() => setActiveModal(null)} 
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Forms */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              {/* EDIT PROFILE INFO */}
              {activeModal === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={profileForm.fullName} 
                      onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Professional Title</label>
                    <input 
                      type="text" 
                      required
                      value={profileForm.title} 
                      onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Experience (Years)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={profileForm.experienceYears} 
                        onChange={e => setProfileForm({ ...profileForm, experienceYears: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Expected Rate ($/hr)</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={profileForm.expectedRate} 
                        onChange={e => setProfileForm({ ...profileForm, expectedRate: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                    <input 
                      type="text" 
                      required
                      value={profileForm.location} 
                      onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Niche</label>
                    <select
                      value={profileForm.niche}
                      onChange={e => setProfileForm({ ...profileForm, niche: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    >
                      {ALL_NICHES.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="opp-status"
                      checked={profileForm.openToOpportunities} 
                      onChange={e => setProfileForm({ ...profileForm, openToOpportunities: e.target.checked })}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="opp-status" className="text-xs font-bold text-slate-700 cursor-pointer">Open to employment opportunities</label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Save Changes</Button>
                  </div>
                </form>
              )}

              {/* EDIT ABOUT BIO */}
              {activeModal === "about" && (
                <form onSubmit={handleSaveAbout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">About Bio</label>
                    <textarea 
                      rows={5}
                      required
                      value={aboutForm} 
                      onChange={e => setAboutForm(e.target.value)}
                      placeholder="Describe what you specialize in, platforms you use, and typical clients you support..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-750 leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Save Bio</Button>
                  </div>
                </form>
              )}

              {/* ADD EXPERIENCE */}
              {activeModal === "experience" && (
                <form onSubmit={handleAddExperience} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Harbor Realty Group"
                      value={expForm.company} 
                      onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role / Job Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lead-Gen Specialist VA"
                      value={expForm.role} 
                      onChange={e => setExpForm({ ...expForm, role: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Period (Duration)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 2024 – Present or 2022 – 2024"
                      value={expForm.period} 
                      onChange={e => setExpForm({ ...expForm, period: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Add Experience</Button>
                  </div>
                </form>
              )}

              {/* ADD PORTFOLIO ITEM */}
              {activeModal === "portfolio" && (
                <form onSubmit={handleAddPortfolio} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Work Sample Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Outbound Lead Generation Playbook"
                      value={portForm.title} 
                      onChange={e => setPortForm({ ...portForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Format / Details</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. PDF · 18 pages or Audio · 3 min"
                      value={portForm.sub} 
                      onChange={e => setPortForm({ ...portForm, sub: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Representative Emoji Icon</label>
                    <select
                      value={portForm.icon}
                      onChange={e => setPortForm({ ...portForm, icon: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    >
                      <option value="📎">📎 File Attachment</option>
                      <option value="🎙️">🎙️ Audio Recording</option>
                      <option value="📊">📊 PDF Report / Slide deck</option>
                      <option value="📝">📝 Article / Playbook</option>
                      <option value="🎥">🎥 Video Reel</option>
                      <option value="📧">📧 Email Template Pack</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Add Item</Button>
                  </div>
                </form>
              )}

              {/* ADD CERTIFICATION */}
              {activeModal === "certification" && (
                <form onSubmit={handleAddCertification} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Course / Certification Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Advanced Cold Email Mastery"
                      value={certForm.title} 
                      onChange={e => setCertForm({ ...certForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Provider / Coach</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Daniel K. / VA101 Portal"
                      value={certForm.provider} 
                      onChange={e => setCertForm({ ...certForm, provider: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="cert-completed"
                      checked={certForm.completed} 
                      onChange={e => setCertForm({ ...certForm, completed: e.target.checked, progress: e.target.checked ? 100 : 50 })}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="cert-completed" className="text-xs font-bold text-slate-700 cursor-pointer">I have completed this course</label>
                  </div>

                  {!certForm.completed && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Progress ({certForm.progress}%)</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="99"
                        value={certForm.progress} 
                        onChange={e => setCertForm({ ...certForm, progress: parseInt(e.target.value) || 0 })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Add Certification</Button>
                  </div>
                </form>
              )}

              {/* EDIT AVAILABILITY */}
              {activeModal === "availability" && (
                <form onSubmit={handleSaveAvailability} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weekly Commitment (Hours)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 30 hrs/week"
                      value={availForm.hours} 
                      onChange={e => setAvailForm({ ...availForm, hours: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Work Schedule</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mon–Fri, 9am–3pm EST"
                      value={availForm.schedule} 
                      onChange={e => setAvailForm({ ...availForm, schedule: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Standard Time Zone</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. EST (UTC-5) or PHT (UTC+8)"
                      value={availForm.timezone} 
                      onChange={e => setAvailForm({ ...availForm, timezone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Save Availability</Button>
                  </div>
                </form>
              )}

              {/* EDIT AVATAR PHOTO */}
              {activeModal === "avatar" && (
                <form onSubmit={handleSaveAvatar} className="space-y-4">
                  {/* File Upload Selector */}
                  <div className="space-y-1.5 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-wider mb-1">Upload from Computer</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="avatar-file-upload"
                      />
                      <label 
                        htmlFor="avatar-file-upload"
                        className="inline-flex items-center justify-center font-bold px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-55/70 text-slate-700 rounded-xl cursor-pointer text-xs transition-all shadow-xs shrink-0"
                      >
                        📂 Select Image File
                      </label>
                      {avatarForm && (
                        <button 
                          type="button"
                          onClick={() => setAvatarForm("")}
                          className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-650 hover:bg-red-100/50 hover:border-red-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          title="Clear profile photo"
                        >
                          🗑️ Clear Photo
                        </button>
                      )}
                      <span className="text-[10px] font-bold text-slate-400">Max size: 1.5MB (JPG, PNG)</span>
                    </div>
                    {uploadError && <p className="text-[10px] font-bold text-red-550 mt-1">{uploadError}</p>}
                    
                    {avatarForm && avatarForm.startsWith("data:image/") && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-white">
                          <img src={avatarForm} alt="Upload preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">✓ Image file loaded successfully!</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Save Photo</Button>
                  </div>
                </form>
              )}

              {/* EDIT COVER BANNER */}
              {activeModal === "cover" && (
                <form onSubmit={handleSaveCover} className="space-y-4">
                  {/* File Upload Selector */}
                  <div className="space-y-1.5 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1">Upload Cover Photo from Computer</label>
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
                        className="inline-flex items-center justify-center font-bold px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-55/70 text-slate-700 rounded-xl cursor-pointer text-xs transition-all shadow-xs shrink-0"
                      >
                        📂 Select Cover Image
                      </label>
                      {coverForm && (
                        <button 
                          type="button"
                          onClick={() => setCoverForm("")}
                          className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-650 hover:bg-red-100/50 hover:border-red-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          title="Clear cover image"
                        >
                          🗑️ Clear Cover
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
                        <span className="text-[10px] font-bold text-emerald-600">✓ Cover file loaded successfully!</span>
                       </div>
                     )}
                   </div>

                   <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                     <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                     <Button type="submit" variant="secondary" size="sm">Save Cover</Button>
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

// Next.js App Router Page default export wrapping our client component
export default function Page() {
  return <VAProfile />;
}
