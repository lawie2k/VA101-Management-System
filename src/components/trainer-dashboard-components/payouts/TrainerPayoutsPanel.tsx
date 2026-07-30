"use client";

import React, { useState, useEffect } from "react";

export function TrainerPayoutsPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [payouts, setPayouts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/trainer/payouts/history");
        const json = await res.json();
        if (json.success) {
          setPayouts(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch payout history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900">Payout History</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          View your past earnings and withdrawal history.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-sm font-extrabold text-slate-900 mb-4">Payout History</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E84E29]"></div>
          </div>
        ) : payouts.length === 0 ? (
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse mobile-card-table">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-extrabold">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Details / Ref</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {payouts.map((p, idx) => (
                  <tr key={p.id || idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-slate-600 font-medium">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 font-extrabold text-slate-900">
                      ${parseFloat(p.amount).toFixed(2)} {p.currency || 'USD'}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {p.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-slate-500">
                      {p.reference_number || (p.payout_methods ? p.payout_methods.method_type : 'N/A')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
