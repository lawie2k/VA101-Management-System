"use client";

import { IconAward, IconCertificate, IconRocket } from "../StudentIcons";

export default function StudentRightSidebar() {
  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Certifications & Goals */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E84E29] to-orange-500 flex items-center justify-center shadow-inner">
            <IconAward className="text-white w-5 h-5" stroke={2} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Achievements</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Milestones</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
              <IconCertificate className="text-emerald-500 w-4 h-4" stroke={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Platform Basics</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">Completed Setup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Trainings */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 p-6 shadow-lg relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E84E29] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <IconRocket className="text-[#E84E29] w-5 h-5" stroke={2} />
            <h3 className="font-extrabold text-white text-sm">Level Up!</h3>
          </div>
          <p className="text-xs font-medium text-slate-300 leading-relaxed mb-5">
            Browse premium training materials posted by top trainers to fast-track your VA career.
          </p>
          
          <button className="w-full bg-[#E84E29] hover:bg-[#d03d1c] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 active:scale-95">
            Explore Catalog
          </button>
        </div>
      </div>

    </div>
  );
}
