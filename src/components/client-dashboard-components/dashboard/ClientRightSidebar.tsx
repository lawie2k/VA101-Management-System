"use client";

import React from "react";
import Link from "next/link";

/* ─── Inline SVG Icons ─── */

const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconPhone = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconAlertCircle = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconFileText = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconLightbulb = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
  </svg>
);

const IconUpload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

/* ─── Status Badge ─── */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-500/10 border-emerald-500/25",
    completed: "text-blue-700 bg-blue-500/10 border-blue-500/25",
    pending: "text-amber-700 bg-amber-500/10 border-amber-500/25",
    payment_pending: "text-amber-700 bg-amber-500/10 border-amber-500/25",
  };
  const label = status.replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${styles[status] || styles.pending}`}>
      {label}
    </span>
  );
}

/* ─── Component ─── */

export default function ClientRightSidebar() {
  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">

      {/* Payment Reminders */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Payment Reminders
        </h4>

        <div className="rounded-2xl bg-amber-50/60 border border-amber-200/50 p-4 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <IconAlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800">No pending payments</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                All payments are up to date.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/client/payments"
          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[11px] font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-xs cursor-pointer"
        >
          <IconUpload className="w-3.5 h-3.5" />
          Manage Payments
        </Link>
      </div>

      {/* Contract Status */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Contract Status
        </h4>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <IconFileText className="w-4 h-4 text-slate-300" />
            <p>No active contracts yet.</p>
          </div>
        </div>

        <Link
          href="/client/contracts"
          className="mt-3 w-full inline-flex items-center justify-center py-2.5 border border-slate-200 rounded-full text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          View Contracts
        </Link>
      </div>

    </aside>
  );
}
