"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VALeftSidebar from "../../../../components/va-dashboard-components/VALeftSidebar";
import LearningMainFeed from "../../../../components/va-dashboard-components/learning/LearningMainFeed";
import LearningRightSidebar from "../../../../components/va-dashboard-components/learning/LearningRightSidebar";

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

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconAward = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const IconPlay = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
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


const COURSE_INFOS = {
  "c-1": { title: "VA101 Professional Ethics & Standards", category: "Core Training", lessons: ["Professional Communication", "Client Privacy & NDAs", "Reporting Activity Logs", "Managing Boundaries"] },
  "c-2": { title: "Advanced Client Lead Generation Strategies", category: "Marketing & Sales", lessons: ["Lead Profile Target Research", "Cold Email Outbox Setup", "Scripting High Conversion Mail", "Outreach Analytics tracking"] },
  "c-3": { title: "CRM Administration & Contact Matrix Handling", category: "Operations", lessons: ["CRM Dashboard Basics", "Lead Pipeline Management", "Properties and Tagging", "Automation Triggers"] },
  "c-4": { title: "Shopify Store Support & Inventory Handling", category: "E-commerce Support", lessons: ["Shopify Dashboard Overview", "Fulfillment Operations", "Return & Refund Policy", "Zendesk Integration"] }
};

export default function VAMyLearningPage() {
  const [profileState, setProfileState] = useState(DEFAULT_PROFILE);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});

  // Interactive video modal player state
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const getCourseInfo = (id: string | null) => {
    if (!id) return null;
    const dynamicCourse = courses.find((c: any) => c.id === id);
    if (dynamicCourse) {
      return {
        title: dynamicCourse.title,
        category: dynamicCourse.category || "General",
        lessons: ["Course Material Overview", "Full Video Lecture"],
        invoice: `INV-${id.substring(0, 4)}`,
        amount: dynamicCourse.price === 0 ? 0 : dynamicCourse.price || 0,
        paymentDate: dynamicCourse.createdAt || new Date().toISOString(),
        classStartDate: dynamicCourse.createdAt || new Date().toISOString()
      };
    }
    const key = !id.startsWith("c-") ? `c-${id}` : id;
    return COURSE_INFOS[key as keyof typeof COURSE_INFOS] || COURSE_INFOS["c-1"];
  };

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

    async function fetchPurchases() {
      try {
        const res = await fetch("/api/va/training/purchases");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const courseIds = data.map(item => item.courseId);
            const progressMap: Record<string, number> = {};
            data.forEach(item => {
              progressMap[item.courseId] = item.progress || 0;
            });
            setEnrolledCourses(courseIds);
            setCourseProgress(progressMap);
          } else {
            setEnrolledCourses([]);
            setCourseProgress({});
          }
        }
      } catch (e) {
        console.error("Failed to load training purchases:", e);
      }
    }
    
    async function fetchCourses() {
      try {
        const res = await fetch("/api/va/training/materials");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCourses(data);
          }
        }
      } catch (e) {
        console.error("Failed to load courses:", e);
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

  const handleLessonComplete = () => {
    if (!activeCourseId) return;
    const course = getCourseInfo(activeCourseId);
    if (!course) return;
    const totalLessons = course.lessons.length;
    const nextProgress = Math.min(100, Math.round(((activeLessonIndex + 1) / totalLessons) * 100));

    const updatedProgress = { ...courseProgress, [activeCourseId]: nextProgress };
    setCourseProgress(updatedProgress);
    localStorage.setItem("va_course_progress", JSON.stringify(updatedProgress));

    setToastNotification(`Marked lesson complete! Progress: ${nextProgress}%`);
    setTimeout(() => setToastNotification(null), 3000);

    if (activeLessonIndex < totalLessons - 1) {
      setActiveLessonIndex(prev => prev + 1);
    } else {
      // Completed last lesson
      setToastNotification(`Congratulations! You completed ${course.title}!`);
      setActiveCourseId(null);
    }
  };

  const triggerCertificateDownload = (courseTitle: string) => {
    setToastNotification(`Downloading Certificate for ${courseTitle}...`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-144px)] overflow-visible lg:overflow-hidden">
      
      {/* Toast Alert Simulation */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-slate-700 text-white rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <IconAward className="w-5 h-5 text-[#E84E29]" />
          <span className="text-xs font-bold">{toastNotification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-visible lg:overflow-hidden">
        
        <VALeftSidebar hideOnMobile={true} />

        <LearningMainFeed 
          courses={courses}
          enrolledCourses={enrolledCourses}
          courseProgress={courseProgress}
          setActiveCourseId={setActiveCourseId}
          setActiveLessonIndex={setActiveLessonIndex}
        />

        <LearningRightSidebar 
          enrolledCourses={enrolledCourses}
          courseProgress={courseProgress}
        />

      </div>

      {/* DYNAMIC LESSON PLAYER MODAL */}
      {activeCourseId && getCourseInfo(activeCourseId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-250">
            <div className="h-2 bg-[#E84E29]" />
            <div className="p-6">
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#E84E29] uppercase tracking-wider">Course Player</span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">{getCourseInfo(activeCourseId)?.title}</h3>
                </div>
                <button onClick={() => setActiveCourseId(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              {/* Open Secure Viewer Action */}
              <div className="aspect-video bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #000 20px)' }}></div>
                <span className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#E84E29] shadow-sm mb-4 relative z-10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1 max-w-[320px] relative z-10">{getCourseInfo(activeCourseId)?.title}</h4>
                <p className="text-xs text-slate-500 mt-2 max-w-[280px] relative z-10">Click below to open the secure document reader in a new tab.</p>
                <a 
                  href={`/secure-viewer?url=${encodeURIComponent((getCourseInfo(activeCourseId) as any)?.materialUrl || "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKER1bW15IFBERikKLUNyZWF0b3IgKER1bW15KQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs0IDAgUl0KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMCA1IDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA1OTUuMjc2IDg0MS44OV0KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQzCj4+CnN0cmVhbQpCVAovRjAgMjQgVGYKMTAwIDcwMCBUZAooU2FtcGxlIFBERiBDb3VudGVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAwOSAwMDAwMCBuCjAwMDAwMDAwNzQgMDAwMDAgbgowMDAwMDAwMTIzIDAwMDAwIG4KMDAwMDAwMDE3OSAwMDAwMCBuCjAwMDAwMDAyOTYgMDAwMDAgbgowMDAwMDAwMzg0IDAwMDAwIG4KdHJhaWxlcgo8PAovU2l6ZSA3Ci9Sb290IDIgMCBSCj4+CnN0YXJ0eHJlZgo0NzcKJSVFT0YK")}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-5 px-6 py-3 bg-[#E84E29] border border-transparent rounded-full text-xs font-bold tracking-widest uppercase text-white hover:bg-[#d03d1c] hover:shadow-lg transition-all shadow-md relative z-10 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Open in New Tab
                </a>
              </div>

              <div className="mt-5">
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Read the document carefully. Upon completion, click Mark Complete to update your progress index.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-5">
                <button type="button" onClick={() => setActiveCourseId(null)} className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold transition-all cursor-pointer">Close</button>
                <button 
                  onClick={handleLessonComplete}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Mark Complete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
