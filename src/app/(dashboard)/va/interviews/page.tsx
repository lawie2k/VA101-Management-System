"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLeftSidebar from "../../../../components/va-dashboard-components/DashboardLeftSidebar";
import InterviewsMainFeed from "../../../../components/va-dashboard-components/InterviewsMainFeed";
import InterviewsRightSidebar from "../../../../components/va-dashboard-components/InterviewsRightSidebar";

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

const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconVideo = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z"></path>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
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

const INITIAL_INTERVIEWS = [
  { 
    id: "int-1", 
    jobTitle: "Social Media Manager", 
    company: "AeroMedia Group",
    type: "initial_interview", 
    scheduledAt: "June 29, 2026 at 2:00 PM",
    interviewer: "Erika Ramos (HR Lead)",
    platform: "Zoom Video Call"
  },
  { 
    id: "int-2", 
    jobTitle: "Executive Assistant", 
    company: "Summit Ventures",
    type: "client_interview", 
    scheduledAt: "July 2, 2026 at 10:00 AM",
    interviewer: "David K. (Founder & CEO)",
    platform: "Google Meet Link"
  }
];

export default function VAInterviewsPage() {
  const [profileState, setProfileState] = useState(DEFAULT_PROFILE);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  // Interactive meetings states
  const [interviews, setInterviews] = useState<any[]>([]);
  const [meetingUrlToast, setMeetingUrlToast] = useState<string | null>(null);
  
  // Reschedule state
  const [rescheduleItem, setRescheduleItem] = useState<any | null>(null);
  const [proposedTime, setProposedTime] = useState("");
  const [rescheduleMessage, setRescheduleMessage] = useState("");
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

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

    async function fetchInterviews() {
      try {
        const res = await fetch("/api/interviews");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setInterviews(data);
          } else {
            setInterviews([]);
          }
        }
      } catch (e) {
        console.error("Failed to load interviews:", e);
      }
    }
    fetchInterviews();
  }, []);

  const toggleSaveJob = (id: string) => {
    const updated = savedJobs.includes(id) 
      ? savedJobs.filter(item => item !== id) 
      : [...savedJobs, id];
    setSavedJobs(updated);
    localStorage.setItem("va_saved_jobs", JSON.stringify(updated));
  };

  const triggerMeetingLaunch = (platform: string) => {
    setMeetingUrlToast(`Connecting to ${platform}... Launching browser call client.`);
    setTimeout(() => setMeetingUrlToast(null), 3000);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleSuccess(true);
    setTimeout(() => {
      // Simulate reschedule update in list
      setInterviews(prev => prev.map(item => item.id === rescheduleItem.id 
        ? { ...item, scheduledAt: proposedTime + " (Awaiting Recruiter Confirmation)" } 
        : item
      ));
      setRescheduleItem(null);
      setRescheduleSuccess(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      
      {/* Toast Alert Simulation */}
      {meetingUrlToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-slate-700 text-white rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <IconVideo className="w-5 h-5 text-[#E84E29]" />
          <span className="text-xs font-bold">{meetingUrlToast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        
        <DashboardLeftSidebar 
          profileState={profileState}
          profileViews={0}
          defaultCoverImage={DEFAULT_PROFILE.coverImage}
        />

        <InterviewsMainFeed 
          interviews={interviews}
          setRescheduleItem={setRescheduleItem}
          setProposedTime={setProposedTime}
          setRescheduleMessage={setRescheduleMessage}
          triggerMeetingLaunch={triggerMeetingLaunch}
        />

        <InterviewsRightSidebar 
          interviews={interviews}
        />

      </div>

      {/* ==========================================
          INTERVIEW RESCHEDULE MODAL DIALOG
          ========================================== */}
      {rescheduleItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-300">
            <div className="h-2 bg-[#E84E29]" />
            <div className="p-6">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#E84E29] uppercase tracking-wider">Request Change</span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">Reschedule Request</h3>
                  <p className="text-xs font-semibold text-slate-450">{rescheduleItem.company} • {rescheduleItem.jobTitle}</p>
                </div>
                <button 
                  onClick={() => setRescheduleItem(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650 cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {rescheduleSuccess ? (
                /* Success View */
                <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-150 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Reschedule Request Sent!</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">The client/recruiter will review and confirm your request shortly.</p>
                  </div>
                </div>
              ) : (
                /* Input Form */
                <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Scheduled Time</label>
                    <input type="text" disabled value={rescheduleItem.scheduledAt} className="w-full rounded-xl border border-slate-200 p-3 text-xs bg-slate-50 text-slate-400 font-semibold" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Proposed New Date & Time</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. July 5, 2026 at 3:00 PM PHT"
                      value={proposedTime}
                      onChange={e => setProposedTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Brief Reason for Reschedule</label>
                    <textarea 
                      rows={3}
                      required
                      value={rescheduleMessage}
                      onChange={e => setRescheduleMessage(e.target.value)}
                      placeholder="Specify conflict details (e.g. internet disruption, power outage scheduling)..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setRescheduleItem(null)} className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold transition-all cursor-pointer">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer">Request</button>
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
