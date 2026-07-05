"use client";

import React, { useState } from "react";

export function TrainerPayoutsPanel() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    // This will be replaced with the manual payout method form later
    alert("Manual payout method form coming soon!");
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900">Payouts</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Manage your payout methods and withdrawal history.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Payout Method</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Where your earnings will be sent.</p>
          </div>
          <button 
            onClick={handleConnect}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Add Payout Method
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-xs font-semibold text-slate-500">No payout method added yet.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-sm font-extrabold text-slate-900 mb-4">Payout History</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-slate-800">No payouts yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            When you receive payouts from your sales, they will be listed here.
          </p>
        </div>
      </div>
    </div>
  );
}
