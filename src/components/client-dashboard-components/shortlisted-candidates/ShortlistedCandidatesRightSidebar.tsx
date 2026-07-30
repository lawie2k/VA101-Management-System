"use client";
import { useState, useEffect } from "react";

export default function ShortlistedCandidatesRightSidebar() {
  const [stats, setStats] = useState({ matches: 0, shortlisted: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/client/hiring-pipeline-stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to load pipeline stats:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <aside className="lg:col-span-3 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Hiring Pipeline</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-500">New Matches</span>
            {loading ? (
              <span className="w-4 h-4 rounded-full bg-slate-200 animate-pulse"></span>
            ) : (
              <span className="text-sm font-black text-slate-800">{stats.matches}</span>
            )}
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-500">Shortlisted</span>
            {loading ? (
              <span className="w-4 h-4 rounded-full bg-slate-200 animate-pulse"></span>
            ) : (
              <span className="text-sm font-black text-[#E84E29]">{stats.shortlisted}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Interviews</span>
            {loading ? (
              <span className="w-4 h-4 rounded-full bg-slate-200 animate-pulse"></span>
            ) : (
              <span className="text-sm font-black text-slate-800">{stats.interviews}</span>
            )}
          </div>
        </div>
      </div>

    </aside>
  );
}
