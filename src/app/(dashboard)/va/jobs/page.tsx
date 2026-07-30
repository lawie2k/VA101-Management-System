"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VALeftSidebar from "../../../../components/va-dashboard-components/VALeftSidebar";
import JobsMainFeed from "../../../../components/va-dashboard-components/jobs/JobsMainFeed";
import JobsRightSidebar from "../../../../components/va-dashboard-components/jobs/JobsRightSidebar";

// ==========================================
// 1. Inline SVG Icons
// ==========================================

const IconBookmark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconBookmarkOutline = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconSearch = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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

const IconFilter = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const IconX = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// ==========================================
// 2. Mock Databases
// ==========================================

const DEFAULT_DASHBOARD_PROFILE = {
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



export default function BrowseJobsPage() {
  const [profileState, setProfileState] = useState(DEFAULT_DASHBOARD_PROFILE);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | "Full-time" | "Part-time" | "Contract">("All");

  // Application Modal state
  const [activeApplyJob, setActiveApplyJob] = useState<any | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [expectedRate, setExpectedRate] = useState<number>(12);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Synchronize profile details and bookmarks on mount
  useEffect(() => {
    // 0. Fetch jobs from database API
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (e) {
        console.error("Failed to fetch jobs from DB:", e);
      }
    }
    fetchJobs();

    // 1. Sync profile from local storage
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
            if (data.portfolio?.length > 1) score += 10;
            if (data.experience?.length > 0) score += 20;
            if (data.skills?.length >= 3) score += 10;
            if (data.tools?.length >= 2) score += 10;
            return Math.min(score, 100);
          })()
        }));
        if (data.expectedRate) {
          setExpectedRate(data.expectedRate);
        }
      } catch (e) {
        console.error("Failed to parse saved profile:", e);
      }
    }

    // 2. Sync bookmarks and applied states from local storage
    function loadSavedJobs() {
      const savedBookmarks = localStorage.getItem("va_saved_jobs");
      if (savedBookmarks) {
        try {
          setSavedJobs(JSON.parse(savedBookmarks));
        } catch (e) {
          console.error(e);
        }
      }
    }

    const savedApplications = localStorage.getItem("va_applied_jobs");
    if (savedApplications) {
      try {
        setAppliedJobs(JSON.parse(savedApplications));
      } catch (e) {
        console.error(e);
      }
    }

    // Bind custom storage listener
    const handleProfileUpdate = () => {
      const updated = localStorage.getItem("va_profile_data");
      if (updated) {
        try {
          const data = JSON.parse(updated);
          setProfileState(prev => ({
            ...prev,
            fullName: data.fullName || prev.fullName,
            avatar: (data.avatar === undefined || data.avatar === null) ? prev.avatar : data.avatar,
            coverImage: data.coverImage || prev.coverImage,
            title: data.title || prev.title,
            location: data.location || prev.location,
            availability: data.openToOpportunities ? "Open to opportunities" : "Unavailable",
            skills: data.skills || prev.skills,
          }));
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadSavedJobs();
    window.addEventListener("storage", handleProfileUpdate);
    window.addEventListener("profileUpdate", handleProfileUpdate);
    window.addEventListener("storage", loadSavedJobs);
    window.addEventListener("savedJobsUpdate", loadSavedJobs);
    return () => {
      window.removeEventListener("storage", handleProfileUpdate);
      window.removeEventListener("profileUpdate", handleProfileUpdate);
      window.removeEventListener("storage", loadSavedJobs);
      window.removeEventListener("savedJobsUpdate", loadSavedJobs);
    };
  }, []);

  // Handle saving/bookmarking a job card
  const toggleSaveJob = (id: string) => {
    const updated = savedJobs.includes(id) 
      ? savedJobs.filter(item => item !== id) 
      : [...savedJobs, id];
    setSavedJobs(updated);
    localStorage.setItem("va_saved_jobs", JSON.stringify(updated));
    window.dispatchEvent(new Event("savedJobsUpdate"));
  };

  // Open apply overlay dialog
  const openApplyModal = (job: any) => {
    setActiveApplyJob(job);
    setCoverNote("");
    setShowSuccessAlert(false);
  };

  // Handle application submission flow
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/va/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPostId: activeApplyJob.id,
          coverNote
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      const updated = [...appliedJobs, activeApplyJob.id.toString()];
      setAppliedJobs(updated);
      localStorage.setItem("va_applied_jobs", JSON.stringify(updated));
      
      setShowSuccessAlert(true);
      
      setTimeout(() => {
        setActiveApplyJob(null);
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search filter logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill: any) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "All" || (job.type && job.type.includes(selectedType));

    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-144px)] overflow-visible lg:overflow-hidden">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-visible lg:overflow-hidden">
        
        <VALeftSidebar hideOnMobile={true} />

        <JobsMainFeed 
          filteredJobs={filteredJobs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          savedJobs={savedJobs}
          appliedJobs={appliedJobs}
          toggleSaveJob={toggleSaveJob}
          openApplyModal={openApplyModal}
        />

        <JobsRightSidebar 
          jobs={jobs}
          savedJobs={savedJobs}
          toggleSaveJob={toggleSaveJob}
        />

      </div>

      {/* ==========================================
          JOB APPLICATION OVERLAY MODAL
          ========================================== */}
      {activeApplyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-300">
            <div className="h-2 bg-[#E84E29]" />
            <div className="p-6">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#E84E29] uppercase tracking-wider">Job Application</span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">Apply for {activeApplyJob.title}</h3>
                  <p className="text-xs font-semibold text-slate-450">{activeApplyJob.company} • {activeApplyJob.type}</p>
                </div>
                <button 
                  onClick={() => setActiveApplyJob(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              {showSuccessAlert ? (
                /* Success View */
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-150 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                    <IconCheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">Application Submitted!</h4>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">Your profile has been forwarded to {activeApplyJob.company}.</p>
                  </div>
                </div>
              ) : (
                /* Form View */
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      disabled
                      value={profileState.fullName} 
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs bg-slate-50 text-slate-400 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Proposed Hourly Rate ($/hr)</label>
                    <input 
                      type="number" 
                      required
                      min={5}
                      max={100}
                      value={expectedRate} 
                      onChange={e => setExpectedRate(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                    <p className="text-[10px] text-slate-450 font-bold mt-1">Client budget rate: ${activeApplyJob.rate.toFixed(2)}/hr</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Brief Cover Note / Pitch</label>
                    <textarea 
                      rows={4}
                      required
                      value={coverNote}
                      onChange={e => setCoverNote(e.target.value)}
                      placeholder={`Tell ${activeApplyJob.company} why you are a great fit for their ${activeApplyJob.title} role...`}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setActiveApplyJob(null)}
                      className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                    >
                      {isSubmitting ? "Submitting..." : "Send Application"}
                    </button>
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
