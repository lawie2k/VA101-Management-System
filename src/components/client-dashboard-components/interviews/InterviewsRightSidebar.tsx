"use client";

export default function InterviewsRightSidebar() {
  return (
    <aside className="lg:col-span-3 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Interview Prep</h4>
        <div className="space-y-4">
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-900">Be Punctual</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Join the meeting link 2-3 minutes early to ensure your audio and video are working perfectly.
            </p>
          </div>
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-900">Prepare Questions</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Have a list of role-specific questions ready. Focus on their experience with your preferred tools.
            </p>
          </div>
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-900">Need to Reschedule?</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Please give at least 24 hours notice if you need to change the interview time.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
