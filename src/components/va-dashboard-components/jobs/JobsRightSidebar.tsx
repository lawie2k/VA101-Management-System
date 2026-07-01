"use client";

import React from "react";

interface Job {
  id: string;
  title: string;
  company: string;
  rate: number;
  type: string;
}

interface JobsRightSidebarProps {
  jobs: Job[];
  savedJobs: string[];
  toggleSaveJob: (id: string) => void;
}

export default function JobsRightSidebar({
  jobs,
  savedJobs,
  toggleSaveJob,
}: JobsRightSidebarProps) {
  const savedItems = jobs.filter(j => savedJobs.includes(j.id));

  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Saved Jobs</h3>
          <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Quick access to bookmarked roles</p>
        </div>

        {savedItems.length > 0 ? (
          <div className="space-y-3.5">
            {savedItems.map((job) => (
              <div 
                key={job.id} 
                className="p-3.5 bg-slate-50/70 border border-slate-150 rounded-2xl transition-all hover:bg-slate-100/40"
              >
                <h4 className="text-xs font-bold text-slate-850 truncate pr-5">{job.title}</h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{job.company} • ${job.rate.toFixed(2)}/hr</p>
                
                {/* Fast Navigation buttons */}
                <div className="mt-2.5 flex justify-between items-center">
                  <span className="text-[9px] font-extrabold text-[#E84E29] uppercase tracking-wider">{job.type}</span>
                  <button 
                    onClick={() => toggleSaveJob(job.id)} 
                    className="text-[9px] font-bold text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">No saved jobs yet</p>
            <p className="text-[9px] font-medium text-slate-450 mt-1 max-w-[150px] mx-auto leading-relaxed">
              Click the bookmark icon on any job card to save it here.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
