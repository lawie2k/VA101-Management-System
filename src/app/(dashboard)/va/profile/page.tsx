"use client";

import React, { useState, useEffect, useRef } from "react";
import FormHeader from "../../../../components/layout/FormHeader";
import VALeftSidebar from "../../../../components/va-dashboard-components/VALeftSidebar";

import { VAProfileHeader } from "../../../../components/va-dashboard-components/profile/VAProfileHeader";
import { VAProfileMainFeed } from "../../../../components/va-dashboard-components/profile/VAProfileMainFeed";
import { VAProfileRightSidebar } from "../../../../components/va-dashboard-components/profile/VAProfileRightSidebar";
import { VAProfileModals } from "../../../../components/va-dashboard-components/profile/VAProfileModals";

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
}

export interface Portfolio {
  id: string;
  icon: string;
  title: string;
  sub: string;
}

export interface Certification {
  id: string;
  title: string;
  provider: string;
  completed: boolean;
  progress: number;
}

export interface ProfileData {
  fullName: string;
  title: string;
  experienceYears: number;
  location: string;
  niche: string;
  expectedRate: number;
  openToOpportunities: boolean;
  avatar: string | null;
  coverImage: string | null;
  about: string;
  experience: Experience[];
  portfolio: Portfolio[];
  certifications: Certification[];
  skills: string[];
  tools: string[];
  availability: { hours: string; schedule: string; timezone: string };
}

// Constants & Initial Mock Profile Data
const INITIAL_PROFILE: ProfileData = {
  fullName: "Lawie Enriquez",
  title: "Senior Full Stack Developer",
  experienceYears: 4,
  location: "Manila, Philippines",
  niche: "SaaS Development",
  expectedRate: 12,
  openToOpportunities: true,
  avatar: null,
  coverImage: null,
  about: "I am a passionate Full Stack Developer with 4 years of experience building scalable SaaS products...",
  experience: [],
  portfolio: [],
  certifications: [],
  skills: [],
  tools: [],
  availability: { hours: "", schedule: "", timezone: "" },
};

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
  "General VA",
  "Executive Support",
  "Real Estate",
  "E-commerce",
  "SaaS & Tech",
  "Healthcare",
  "Finance & Insurance",
  "Professional Services",
  "Digital Marketing",
  "Social Media"
];

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
  const [feedbackData, setFeedbackData] = useState<any>({ feedbacks: [], averageRating: 0, totalReviews: 0 });

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
      }
      
      try {
        const fbRes = await fetch("/api/va/feedback");
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (fbData.success) {
            setFeedbackData(fbData.data);
          }
        }
      } catch (e) {
        console.error("Failed to load feedback data", e);
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
    if (profile.skills.length >= 1) score += 10;
    if (profile.tools.length >= 1) score += 10;
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="space-y-6">
        <VAProfileHeader 
          profile={profile}
          initials={initials}
          openEditAvatar={openEditAvatar}
          openEditCover={openEditCover}
          openEditProfile={openEditProfile}
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <VAProfileMainFeed 
            profile={profile}
            feedbackData={feedbackData}
            openEditAbout={openEditAbout}
            openAddExperience={openAddExperience}
            handleRemoveExp={handleDeleteExperience}
            openAddPortfolio={openAddPortfolio}
            handleRemovePort={handleDeletePortfolio}
            openAddCertification={openAddCertification}
            handleDeleteCertification={handleDeleteCertification}
            editSkills={editSkills}
            setEditSkills={setEditSkills}
            toggleSkill={toggleSkill}
            ALL_SKILLS={ALL_SKILLS}
            editTools={editTools}
            setEditTools={setEditTools}
            toggleTool={toggleTool}
            ALL_TOOLS={ALL_TOOLS}
            editNiches={editNiches}
            setEditNiches={setEditNiches}
            toggleNiche={toggleNiche}
            ALL_NICHES={ALL_NICHES}
            handleSaveProfile={handleSaveProfile}
            openEditAvailability={openEditAvailability}
          />
          <VAProfileRightSidebar 
            profile={profile}
            strength={strength}
            openEditAvailability={openEditAvailability}
          />
        </div>
      </div>

      <VAProfileModals 
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        aboutForm={aboutForm}
        setAboutForm={setAboutForm}
        expForm={expForm}
        setExpForm={setExpForm}
        portForm={portForm}
        setPortForm={setPortForm}
        certForm={certForm}
        setCertForm={setCertForm}
        availForm={availForm}
        setAvailForm={setAvailForm}
        avatarForm={avatarForm}
        setAvatarForm={setAvatarForm}
        coverForm={coverForm}
        setCoverForm={setCoverForm}
        handleSaveProfile={handleSaveProfile}
        handleSaveAbout={handleSaveAbout}
        handleSaveExperience={handleAddExperience}
        handleSavePortfolio={handleAddPortfolio}
        handleSaveCertifications={handleAddCertification}
        handleSaveAvailability={handleSaveAvailability}
        handleSaveAvatar={handleSaveAvatar}
        handleSaveCover={handleSaveCover}
        handleFileUpload={handleFileUpload}
        uploadError={uploadError}
        handleCoverUpload={handleCoverUpload}
        coverUploadError={coverUploadError}
        ALL_NICHES={ALL_NICHES}
      />
    </div>
  );
}

export default function Page() {
  return <VAProfile />;
}
