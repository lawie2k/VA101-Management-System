"use client";

import React from "react";

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

interface DashboardLeftSidebarProps {
  profileState: {
    fullName: string;
    title: string;
    location: string;
    avatar: string | null;
    coverImage: string | null;
    availability: string;
    completion: number;
    skills: string[];
  };
  profileViews: number;
  defaultCoverImage: string;
}

export default function DashboardLeftSidebar({
  profileState,
  profileViews,
  defaultCoverImage,
}: DashboardLeftSidebarProps) {
  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {/* Cover Banner */}
        <div 
          className="h-20 bg-cover bg-center border-b border-slate-200 bg-slate-900" 
          style={{ backgroundImage: `url(${profileState.coverImage || defaultCoverImage})` }}
        />
        
        {/* User Avatar overlay */}
        <div className="px-6 pb-6 relative">
          <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-sm absolute -top-8 left-6 bg-slate-50">
            {profileState.avatar ? (
              <img 
                src={profileState.avatar} 
                alt={profileState.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-sm">
                {profileState.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Spacer */}
          <div className="h-10" />

          {/* Profile Details */}
          <h3 className="font-extrabold text-slate-900 text-base leading-tight">
            {profileState.fullName}
          </h3>
          <p className="text-xs text-slate-550 font-medium mt-0.5">
            {profileState.title}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-2">
            <IconMapPin className="w-3.5 h-3.5" />
            <span>{profileState.location}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-orange-700 bg-orange-500/10 border border-orange-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {profileState.availability}
            </span>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Profile Strength</span>
              <span className="text-orange-650">{profileState.completion}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#E84E29] h-full rounded-full transition-all duration-500" 
                style={{ width: `${profileState.completion}%` }}
              />
            </div>
          </div>

          {/* Analytics */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-start">
            <div>
              <p className="text-lg font-black text-slate-800">{profileViews}</p>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Profile Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Tools Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Top Core Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {profileState.skills.map((skill) => (
            <span 
              key={skill} 
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100/70 border border-slate-200/50 rounded-lg"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
