"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLeftSidebar from "../../../../components/va-dashboard-components/DashboardLeftSidebar";
import TrainingMainFeed from "../../../../components/va-dashboard-components/TrainingMainFeed";
import TrainingRightSidebar from "../../../../components/va-dashboard-components/TrainingRightSidebar";

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

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconGraduationCap = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
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

const MOCK_JOBS = [
  { id: "job-1", title: "Social Media Manager", company: "AeroMedia Group", rate: 10.00, type: "Part-time" },
  { id: "job-2", title: "Executive Assistant", company: "Summit Ventures", rate: 15.00, type: "Full-time" },
  { id: "job-3", title: "Shopify Store Operations Specialist", company: "Zoe Boutique", rate: 12.50, type: "Contract" }
];

const COURSE_CATALOG = [
  {
    id: "c-1",
    title: "VA101 Professional Ethics & Standards",
    instructor: "Erika Ramos",
    category: "Core Training",
    lessons: 10,
    skills: ["Ethics", "Client Communication", "Standards"],
    description: "Learn client data protection rules, conflict handling, daily activity log reports compilation, and professional etiquette rules."
  },
  {
    id: "c-2",
    title: "Advanced Client Lead Generation Strategies",
    instructor: "Daniel K.",
    category: "Marketing & Sales",
    lessons: 15,
    skills: ["Lead Generation", "Cold Email", "LinkedIn Search"],
    description: "Master real estate and SaaS lead prospecting, custom email scripting formulas, and high-response list collection mechanisms."
  },
  {
    id: "c-3",
    title: "CRM Administration & Contact Matrix Handling",
    instructor: "Michael Chen",
    category: "Operations",
    lessons: 12,
    skills: ["HubSpot", "Salesforce", "CRM Setup"],
    description: "Learn HubSpot database configurations, real estate pipelines flow, custom tags creation, and contact import integrations."
  },
  {
    id: "c-4",
    title: "Shopify Store Support & Inventory Handling",
    instructor: "Zoe Tan",
    category: "E-commerce Support",
    lessons: 8,
    skills: ["Shopify", "Order Tracking", "Refunds Handling"],
    description: "Manage fashion and retail Shopify orders list, inventory updates coordination, and Zendesk support integrations."
  }
];

export default function VATrainingCatalogPage() {
  const [profileState, setProfileState] = useState(DEFAULT_PROFILE);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingEnrollId, setLoadingEnrollId] = useState<string | null>(null);

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

    async function fetchCourses() {
      try {
        const res = await fetch("/api/training/materials");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCourses(data);
          } else {
            setCourses([]);
          }
        }
      } catch (e) {
        console.error("Failed to load courses:", e);
      }
    }

    async function fetchPurchases() {
      try {
        const res = await fetch("/api/training/purchases");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setEnrolledCourses(data.map(item => item.courseId));
          } else {
            setEnrolledCourses([]);
          }
        }
      } catch (e) {
        console.error("Failed to load purchases:", e);
      }
    }

    fetchCourses();
    fetchPurchases();
  }, []);

  const toggleSaveJob = (id: string) => {
    const updated = savedJobs.includes(id) 
      ? savedJobs.filter(item => item !== id) 
      : [...savedJobs, id];
    setSavedJobs(updated);
    localStorage.setItem("va_saved_jobs", JSON.stringify(updated));
  };

  const enrollInCourse = (id: string) => {
    setLoadingEnrollId(id);
    setTimeout(() => {
      const updated = [...enrolledCourses, id];
      setEnrolledCourses(updated);
      localStorage.setItem("va_enrolled_courses", JSON.stringify(updated));
      
      // Seed course initial progress inside va_course_progress database
      const progressDb = localStorage.getItem("va_course_progress");
      const currentProgress = progressDb ? JSON.parse(progressDb) : {};
      currentProgress[id] = 0;
      localStorage.setItem("va_course_progress", JSON.stringify(currentProgress));

      setLoadingEnrollId(null);
    }, 1200);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        
        <DashboardLeftSidebar 
          profileState={profileState}
          profileViews={0}
          defaultCoverImage={DEFAULT_PROFILE.coverImage}
        />

        <TrainingMainFeed 
          courses={courses}
          enrolledCourses={enrolledCourses}
          loadingEnrollId={loadingEnrollId}
          enrollInCourse={enrollInCourse}
        />

        <TrainingRightSidebar 
          courses={courses}
        />

      </div>
    </div>
  );
}
