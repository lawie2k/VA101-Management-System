"use client";

import React, { useState, useEffect } from "react";

const IconBuilding = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" /><path d="M16 6h.01" />
    <path d="M8 10h.01" /><path d="M16 10h.01" />
    <path d="M8 14h.01" /><path d="M16 14h.01" />
  </svg>
);

const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconUsers = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DEFAULT_COVER = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=300&q=80";

interface ClientProfile {
  companyName: string;
  industry: string;
  companySize: string;
  companyWebsite: string;
  companyDescription: string;
  billingContactName: string;
  billingEmail: string;
  billingPhone: string;
  avatar?: string | null;
  coverImage?: string | null;
}

export default function ClientLeftSidebar() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [completion, setCompletion] = useState(0);
  const [stats, setStats] = useState({ jobsPosted: 0, vasHired: 0, interviews: 0, contracts: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const computeCompletion = (data: ClientProfile) => {
    let score = 20; // Base score for completing setup
    if (data.companyName.trim()) score += 10;
    if (data.industry.trim()) score += 10;
    if (data.companyWebsite.trim()) score += 15;
    if (data.companyDescription.trim().length > 20) score += 15;
    if (data.billingContactName.trim()) score += 10;
    if (data.billingEmail.trim()) score += 10;
    if (data.billingPhone.trim()) score += 10;
    return Math.min(score, 100);
  };

  useEffect(() => {
    const saved = localStorage.getItem("client_profile_data");
    if (saved) {
      try {
        const data = JSON.parse(saved) as ClientProfile;
        setProfile(data);
        setCompletion(computeCompletion(data));
      } catch (e) {
        console.error("Failed to parse client profile:", e);
      }
    }

    const handleUpdate = () => {
      const updated = localStorage.getItem("client_profile_data");
      if (updated) {
        try {
          const data = JSON.parse(updated) as ClientProfile;
          setProfile(data);
          setCompletion(computeCompletion(data));
        } catch {}
      }
    };
    window.addEventListener("clientProfileUpdate", handleUpdate);
    return () => window.removeEventListener("clientProfileUpdate", handleUpdate);
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/client/hiring-overview-stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to load hiring overview stats:", e);
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  const initials = profile?.companyName
    ? profile.companyName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "CO";

  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      {/* Company Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {/* Cover Banner */}
        <div
          className="h-20 bg-cover bg-center border-b border-slate-200 bg-slate-900"
          style={{ backgroundImage: `url(${profile?.coverImage || DEFAULT_COVER})` }}
        />

        {/* Company Avatar */}
        <div className="px-6 pb-6 relative">
          <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-sm absolute -top-8 left-6 bg-slate-50">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Company logo" className="w-full h-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center bg-gradient-to-br from-[#E84E29] to-amber-500 text-white font-extrabold text-sm">
                {initials}
              </span>
            )}
          </div>

          {/* Spacer */}
          <div className="h-10" />

          {/* Company Details */}
          <h3 className="font-extrabold text-slate-900 text-base leading-tight">
            {profile?.companyName || "Your Company"}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {profile?.industry || "Industry"}
          </p>

          {/* Meta Row */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
              <IconUsers className="w-3.5 h-3.5" />
              <span>{profile?.companySize || "1-10"} employees</span>
            </div>
          </div>

          {profile?.companyWebsite && (
            <div className="flex items-center gap-1 text-[11px] text-[#E84E29] font-semibold mt-1.5">
              <IconGlobe className="w-3.5 h-3.5" />
              <a
                href={profile.companyWebsite.startsWith("http") ? profile.companyWebsite : `https://${profile.companyWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate max-w-[140px]"
              >
                {profile.companyWebsite.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}

          {/* Employer Badge */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Actively Hiring
            </span>
          </div>

          {/* Profile Completion */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Company Profile</span>
              <span className="text-orange-600">{completion}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#E84E29] h-full rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Hiring Overview
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-2xl p-3.5 text-center">
            {loadingStats ? (
              <div className="h-7 w-8 bg-slate-200 animate-pulse rounded mx-auto mb-1"></div>
            ) : (
              <p className="text-lg font-black text-slate-800">{stats.jobsPosted}</p>
            )}
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Jobs Posted</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3.5 text-center">
            {loadingStats ? (
              <div className="h-7 w-8 bg-slate-200 animate-pulse rounded mx-auto mb-1"></div>
            ) : (
              <p className="text-lg font-black text-slate-800">{stats.vasHired}</p>
            )}
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">VAs Hired</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3.5 text-center">
            {loadingStats ? (
              <div className="h-7 w-8 bg-slate-200 animate-pulse rounded mx-auto mb-1"></div>
            ) : (
              <p className="text-lg font-black text-slate-800">{stats.interviews}</p>
            )}
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Interviews</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3.5 text-center">
            {loadingStats ? (
              <div className="h-7 w-8 bg-slate-200 animate-pulse rounded mx-auto mb-1"></div>
            ) : (
              <p className="text-lg font-black text-slate-800">{stats.contracts}</p>
            )}
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Contracts</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
