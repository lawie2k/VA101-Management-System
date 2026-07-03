"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VALeftSidebar from "../../../../components/va-dashboard-components/VALeftSidebar";
import DashboardMainFeed from "../../../../components/va-dashboard-components/dashboard/DashboardMainFeed";
import DashboardRightSidebar from "../../../../components/va-dashboard-components/dashboard/DashboardRightSidebar";

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


export default function Page() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [profileState, setProfileState] = useState({
    fullName: "",
    avatar: "",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80",
    title: "",
    location: "",
    availability: "",
    completion: 0,
    skills: [] as string[],
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

    async function fetchDashboardFeeds() {
      try {
        const appRes = await fetch("/api/va/applications");
        if (appRes.ok) {
          const appData = await appRes.json();
          if (Array.isArray(appData)) setApplications(appData);
        }

        const intRes = await fetch("/api/va/interviews");
        if (intRes.ok) {
          const intData = await intRes.json();
          if (Array.isArray(intData)) setInterviews(intData);
        }

        const courseRes = await fetch("/api/va/training/materials");
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          if (Array.isArray(courseData)) setCourses(courseData);
        }

        const jobRes = await fetch("/api/jobs");
        if (jobRes.ok) {
          const jobData = await jobRes.json();
          if (Array.isArray(jobData)) setJobs(jobData);
        }
      } catch (err) {
        console.error("Error loading dashboard live feeds:", err);
      }
    }

    loadProfile();
    syncDbProfile();
    loadSavedJobs();
    fetchDashboardFeeds();
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

  // Map live application to active status banner
  const activeApplication = applications.length > 0 ? {
    appliedDate: applications[0].appliedDate,
    jobTitle: applications[0].jobTitle,
    company: applications[0].company,
    status: applications[0].status || "applied"
  } : {
    appliedDate: "Today",
    jobTitle: "Get Started by Applying to Jobs!",
    company: "Select the Jobs tab to browse client posts.",
    status: "none"
  };

  // Map first 3 database jobs as recommended jobs
  const recommendedJobs = jobs.map((job: any) => ({
    id: job.id.toString(),
    title: job.title || "",
    company: job.company || "Enterprise Client",
    type: job.type || "Full-time",
    description: job.description || "",
    skills: job.skills || [],
    rate: job.rate || 0
  })).slice(0, 3);

  // Map first 2 database courses as recommended courses
  const recommendedCourses = courses.map((course: any) => ({
    id: course.id.toString(),
    title: course.title,
    category: course.category || "Core Training",
    progress: 0
  })).slice(0, 2);

  // Map database interviews for sidebar
  const upcomingInterviews = interviews.map((item: any) => ({
    id: item.id.toString(),
    type: item.type || "initial_interview",
    jobTitle: item.jobTitle,
    company: item.company,
    scheduledAt: item.scheduledAt ? new Date(item.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "TBD"
  }));

  // Map database jobs list for bookmark checks in sidebar
  const mappedJobs = jobs.map((job: any) => ({
    id: job.id.toString(),
    title: job.title || "",
    company: job.company || "Enterprise Client",
    rate: job.rate || 0
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      
      {/* Portal 3-Column LinkedIn-Style Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        
        <VALeftSidebar />

        <DashboardMainFeed 
          mockApplication={activeApplication}
          mockJobs={recommendedJobs}
          mockCourses={recommendedCourses}
          savedJobs={savedJobs}
          toggleSaveJob={toggleSaveJob}
        />

        <DashboardRightSidebar 
          mockInterviews={upcomingInterviews}
          mockJobs={mappedJobs}
          savedJobs={savedJobs}
        />

      </div>
    </div>
  );
}
