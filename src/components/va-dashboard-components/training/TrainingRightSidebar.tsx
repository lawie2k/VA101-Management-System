"use client";

import React from "react";

interface Course {
  category: string;
}

interface TrainingRightSidebarProps {
  courses: Course[];
}

export default function TrainingRightSidebar({
  courses,
}: TrainingRightSidebarProps) {
  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Training Highlights</h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Accredited VA101 Catalog</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Total Courses</span>
            <span className="text-sm font-black text-slate-800">{courses.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Core Modules</span>
            <span className="text-sm font-black text-[#E84E29]">{courses.filter(c => c.category === "Core Training").length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Specializations</span>
            <span className="text-sm font-black text-slate-800">{courses.filter(c => c.category !== "Core Training").length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
