"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VALeftSidebar from "../../../../components/va-dashboard-components/VALeftSidebar";
import ApplicationsMainFeed from "../../../../components/va-dashboard-components/applications/ApplicationsMainFeed";
import ApplicationsRightSidebar from "../../../../components/va-dashboard-components/applications/ApplicationsRightSidebar";

// ==========================================
// 1. Inline SVG Icons
// ==========================================

const IconBookmark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconBriefcase = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconInfo = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// ==========================================
// 2. Mock Databases
// ==========================================

const DEFAULT_PROFILE = {
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


export default function MyApplicationsPage() {
  const [profileState, setProfileState] = useState(DEFAULT_PROFILE);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Sync profile details and bookmarks on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("va_profile_data");
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
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
            if (data.experience?.length > 0) score += 20;
            if (data.skills?.length >= 3) score += 15;
            if (data.tools?.length >= 2) score += 15;
            return Math.min(score, 100);
          })()
        }));
      } catch (e) {
        console.error(e);
      }
    }

    const savedBookmarks = localStorage.getItem("va_saved_jobs");
    if (savedBookmarks) {
      try { setSavedJobs(JSON.parse(savedBookmarks)); } catch (e) { console.error(e); }
    }

    const savedApplications = localStorage.getItem("va_applied_jobs");
    if (savedApplications) {
      try { setAppliedJobs(JSON.parse(savedApplications)); } catch (e) { console.error(e); }
    }

    async function fetchApplications() {
      try {
        const res = await fetch("/api/va/applications");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setApplications(data);
          } else {
            setApplications([]);
          }
        }
      } catch (e) {
        console.error("Failed to load applications:", e);
      }
    }
    fetchApplications();
  }, []);

  const toggleSaveJob = (id: string) => {
    const updated = savedJobs.includes(id) 
      ? savedJobs.filter(item => item !== id) 
      : [...savedJobs, id];
    setSavedJobs(updated);
    localStorage.setItem("va_saved_jobs", JSON.stringify(updated));
  };

  // Helper to determine status step number
  const getStepNumber = (status: string) => {
    switch (status) {
      case "applied": return 1;
      case "screening": return 2;
      case "interview": return 3;
      case "offered": return 4;
      default: return 1;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        
        <VALeftSidebar />

        <ApplicationsMainFeed 
          applications={applications}
          getStepNumber={getStepNumber}
        />

        <ApplicationsRightSidebar 
          applications={applications}
        />

      </div>
    </div>
  );
}
