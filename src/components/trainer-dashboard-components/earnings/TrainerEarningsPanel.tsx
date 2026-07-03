"use client";

import React from "react";

export function TrainerEarningsPanel() {
  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900">Earnings</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Track your course sales and revenue over time.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-center items-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Earnings</p>
          <p className="text-2xl font-black text-[#E84E29] mt-2">$0.00</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-center items-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Available Balance</p>
          <p className="text-2xl font-black text-slate-900 mt-2">$0.00</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-center items-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Sales</p>
          <p className="text-2xl font-black text-slate-900 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-sm font-extrabold text-slate-900 mb-4">Transaction History</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-slate-800">No earnings yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Once you start making sales, your transactions will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
