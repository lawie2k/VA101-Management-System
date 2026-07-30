"use client";

import React from "react";

interface Application {
  id: string;
  status: string;
}

interface ApplicationsRightSidebarProps {
  applications: Application[];
}

export default function ApplicationsRightSidebar({
  applications,
}: ApplicationsRightSidebarProps) {
  return (
    <aside className="lg:col-span-3 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Application Summary</h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Overview of active applications</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Total Submitted</span>
            <span className="text-sm font-black text-slate-800">{applications.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Screening Phase</span>
            <span className="text-sm font-black text-[#E84E29]">{applications.filter(a => a.status === "screening").length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Offer Stage</span>
            <span className="text-sm font-black text-slate-800">{applications.filter(a => a.status === "offered").length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
