import React from "react";
import { PCard, PCardHeader, Button } from "./VAProfileUI";
import { IconEye, IconBarChart3, IconBriefcase, IconSparkles, IconPencil } from "./VAProfileIcons";
import { VAProfileData } from "./types";

export function VAProfileRightSidebar({ profile, strength, openEditAvailability }: any) {
  return (
    <div className="space-y-4">
        <div className="space-y-4">
          
          {/* PROFILE COMPLETION RADAR */}
          <PCard className="hover:border-slate-350">
            <PCardHeader title="Profile completion" />
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-500">Overall Score</span>
              <span className="text-[#E84E29]">{strength}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#E84E29] h-full rounded-full transition-all duration-750" 
                style={{ width: `${strength}%` }}
              />
            </div>
            <ul className="mt-3.5 space-y-1.5 text-[11px] font-bold text-slate-500">
              <li className="flex items-center gap-1.5">
                {profile.about.length > 20 ? "✅" : "⚠️"} About summary ({profile.about.length > 20 ? "Complete" : "Needs work"})
              </li>
              <li className="flex items-center gap-1.5">
                {profile.portfolio.length >= 2 ? "✅" : "⚠️"} Portfolio ({profile.portfolio.length}/2+ samples)
              </li>
              <li className="flex items-center gap-1.5">
                {profile.experience.length > 0 ? "✅" : "⚠️"} Work experience ({profile.experience.length} listed)
              </li>
              <li className="flex items-start gap-1.5 leading-snug">
                <span>{(profile.skills.length >= 1 && profile.tools.length >= 1) ? "✅" : "⚠️"}</span> 
                <span>Skills & Tools (Requires 1+ skills and 1+ tools)</span>
              </li>
            </ul>
          </PCard>

          {/* PROFILE ANALYTICS STATS */}
          <PCard className="hover:border-slate-350">
            <PCardHeader title="Profile analytics" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-[#E84E29]"><IconEye className="h-4.5 w-4.5" /></span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Profile views</p>
                  <p className="text-xs font-black text-slate-800">0 this week</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-[#E84E29]"><IconBarChart3 className="h-4.5 w-4.5" /></span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Search appearances</p>
                  <p className="text-xs font-black text-slate-800">0 times</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-[#E84E29]"><IconBriefcase className="h-4.5 w-4.5" /></span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Application views</p>
                  <p className="text-xs font-black text-slate-800">0 by verified clients</p>
                </div>
              </div>
            </div>
          </PCard>

          {/* SUGGESTED IMPROVEMENTS */}
          <PCard className="bg-amber-50/40 border border-amber-100 p-5">
            <PCardHeader 
              title="Suggested improvements" 
              action={<IconSparkles className="h-4.5 w-4.5 text-amber-500" />} 
            />
            <ul className="space-y-3 text-xs leading-relaxed font-semibold text-slate-650">
              <li className="flex items-start gap-2 bg-white/70 border border-amber-100/70 p-2.5 rounded-xl">
                <span>🎥</span>
                <p>Add a 30-sec intro video — boosts shortlists by 2.4×.</p>
              </li>
              <li className="flex items-start gap-2 bg-white/70 border border-amber-100/70 p-2.5 rounded-xl">
                <span>📂</span>
                <p>Add {profile.portfolio.length < 2 ? "another" : "a third"} portfolio work sample to showcase your range.</p>
              </li>
            </ul>
          </PCard>


        </div>
    </div>
  );
}
