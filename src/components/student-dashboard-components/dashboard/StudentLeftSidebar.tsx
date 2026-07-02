"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
// MapPin not needed here

const DEFAULT_COVER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80";

interface StudentProfile {
  id?: string;
  fullName: string;
  phone?: string;
  learningGoal: string;
  avatarUrl?: string;
  coverImage?: string;
}

export default function StudentLeftSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: "Loading...",
    learningGoal: "Loading profile...",
  });

  const loadProfile = () => {
    const saved = localStorage.getItem("student_profile_data");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse student profile data");
      }
    } else {
      fetch("/api/student/profile")
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setProfile(data);
            localStorage.setItem("student_profile_data", JSON.stringify(data));
          }
        })
        .catch(err => console.error("Failed to fetch student profile", err));
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener("studentProfileUpdate", loadProfile);
    return () => window.removeEventListener("studentProfileUpdate", loadProfile);
  }, []);

  const computeCompletion = (data: StudentProfile) => {
    let score = 20; // Base
    if (data.fullName?.trim() && data.fullName !== "Loading...") score += 20;
    if (data.phone?.trim()) score += 20;
    if (data.learningGoal?.trim() && data.learningGoal !== "Loading profile...") score += 40;
    return Math.min(score, 100);
  };

  const strength = computeCompletion(profile);

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
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center bg-gradient-to-br from-[#E84E29] to-orange-500 text-white font-extrabold text-sm">
                {profile.fullName && profile.fullName !== "Loading..."
                  ? profile.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                  : "ST"}
              </span>
            )}
          </div>
          
          {/* Spacer to push content below the floating avatar */}
          <div className="h-10" />

          {/* Profile Details */}
          <h3 className="font-extrabold text-slate-900 text-base leading-tight truncate">
            {profile.fullName}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
            Student
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Learning Goal</h4>
            <p className="text-xs font-medium text-slate-600 line-clamp-2">
              {profile.learningGoal || "No learning goal set yet."}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-orange-700 bg-orange-500/10 border border-orange-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Active Learner
            </span>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Profile Strength</span>
              <span className="text-[#E84E29]">{strength}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#E84E29] to-orange-400 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
          
        </div>
      </div>
    </aside>
  );
}
