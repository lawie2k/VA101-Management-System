"use client";

import { useState, useEffect } from "react";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80";

export default function TrainerLeftSidebar() {
  const [profile, setProfile] = useState({
    fullName: "",
    expertise: "",
    avatar: null as string | null,
    coverImage: null as string | null,
    completion: 0
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const updateState = (data: any) => {
    setProfile({
      fullName: data.fullName || "Welcome, Trainer",
      expertise: data.expertise || "Set up your profile to start uploading courses.",
      avatar: data.avatar || null,
      coverImage: data.coverImage || null,
      completion: (() => {
        let score = 10;
        if (data.bio && data.bio.length > 0) score += 30;
        if (data.expertise && data.expertise.length > 0) score += 30;
        score += 30; // Assuming stripeConnected is true for trainers
        return Math.min(score, 100);
      })()
    });
  };

  useEffect(() => {
    function loadProfile() {
      const savedProfile = localStorage.getItem("trainer_profile_data");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          updateState(parsed);
        } catch (e) {
          console.error("Error parsing trainer profile", e);
        }
      } else {
        // Fetch fresh data if not in local storage
        async function fetchProfile() {
          try {
            const res = await fetch("/api/trainer/profile");
            if (res.ok) {
              const data = await res.json();
              if (data && data.status !== "draft") {
                localStorage.setItem("trainer_profile_data", JSON.stringify(data));
                updateState(data);
              }
            }
          } catch (e) {
            console.error("Failed to fetch trainer profile", e);
          }
        }
        fetchProfile();
      }
      setIsLoaded(true);
    }

    loadProfile();

    window.addEventListener("trainerProfileUpdate", loadProfile);
    return () => window.removeEventListener("trainerProfileUpdate", loadProfile);
  }, []);

  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
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
              <span className="grid h-full w-full place-items-center bg-gradient-to-br from-[#E84E29] to-amber-500 text-white font-extrabold text-sm">
                {profile.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Spacer */}
          <div className="h-10" />

          {/* Profile Details */}
          <h3 className="font-extrabold text-slate-900 text-base leading-tight">
            {isLoaded ? profile.fullName : "Loading..."}
          </h3>
          <p className="text-xs text-slate-550 font-medium mt-0.5">
            {isLoaded ? profile.expertise : "Loading expertise..."}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100">
            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Trainer
            </span>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Profile Strength</span>
              <span className="text-[#E84E29]">{profile.completion}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#E84E29] h-full rounded-full transition-all duration-500" 
                style={{ width: `${profile.completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs mt-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Total Courses</span>
            <span className="text-sm font-black text-slate-900">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Total Students</span>
            <span className="text-sm font-black text-slate-900">0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
