"use client";

import React from "react";

interface Interview {
  id: string;
}

interface InterviewsRightSidebarProps {
  interviews: Interview[];
}

export default function InterviewsRightSidebar({
  interviews,
}: InterviewsRightSidebarProps) {
  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Interviews Summary</h3>
          <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Overview of scheduled calls</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Upcoming Calls</span>
            <span className="text-sm font-black text-[#E84E29]">{interviews.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Pending Review</span>
            <span className="text-sm font-black text-slate-800">0</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Completed</span>
            <span className="text-sm font-black text-slate-800">0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
