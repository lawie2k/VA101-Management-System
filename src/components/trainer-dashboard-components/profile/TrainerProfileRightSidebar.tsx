import React from "react";

export function TrainerProfileRightSidebar({ profile }: { profile: any }) {
  const completionScore = 10 + (profile.bio ? 30 : 0) + (profile.expertise ? 30 : 0) + (profile.veemConnected ? 30 : 0);

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
          <li className="flex items-center gap-2">
            {profile.veemConnected ? "✅" : "⚠️"} Veem Connect ({profile.veemConnected ? "Complete" : "Needs work"})
          </li>
        </ul>
      </div>

      {/* Payout Details */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">Payout Method</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF]/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#635BFF]" viewBox="0 0 40 40" fill="none">
                <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm6.92 14.625c-.244-2.617-2.314-4.524-5.467-4.524-3.69 0-6.19 2.222-6.19 5.642 0 6.643 9.077 5.438 9.077 8.358 0 1.25-.976 1.933-2.42 1.933-1.802 0-2.825-.87-3.21-2.26l-3.327.535c.58 2.617 2.802 4.6 6.37 4.6 4.015 0 6.45-2.235 6.45-5.748 0-6.84-9.077-5.542-9.077-8.373 0-1.07.915-1.764 2.225-1.764 1.512 0 2.457.755 2.72 1.986l3.327-.552-.477-4.832v4.999z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Veem Connect</p>
              <p className="text-[10px] font-semibold text-slate-500">Connected</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"></span>
          </div>
          
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
            <p className="font-bold text-emerald-700 text-sm">70% revenue share</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600/70 leading-relaxed">
              Platform retains 30% to cover hosting, payment ops, and marketing.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
