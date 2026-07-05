"use client";

import { useState } from "react";

export default function PaymentsRightSidebar() {
  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Billing Cycle</h4>
        <p className="text-[11px] text-slate-500 font-semibold leading-normal">
          Invoices are generated automatically on the <strong className="text-slate-800">1st and 15th</strong> of every month for the active periods.
        </p>
      </div>
    </aside>
  );
}
