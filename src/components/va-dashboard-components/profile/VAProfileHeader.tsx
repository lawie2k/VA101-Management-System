import React from "react";
import { PCard, Button, CtaButton } from "./VAProfileUI";
import { IconMapPin, IconEye, IconPencil } from "./VAProfileIcons";
import { VAProfileData } from "./types";

interface VAProfileHeaderProps {
  profile: VAProfileData;
  initials: string;
  openEditAvatar: () => void;
  openEditCover: () => void;
  openEditProfile: () => void;
}

export function VAProfileHeader({ profile, initials, openEditAvatar, openEditCover, openEditProfile }: VAProfileHeaderProps) {
  return (
    <PCard className="overflow-hidden p-0 relative hover:scale-[1.002] transition-transform duration-500">
      <div 
        className="h-40 bg-cover bg-center border-b border-slate-200 bg-black relative group"
        style={{ backgroundImage: `url(${profile.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80"})` }}
      >
        <button 
          type="button"
          onClick={openEditCover}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-900 hover:scale-110 transition-all shadow-md cursor-pointer flex items-center justify-center"
          title="Edit cover photo"
        >
          <IconPencil className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="px-6 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 relative">
            <div className="relative group shrink-0 z-10">
              <div className="w-34 h-34 rounded-full border-4 border-white overflow-hidden shadow-md relative bg-slate-50 -mt-20">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.fullName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-black text-white">
                    {initials}
                  </span>
                )}
              </div>
              <button 
                type="button"
                onClick={openEditAvatar}
                className="absolute bottom-0 left-0 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 hover:scale-110 transition-all shadow-md cursor-pointer flex items-center justify-center"
                title="Edit profile photo"
              >
                <IconPencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="pt-5 sm:pt-0">
              <h1 className="text-2xl  font-black tracking-tight text-slate-900">{profile.fullName}</h1>
              <p className="text-sm font-semibold text-slate-500">{profile.title} · {profile.experienceYears} yrs experience</p>
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-400">
                <IconMapPin className="h-3.5 w-3.5 text-slate-400" /> {profile.location} · {profile.niche} niche
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:pt-5">
            <CtaButton className="rounded-full flex items-center gap-1.5 text-xs py-2 px-5 shadow-md" onClick={openEditProfile}>
              <IconPencil className="h-4 w-4" /> Edit profile
            </CtaButton>
          </div>
        </div>
        
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          {profile.openToOpportunities ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-700 bg-orange-500/10 border border-orange-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
               Open to opportunities
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-550 bg-slate-50 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
               Unavailable
            </span>
          )}
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected rate</span>
          <span className="font-extrabold text-slate-900 text-base">${profile.expectedRate}/hr</span>
        </div>
      </div>
    </PCard>
  );
}
