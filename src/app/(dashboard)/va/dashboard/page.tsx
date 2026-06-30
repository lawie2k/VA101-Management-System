"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLeftSidebar from "../../../../components/va-dashboard-components/DashboardLeftSidebar";
import DashboardMainFeed from "../../../../components/va-dashboard-components/DashboardMainFeed";
import DashboardRightSidebar from "../../../../components/va-dashboard-components/DashboardRightSidebar";

// Inline SVG Icon Components to avoid external package dependencies
const IconBookmark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconLightbulb = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <line x1="9" y1="18" x2="15" y2="18"></line>
    <line x1="10" y1="22" x2="14" y2="22"></line>
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconArrowRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// Self-contained Mock Data for immediately viewable frontend structure
const MOCK_PROFILE = {
  fullName: "",
  title: "",
  location: "",
  avatar: "",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80",
  completion: 10,
  views: 0,
  availability: "",
  skills: [],
};

const MOCK_JOBS = [
  { 
    id: "job-1", 
    title: "Social Media Manager", 
    company: "AeroMedia Group", 
    rate: 10.00, 
    type: "Part-time", 
    description: "Manage Instagram, TikTok, and Facebook posts, content scheduling, and community engagement tracking.", 
    skills: ["Content Creation", "Canva", "Scheduling"] 
  },
  { 
    id: "job-2", 
    title: "Executive Assistant", 
    company: "Summit Ventures", 
    rate: 15.00, 
    type: "Full-time", 
    description: "Manage CEO calendar, coordinate discovery calls, draft stakeholder communications, and handle administration.", 
    skills: ["Calendar Management", "Slack", "Email Handling"] 
  },
  { 
    id: "job-3", 
    title: "Shopify Store Operations Specialist", 
    company: "Zoe Boutique", 
    rate: 12.50, 
    type: "Contract", 
    description: "Inventory updates, order fulfillment, and client support ticketing handling for fashion store orders.", 
    skills: ["Shopify", "Customer Support", "Zendesk"] 
  }
];

const MOCK_INTERVIEWS = [
  { 
    id: "int-1", 
    jobTitle: "Social Media Manager", 
    company: "AeroMedia Group",
    type: "initial_interview", 
    scheduledAt: "June 29, 2026 at 2:00 PM" 
  },
  { 
    id: "int-2", 
    jobTitle: "Executive Assistant", 
    company: "Summit Ventures",
    type: "client_interview", 
    scheduledAt: "July 2, 2026 at 10:00 AM" 
  }
];

const MOCK_COURSES = [
  { id: "c-1", title: "VA101 Professional Ethics & Standards", progress: 80, category: "Core Training" },
  { id: "c-2", title: "Advanced Client Lead Generation Strategies", progress: 35, category: "Marketing & Sales" }
];

const MOCK_APPLICATION = {
  jobTitle: "Junior Project Manager",
  company: "CloudScale Inc.",
  status: "screening", // applied, screening, initial_interview, client_interview, offered, contracted
  appliedDate: "June 25, 2026"
};

export default function Page() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [profileState, setProfileState] = useState({
    fullName: MOCK_PROFILE.fullName,
    avatar: MOCK_PROFILE.avatar,
    coverImage: MOCK_PROFILE.coverImage,
    title: MOCK_PROFILE.title,
    location: MOCK_PROFILE.location,
    availability: MOCK_PROFILE.availability,
    completion: MOCK_PROFILE.completion,
    skills: MOCK_PROFILE.skills as string[],
  });

  useEffect(() => {
    function loadProfile() {
      const saved = localStorage.getItem("va_profile_data");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setProfileState(prev => ({
            ...prev,
            fullName: data.fullName || prev.fullName,
            avatar: (data.avatar === undefined || data.avatar === null) ? prev.avatar : data.avatar,
            coverImage: data.coverImage || prev.coverImage,
            title: data.title || prev.title,
            location: data.location || prev.location,
            availability: data.openToOpportunities ? "Open to opportunities" : "Unavailable",
            skills: data.skills || prev.skills,
            completion: (() => {
              let score = 10;
              if (data.about?.length > 20) score += 20;
              if (data.portfolio?.length > 0) score += 20;
              if (data.portfolio?.length > 1) score += 10;
              if (data.experience?.length > 0) score += 20;
              if (data.skills?.length >= 3) score += 10;
              if (data.tools?.length >= 2) score += 10;
              return Math.min(score, 100);
            })()
          }));
        } catch (e) {
          console.error(e);
        }
      }
    }

    async function syncDbProfile() {
      try {
        const res = await fetch("/api/va/profile");
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("va_profile_data", JSON.stringify(data));
          loadProfile();
        }
      } catch (e) {
        console.error("Dashboard profile sync error:", e);
      }
    }

    function loadSavedJobs() {
      const saved = localStorage.getItem("va_saved_jobs");
      if (saved) {
        try {
          setSavedJobs(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }

    loadProfile();
    syncDbProfile();
    loadSavedJobs();
    window.addEventListener("storage", loadProfile);
    window.addEventListener("profileUpdate", loadProfile);
    window.addEventListener("storage", loadSavedJobs);
    window.addEventListener("savedJobsUpdate", loadSavedJobs);
    return () => {
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("profileUpdate", loadProfile);
      window.removeEventListener("storage", loadSavedJobs);
      window.removeEventListener("savedJobsUpdate", loadSavedJobs);
    };
  }, []);

  const toggleSaveJob = (id: string) => {
    const updated = savedJobs.includes(id)
      ? savedJobs.filter(item => item !== id)
      : [...savedJobs, id];
    setSavedJobs(updated);
    localStorage.setItem("va_saved_jobs", JSON.stringify(updated));
    window.dispatchEvent(new Event("savedJobsUpdate"));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      
      {/* Portal 3-Column LinkedIn-Style Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        
        <DashboardLeftSidebar 
          profileState={profileState}
          profileViews={MOCK_PROFILE.views}
          defaultCoverImage={MOCK_PROFILE.coverImage}
        />

        <DashboardMainFeed 
          mockApplication={MOCK_APPLICATION}
          mockJobs={MOCK_JOBS}
          mockCourses={MOCK_COURSES}
          savedJobs={savedJobs}
          toggleSaveJob={toggleSaveJob}
        />

        <DashboardRightSidebar 
          mockInterviews={MOCK_INTERVIEWS}
          mockJobs={MOCK_JOBS}
          savedJobs={savedJobs}
        />

      </div>
    </div>
  );
}
