"use client";

import { useEffect, useState } from "react";

interface Job {
  id: string;
  status: "active" | "draft" | "closed";
  applicants: number;
}

// ==========================================
// JobsRightSidebar Component
// ==========================================

export default function JobsRightSidebar() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("client_mock_jobs");
    if (saved) {
      try { setJobs(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const active  = jobs.filter(j => j.status === "active").length;
  const draft   = jobs.filter(j => j.status === "draft").length;
  const total   = jobs.reduce((acc, j) => acc + j.applicants, 0);

  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">

      {/* Jobs Summary Analytics */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Jobs Summary</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-500">Active Positions</span>
            <span className="text-sm font-black text-slate-800">{active}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-500">Draft / Pending</span>
            <span className="text-sm font-black text-slate-800">{draft}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
            <span className="text-sm font-black text-[#E84E29]">{total}</span>
          </div>
        </div>
      </div>

      {/* Posting Guidelines */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Posting Guidelines</h4>
        <div className="space-y-4">
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-900">How long is the review?</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Our team reviews all draft posts within 12 hours. You'll be notified once live.
            </p>
          </div>
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-900">How do candidates apply?</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              VAs pitch for your active listings. We pre-screen and shortlist the top matches for you.
            </p>
          </div>
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-900">Editing listings</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              You can edit any listing at any time. Changes propagate immediately to active posts.
            </p>
          </div>
        </div>
      </div>

      {/* Tip Box */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/30 rounded-3xl p-5 shadow-xs">
        <div className="flex items-start gap-2.5">
          <span className="text-base leading-none">💡</span>
          <div>
            <p className="text-xs font-bold text-slate-900">Quick Tip</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-normal">
              Listings with specific tools (Slack, HubSpot, Notion) attract 3× more qualified applicants.
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}
