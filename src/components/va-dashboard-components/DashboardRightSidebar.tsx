"use client";

import React from "react";
import Link from "next/link";

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconBookmark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

interface Interview {
  id: string;
  type: string;
  jobTitle: string;
  company: string;
  scheduledAt: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  rate: number;
}

interface DashboardRightSidebarProps {
  mockInterviews: Interview[];
  mockJobs: Job[];
  savedJobs: string[];
}

export default function DashboardRightSidebar({
  mockInterviews,
  mockJobs,
  savedJobs,
}: DashboardRightSidebarProps) {
  const savedList = mockJobs.filter((j) => savedJobs.includes(j.id));

  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      
      {/* Upcoming Interviews widget */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Upcoming Interviews
        </h4>
        
        {mockInterviews.length === 0 ? (
          <p className="text-xs text-slate-400 font-semibold">No interviews scheduled yet.</p>
        ) : (
          <ul className="space-y-3.5">
            {mockInterviews.map((interview) => (
              <li key={interview.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-orange-650 bg-orange-50 border border-orange-150 rounded px-1.5 py-0.5">
                  {interview.type === "initial_interview" ? "HR Screening" : "Client Call"}
                </span>
                <h5 className="font-extrabold text-xs text-slate-800 leading-tight">
                  {interview.jobTitle}
                </h5>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {interview.company}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-550 font-bold pt-1">
                  <IconClock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{interview.scheduledAt}</span>
                </div>
                
                <button className="w-full inline-flex items-center justify-center py-2 border border-transparent rounded-full text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-xs">
                  Join Meeting
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Saved Jobs list widget */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Saved Jobs
        </h4>
        <ul className="space-y-3">
          {savedList.length === 0 ? (
            <p className="text-xs text-slate-400 font-semibold">No jobs bookmarked yet.</p>
          ) : (
            savedList.map((job) => (
              <li key={`saved-${job.id}`} className="flex items-start gap-2 text-xs">
                <IconBookmark className="mt-0.5 w-3.5 h-3.5 shrink-0 text-[#E84E29]" />
                <div className="min-w-0">
                  <Link 
                    href={`/va/jobs`} 
                    className="block font-bold text-slate-800 truncate hover:underline"
                  >
                    {job.title}
                  </Link>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {job.company} • ${job.rate.toFixed(2)}/hr
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

    </aside>
  );
}
