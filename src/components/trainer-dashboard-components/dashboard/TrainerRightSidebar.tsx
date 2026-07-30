"use client";

import Link from "next/link";

// --- Icons ---
const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconRefresh = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.45l5.36 5.36"></path>
  </svg>
);

import React from "react";

// --- Mock Data Removed ---
// Payouts will be fetched when payout API is ready
const PAYOUTS: any[] = [];

// --- Subcomponents ---
function StatusBadge({ status }: { status: string }) {
  if (status === "pending_review" || status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-orange-700 bg-orange-100 border border-orange-200">
        <IconClock className="w-3 h-3" /> Pending
      </span>
    );
  }
  if (status === "needs_revision") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-red-700 bg-red-100 border border-red-200">
        <IconRefresh className="w-3 h-3" /> Revision
      </span>
    );
  }
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200">
        <IconCheckCircle className="w-3 h-3" /> Paid
      </span>
    );
  }
  return null;
}

function Tip({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 border border-slate-100">
      <span className="text-base leading-none">{icon}</span>
      <span className="text-xs font-semibold text-slate-700">{text}</span>
    </div>
  );
}

export default function TrainerRightSidebar() {
  const [materials, setMaterials] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadMaterials() {
      try {
        const res = await fetch("/api/trainer/materials");
        if (res.ok) {
          const data = await res.json();
          if (data.materials) setMaterials(data.materials);
        }
      } catch (err) {
        console.error("Failed to load materials", err);
      }
    }
    loadMaterials();
  }, []);

  const pendingMaterials = materials.filter(m => m.status === "pending_review" || m.status === "needs_revision");

  return (
    <aside className="lg:col-span-3 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6">
      
      {/* Pending Review */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Pending Review</h3>
        {pendingMaterials.length === 0 ? (
          <p className="text-xs font-semibold text-slate-500">Nothing waiting.</p>
        ) : (
          <ul className="space-y-3">
            {pendingMaterials.map((m) => (
              <li key={m.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3 hover:bg-slate-100 transition-colors cursor-pointer">
                <p className="truncate text-sm font-bold text-slate-900">{m.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">{m.category}</span>
                  <StatusBadge status={m.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payout Status */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Payout Status</h3>
        {PAYOUTS.length === 0 ? (
          <p className="text-xs font-semibold text-slate-500">No payouts yet.</p>
        ) : (
          <ul className="space-y-3">
            {PAYOUTS.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-black text-slate-900">${p.amount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">{p.method}</p>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

    </aside>
  );
}
