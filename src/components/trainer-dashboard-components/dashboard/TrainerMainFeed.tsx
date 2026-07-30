"use client";

import React from "react";
import Link from "next/link";

// --- Icons ---
const IconShoppingCart = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const IconDollarSign = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconTrendingUp = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const IconCheckCircle2 = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <path d="M22 4L12 14.01l-3-3"></path>
  </svg>
);

// Removed Mock Data
// --- Subcomponents ---
function Money({
  label, value, icon, tone,
}: { label: string; value: React.ReactNode; icon: React.ReactNode; tone: "teal" | "green" | "orange" | "navy" }) {
  const map = {
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    orange: "bg-orange-100 text-[#E84E29] border-orange-200",
    navy: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${map[tone]}`}>{icon}</span>
      <p className="mt-4 text-2xl font-black text-slate-900">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200">
        Active
      </span>
    );
  }
  if (status === "pending_review") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-orange-700 bg-orange-100 border border-orange-200">
        Review
      </span>
    );
  }
  return null;
}

export default function TrainerMainFeed() {
  const [mine, setMine] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    async function loadMaterials() {
      try {
        const res = await fetch("/api/trainer/materials");
        if (res.ok) {
          const data = await res.json();
          if (data.materials) setMine(data.materials);
        }
      } catch (err) {
        console.error("Failed to load materials", err);
      }
    }
    loadMaterials();
  }, []);

  const approved = mine.filter((m) => m.status === "approved");
  const totalSales = approved.reduce((s, m) => s + (m.sales || 0), 0);
  const totalPayout = approved.reduce((s, m) => s + (m.trainerPayout || 0), 0);
  // Rough platform cut estimation if not provided by backend directly for each material
  const platform = approved.reduce((s, m) => {
    if (m.sales && m.price) {
      const gross = m.sales * m.price;
      return s + (gross - (m.trainerPayout || 0));
    }
    return s;
  }, 0);

  // Safely get trainer name from localStorage if available
  let trainerName = "Trainer";
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("trainer_profile_data");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.fullName) {
          trainerName = parsed.fullName.split(" ")[0];
        }
      } catch (e) {}
    }
  }

  return (
    <main className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6">
      
      {/* Welcome Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E84E29]/10 rounded-bl-full -z-10 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#E84E29]">Welcome back</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">Hi {trainerName} 🎓</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              <strong className="text-slate-900 font-bold">{totalSales} students</strong> learning from your courses this month.
            </p>
          </div>
          <Link 
            href="/trainer/materials/create"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#E84E29] hover:bg-[#DA431E] text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
          >
            + Upload Course
          </Link>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Earnings Summary</h2>
          <Link href="/trainer/earnings" className="text-xs font-bold text-[#E84E29] hover:underline">Details</Link>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Money label="Total sales" value={totalSales} icon={<IconShoppingCart className="h-5 w-5" />} tone="teal" />
          <Money label="Your payout" value={`$${totalPayout}`} icon={<IconDollarSign className="h-5 w-5" />} tone="green" />
          <Money label="Pending" value="$34" icon={<IconClock className="h-5 w-5" />} tone="orange" />
          <Money label="Platform cut" value={`$${platform}`} icon={<IconTrendingUp className="h-5 w-5" />} tone="navy" />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">My Training Materials</h2>
          <Link href="/trainer/materials" className="text-xs font-bold text-[#E84E29] hover:underline">Manage all</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {mine.slice(0, 4).map((m) => (
            <div key={m.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-shadow hover:shadow-md hover:border-slate-200 group relative">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 grid h-14 w-14 place-items-center rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                  <img src={m.thumbnail} alt="" className="w-full h-full object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-sm font-black text-slate-900">{m.title}</h3>
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{m.category} · ${m.price}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-200/50 p-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Sales</p>
                  <p className="font-black text-slate-900 mt-0.5">{m.sales}</p>
                </div>
                <div className="rounded-xl bg-emerald-100/50 p-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Your cut</p>
                  <p className="font-black text-emerald-700 mt-0.5">${m.trainerPayout}</p>
                </div>
                <div className="rounded-xl bg-[#E84E29]/10 p-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#E84E29]">Platform</p>
                  <p className="font-black text-[#E84E29] mt-0.5">${m.sales && m.price ? (m.sales * m.price - (m.trainerPayout || 0)).toFixed(2) : "0"}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <button className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-300">
                  View / Edit
                </button>
                {m.status === "approved" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-emerald-600">
                    <IconCheckCircle2 className="h-3.5 w-3.5" /> Live
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
