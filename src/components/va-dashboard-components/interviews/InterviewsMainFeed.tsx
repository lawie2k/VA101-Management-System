"use client";

import React from "react";

const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconVideo = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z"></path>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconMessage = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

interface Interview {
  id: string;
  type: string;
  jobTitle: string;
  company: string;
  interviewer: string;
  scheduledAt: string;
  platform: string;
  meetingLink?: string;
}

interface InterviewsMainFeedProps {
  interviews: Interview[];
  setRescheduleItem: (item: any) => void;
  setProposedTime: (time: string) => void;
  setRescheduleMessage: (msg: string) => void;
  triggerMeetingLaunch: (platform: string) => void;
}

const isMeetingTime = (scheduledIsoStr: string | null) => {
  if (!scheduledIsoStr) return false;
  try {
    const meetingDate = new Date(scheduledIsoStr);
    const now = new Date();
    const diffInMinutes = (meetingDate.getTime() - now.getTime()) / 60000;
    
    // Allow joining up to 10 minutes early
    return diffInMinutes <= 10;
  } catch (e) {
    return false;
  }
};

export default function InterviewsMainFeed({
  interviews,
  setRescheduleItem,
  setProposedTime,
  setRescheduleMessage,
  triggerMeetingLaunch,
}: InterviewsMainFeedProps) {
  return (
    <main 
      onScroll={(e) => {
        window.dispatchEvent(new CustomEvent("feedScroll", { detail: { scrollTop: e.currentTarget.scrollTop } }));
      }}
      className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6"
    >
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Interviews & Calls</h2>
        <p className="text-xs font-semibold text-slate-450 mt-1">Join video links or manage schedules for client pre-qualification interviews.</p>
      </div>

      <div className="space-y-4">
        {interviews.length > 0 ? (
          interviews.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-orange-650 bg-orange-50 border border-orange-100 rounded px-1.5 py-0.5">
                    {item.type === "initial" || item.type === "initial_interview" ? "Initial Interview" : "Final Interview"}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug mt-2.5">{item.jobTitle}</h3>
                  <p className="text-xs text-slate-555 font-semibold">{item.company} • Meet with <strong className="text-slate-800">{item.interviewer}</strong></p>
                </div>
                <span className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                  <IconMessage className="w-4 h-4" />
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-650 font-bold">
                <div className="flex items-center gap-2">
                  <IconCalendar className="w-4 h-4 text-[#E84E29]" />
                  <span>{item.scheduledAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconVideo className="w-4 h-4 text-[#E84E29]" />
                  <span>{item.platform}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  onClick={() => { setRescheduleItem(item); setProposedTime(""); setRescheduleMessage(""); }}
                  className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-slate-350 bg-white text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Reschedule
                </button>
                <button 
                  onClick={(e) => {
                    if (!isMeetingTime(item.scheduledAt)) {
                      e.preventDefault();
                      alert("It's not time for this meeting yet!");
                      return;
                    }
                    if (item.meetingLink) {
                      window.open(item.meetingLink, "_blank");
                    } else {
                      triggerMeetingLaunch(item.platform);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isMeetingTime(item.scheduledAt) 
                      ? "text-white bg-slate-900 hover:bg-slate-800" 
                      : "text-slate-400 bg-slate-200 cursor-not-allowed"
                  }`}
                >
                  Join Meeting <IconChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No Scheduled Interviews</p>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              You don't have any interviews scheduled at the moment. When a client invites you to a meeting, it will appear here!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
