"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ==========================================
// Shared Types
// ==========================================

export interface Job {
  id: string;
  title: string;
  type: string;
  rate: number;
  status: "active" | "draft" | "closed";
  applicants: number;
  postedDate: string;
  schedule?: string;
}

// ==========================================
// Inline SVG Icons
// ==========================================

const IconBriefcase = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconPlus = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconArrowRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconUsers = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

// ==========================================
// Status Badge
// ==========================================

function JobStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-500/10 border-emerald-500/25",
    draft:  "text-amber-700 bg-amber-500/10 border-amber-500/25",
    closed: "text-slate-500 bg-slate-200/60 border-slate-300/50",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${styles[status] || styles.draft}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-500 animate-pulse" : status === "draft" ? "bg-amber-500" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}

// ==========================================
// JobsMainFeed Component
// ==========================================

export default function JobsMainFeed() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "closed">("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/client/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (e) {
        console.error("Failed to load jobs", e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadJobs();
  }, []);

  const handleToggleStatus = (id: string, next: "active" | "closed") => {
    // API endpoint for toggling status not yet implemented
    alert("Status toggling will be connected to the backend soon!");
  };

  const filtered = jobs.filter(j => activeTab === "all" || j.status.toLowerCase() === activeTab);

  if (!isLoaded) {
    return (
      <main className="lg:col-span-6 h-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E84E29] border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">

      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-[#E84E29]/5 via-white to-amber-50/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">My Job Posts</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Monitor listings, track applicants, and toggle statuses.
            </p>
          </div>
          <Link
            href="/client/post-job"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm"
          >
            <IconPlus className="w-3.5 h-3.5" />
            Post a Job
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2.5 mt-5 border-t border-slate-100 pt-4">
          {(["all", "active", "draft", "closed"] as const).map((tab) => {
            const count = tab === "all" ? jobs.length : jobs.filter(j => j.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize cursor-pointer ${
                  activeTab === tab
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Feed Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <IconBriefcase className="w-7 h-7 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No jobs found</h4>
            <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs mx-auto">
              {activeTab === "all"
                ? "You haven't posted any jobs yet. Create a listing to find talent."
                : `No jobs match the status "${activeTab}".`}
            </p>
            {activeTab === "all" && (
              <Link
                href="/client/post-job"
                className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm"
              >
                <IconPlus className="w-3.5 h-3.5" />
                Post Your First Job
              </Link>
            )}
          </div>
        ) : (
          filtered.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <JobStatusBadge status={job.status} />
                    <span className="text-[10px] font-semibold text-slate-400">Posted {job.postedDate}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight group-hover:text-[#E84E29] transition-colors">
                    {job.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><IconBriefcase className="w-3 h-3 text-slate-400" />{job.type}</span>
                    <span className="flex items-center gap-1"><IconUsers className="w-3.5 h-3.5 text-slate-400" />{job.applicants} applicant{job.applicants !== 1 ? "s" : ""}</span>
                    {job.schedule && <span className="flex items-center gap-1"><IconClock className="w-3 h-3 text-slate-400" />{job.schedule}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-slate-800">${job.rate.toFixed(2)}</p>
                  <p className="text-[10px] font-semibold text-slate-400">/hr</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Link
                    href="/client/shortlisted-candidates"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs"
                  >
                    View Applicants <IconArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/client/post-job"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
                  >
                    Edit
                  </Link>
                </div>
                <div>
                  {job.status === "active" && (
                    <button
                      onClick={() => handleToggleStatus(job.id, "closed")}
                      className="px-3.5 py-1.5 rounded-full text-[10px] font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      Close Job
                    </button>
                  )}
                  {job.status === "closed" && (
                    <button
                      onClick={() => handleToggleStatus(job.id, "active")}
                      className="px-3.5 py-1.5 rounded-full text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                    >
                      Reopen Job
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
