"use client";

import { useState, useEffect } from "react";

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

const IconCheck = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconUserPlus = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const IconUserX = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="18" y1="8" x2="23" y2="13" />
    <line x1="23" y1="8" x2="18" y2="13" />
  </svg>
);

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

export default function InterviewsMainFeed() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "hire" | "reject" } | null>(null);

  useEffect(() => {
    loadInterviews();
  }, []);

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

  async function handleMarkDone(interviewId: string) {
    setActionLoading(interviewId);
    try {
      const res = await fetch(`/api/client/interviews/${interviewId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        // Update local state immediately
        setInterviews(prev => prev.map(i => i.id === interviewId ? { ...i, status: "Completed" } : i));
      }
    } catch (e) {
      console.error("Failed to mark interview as done", e);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDecision(interviewId: string, action: "hire" | "reject") {
    setActionLoading(interviewId);
    setConfirmAction(null);
    try {
      const res = await fetch(`/api/client/interviews/${interviewId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        // Remove from the list instantly
        setInterviews(prev => prev.filter(i => i.id !== interviewId));
      }
    } catch (e) {
      console.error("Failed to process decision", e);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-blue-50/50 to-white">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Interviews</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage your upcoming and past candidate interviews.
        </p>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 && !loading && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No Interviews</p>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              You don&apos;t have any active interviews right now. When you schedule one from the Candidates page, it will appear here.
            </p>
          </div>
        )}

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

            {/* Upcoming: show Join Meeting + Mark as Done */}
            {interview.status === "Upcoming" && (
              <div className="flex items-center justify-between pt-2">
                <a 
                  href={isMeetingTime(interview.raw_scheduled_at) ? interview.meetLink || "#" : "#"} 
                  target={isMeetingTime(interview.raw_scheduled_at) ? "_blank" : undefined} 
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!isMeetingTime(interview.raw_scheduled_at)) {
                      e.preventDefault();
                      alert("It's not time for this meeting yet!");
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold shadow-sm transition-all ${
                    isMeetingTime(interview.raw_scheduled_at)
                      ? "text-white bg-[#E84E29] hover:bg-[#DA431E]"
                      : "text-slate-400 bg-slate-200 cursor-not-allowed"
                  }`}
                >
                  <IconVideo className="w-4 h-4" /> Join Meeting
                </a>
                <button 
                  onClick={() => handleMarkDone(interview.id)}
                  disabled={actionLoading === interview.id}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <IconCheck className="w-3.5 h-3.5" />
                  {actionLoading === interview.id ? "Updating..." : "Mark as Done"}
                </button>
              </div>
            )}

            {/* Completed: show Hire / Reject */}
            {interview.status === "Completed" && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Make Your Decision</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setConfirmAction({ id: interview.id, action: "hire" })}
                    disabled={actionLoading === interview.id}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <IconUserPlus className="w-4 h-4" /> Hire Candidate
                  </button>
                  <button 
                    onClick={() => setConfirmAction({ id: interview.id, action: "reject" })}
                    disabled={actionLoading === interview.id}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <IconUserX className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className={`h-2 ${confirmAction.action === "hire" ? "bg-emerald-500" : "bg-red-500"}`} />
            <div className="p-6 text-center space-y-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                confirmAction.action === "hire" 
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-600" 
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}>
                {confirmAction.action === "hire" 
                  ? <IconUserPlus className="w-6 h-6" /> 
                  : <IconUserX className="w-6 h-6" />
                }
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {confirmAction.action === "hire" ? "Hire This Candidate?" : "Reject This Candidate?"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1 max-w-xs mx-auto">
                  {confirmAction.action === "hire" 
                    ? "This will create an assignment and a draft contract for the Admin to finalize. The VA will be marked as hired." 
                    : "This will permanently remove this candidate from your interview list."
                  }
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button 
                  onClick={() => setConfirmAction(null)} 
                  className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold transition-all cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDecision(confirmAction.id, confirmAction.action)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold text-white transition-all cursor-pointer shadow-sm ${
                    confirmAction.action === "hire" 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {confirmAction.action === "hire" ? "Yes, Hire" : "Yes, Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
