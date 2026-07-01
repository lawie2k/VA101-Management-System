"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const IconVideo = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function InterviewsMainFeed() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterviews() {
      try {
        const res = await fetch("/api/client/interviews");
        if (res.ok) {
          const data = await res.json();
          setInterviews(data);
        }
      } catch (e) {
        console.error("Failed to load interviews", e);
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, []);

  return (
    <main className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-blue-50/50 to-white">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Interviews</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage your upcoming and past candidate interviews.
        </p>
      </div>

      <div className="space-y-4">
        {interviews.map(interview => (
          <div key={interview.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#E84E29] transition-colors">{interview.candidateName}</h3>
                <p className="text-xs text-slate-500 font-medium">{interview.role}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                interview.status === "Upcoming" 
                  ? "text-blue-700 bg-blue-50 border-blue-200" 
                  : "text-emerald-700 bg-emerald-50 border-emerald-200"
              }`}>
                {interview.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <IconCalendar className="w-3.5 h-3.5 text-slate-400" />
                {interview.date}
              </div>
              <div className="flex items-center gap-1.5">
                <IconClock className="w-3.5 h-3.5 text-slate-400" />
                {interview.time}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {interview.status === "Upcoming" ? (
                <a 
                  href={interview.meetLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] shadow-sm transition-all"
                >
                  <IconVideo className="w-4 h-4" /> Join Meeting
                </a>
              ) : (
                <button className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer">
                  Leave Feedback
                </button>
              )}
              
              {interview.status === "Upcoming" && (
                <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  Reschedule
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
