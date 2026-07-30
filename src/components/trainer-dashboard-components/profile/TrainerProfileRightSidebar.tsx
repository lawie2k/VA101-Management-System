import React from "react";

export function TrainerProfileRightSidebar({ profile }: { profile: any }) {
  const completionScore = 10 + (profile.bio ? 45 : 0) + (profile.expertise ? 45 : 0);

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-slate-300 transition-colors">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">Profile completion</h3>
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-slate-500">Overall Score</span>
          <span className="text-[#E84E29]">
            {completionScore}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
          <div 
            className="bg-[#E84E29] h-full rounded-full transition-all duration-700" 
            style={{ width: `${completionScore}%` }}
          />
        </div>
        <ul className="space-y-2 text-[11px] font-bold text-slate-500">
          <li className="flex items-center gap-2">
            {profile.bio ? "✅" : "⚠️"} About summary ({profile.bio ? "Complete" : "Needs work"})
          </li>
          <li className="flex items-center gap-2">
            {profile.expertise ? "✅" : "⚠️"} Expertise ({profile.expertise ? "Complete" : "Needs work"})
          </li>
        </ul>
      </div>

    </div>
  );
}
