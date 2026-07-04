import React from "react";
import { PCard, PCardHeader } from "./ProfileUI";
import { IconSparkles } from "./ProfileIcons";

interface StudentProfileSidebarProps {
  strength: number;
  profile: {
    fullName: string;
    learningGoal: string;
  };
}

export function StudentProfileSidebar({ strength, profile }: StudentProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* PROFILE COMPLETION SCORE */}
      <PCard className="hover:border-slate-350">
        <PCardHeader title="Profile completion" />
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-slate-500">Overall Score</span>
          <span className="text-[#E84E29]">{strength}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#E84E29] to-orange-400 h-full rounded-full transition-all duration-750" 
            style={{ width: `${strength}%` }}
          />
        </div>
        <ul className="mt-3.5 space-y-1.5 text-[11px] font-bold text-slate-500">
          <li className="flex items-center gap-1.5">
            {profile.fullName ? "✅" : "⚠️"} Full name
          </li>
          <li className="flex items-center gap-1.5">
            {profile.learningGoal ? "✅" : "⚠️"} Learning goal
          </li>
        </ul>
      </PCard>

    </div>
  );
}
