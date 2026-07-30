"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconStar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DEFAULT_COVER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80";

export default function DashboardLeftSidebar({ hideOnMobile = false }: { hideOnMobile?: boolean } = {}) {
  const [profile, setProfile] = useState({
    fullName: "",
    title: "",
    location: "",
    avatar: null as string | null,
    coverImage: null as string | null,
    availability: "",
    completion: 0,
    skills: [] as string[]
  });
  const [views, setViews] = useState(0);
  const [feedbackData, setFeedbackData] = useState<{averageRating: number, totalReviews: number} | null>(null);

  const updateState = (data: any) => {
    setProfile({
      fullName: data.fullName || "",
      title: data.title || "",
      location: data.location || "",
      avatar: data.avatar || null,
      coverImage: data.coverImage || null,
      availability: data.openToOpportunities === false ? "Unavailable" : "Open to opportunities",
      completion: (() => {
        let score = 10;
        if (data.about?.length > 20) score += 20;
        if (data.portfolio?.length > 0) score += 20;
        if (data.portfolio?.length > 1) score += 10;
        if (data.experience?.length > 0) score += 20;
        if (data.skills?.length >= 1) score += 10;
        if (data.tools?.length >= 1) score += 10;
        return Math.min(score, 100);
      })(),
      skills: data.skills || []
    });
    if (data.views) {
      setViews(data.views);
    } else {
      setViews(0);
    }
  };

  useEffect(() => {
    // 1. Sync from local storage first for fast initial paint
    const saved = localStorage.getItem("va_profile_data");
    if (saved) {
      try {
        updateState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cached profile in sidebar:", e);
      }
    }

    // 2. Fetch fresh data from the profile endpoint
    async function syncProfile() {
      try {
        const res = await fetch("/api/va/profile");
        if (res.ok) {
          const freshData = await res.json();
          localStorage.setItem("va_profile_data", JSON.stringify(freshData));
          updateState(freshData);
        }
      } catch (err) {
        console.error("Failed to sync profile in sidebar:", err);
      }
    }
    syncProfile();

    async function syncFeedback() {
      try {
        const res = await fetch("/api/va/feedback");
        if (res.ok) {
          const fbData = await res.json();
          if (fbData.success) {
            setFeedbackData(fbData.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch feedback in sidebar:", err);
      }
    }
    syncFeedback();

    // 3. Listen to profile updates emitted across tabs/headers
    const handleProfileUpdate = () => {
      const updated = localStorage.getItem("va_profile_data");
      if (updated) {
        try {
          updateState(JSON.parse(updated));
        } catch {}
      }
    };
    window.addEventListener("profileUpdate", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdate", handleProfileUpdate);
    };
  }, []);

  return (
    <aside className={`lg:col-span-3 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6 ${hideOnMobile ? "hidden lg:block" : ""}`}>
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {/* Cover Banner */}
        <div 
          className="h-20 bg-cover bg-center border-b border-slate-200 bg-slate-900" 
          style={{ backgroundImage: `url(${profile.coverImage || DEFAULT_COVER})` }}
        />
        
        {/* User Avatar overlay */}
        <div className="px-6 pb-6 relative">
          <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-sm absolute -top-8 left-6 bg-slate-50">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-sm">
                {profile.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Spacer */}
          <div className="h-10" />

          {/* Profile Details */}
          <h3 className="font-extrabold text-slate-900 text-base leading-tight">
            {profile.fullName}
          </h3>
          <p className="text-xs text-slate-550 font-medium mt-0.5">
            {profile.title}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-2">
            <IconMapPin className="w-3.5 h-3.5" />
            <span>{profile.location}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-orange-700 bg-orange-500/10 border border-orange-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {profile.availability}
            </span>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Profile Strength</span>
              <span className="text-orange-650">{profile.completion}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#E84E29] h-full rounded-full transition-all duration-500" 
                style={{ width: `${profile.completion}%` }}
              />
            </div>
          </div>

          {/* Analytics & Ratings */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-start flex divide-x divide-slate-100">
            <div className="pr-5">
              <p className="text-lg font-black text-slate-800">{views}</p>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">Profile Views</p>
            </div>
            <div className="pl-5">
              <p className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                {feedbackData ? feedbackData.averageRating.toFixed(1) : "0.0"}
                <IconStar className="w-4 h-4 text-amber-400 fill-amber-400" />
              </p>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                Ratings ({feedbackData?.totalReviews || 0})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Tools Card */}
      {profile.skills.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
            Top Core Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span 
                key={skill} 
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100/70 border border-slate-200/50 rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
        <Link 
          href="/va/settings?tab=payouts" 
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800">Payout Settings</p>
              <p className="text-[10px] font-semibold text-slate-400">Manage earnings account</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </Link>
      </div>
    </aside>
  );
}
