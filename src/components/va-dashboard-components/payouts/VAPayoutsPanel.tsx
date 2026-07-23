"use client";

import React, { useState, useEffect } from "react";

export function VAPayoutsPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [payouts, setPayouts] = useState<any[]>([]);

  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/va/payouts/history");
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

  const handleAcknowledge = async (payoutId: string) => {
    try {
      const res = await fetch("/api/va/payouts/acknowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId })
      });
      const json = await res.json();
      if (json.success) {
        setPayouts(payouts.map(p => p.id === payoutId ? { ...p, payslip_acknowledged: true } : p));
        setSelectedPayslip(null);
      }
    } catch (err) {
      console.error("Failed to acknowledge payslip:", err);
    }
  };

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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-extrabold">
                  <th className="pb-3 font-semibold">Pay Period</th>
                  <th className="pb-3 font-semibold">Payslip</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {payouts.map((p, idx) => {
                  let statusBadge = "";
                  let statusText = p.status || 'pending';
                  
                  if (statusText === 'paid' || statusText === 'completed') {
                    statusBadge = 'bg-emerald-100 text-emerald-700';
                    statusText = 'Paid';
                  } else if (statusText === 'cancelled' || statusText === 'failed') {
                    statusBadge = 'bg-red-100 text-red-700';
                    statusText = 'Cancelled';
                  } else {
                    statusBadge = 'bg-amber-100 text-amber-700';
                    statusText = 'In progress';
                  }

                  return (
                    <tr key={p.id || idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-slate-600 font-medium">
                        {p.pay_period || "N/A"}
                      </td>
                      <td className="py-4 text-slate-600 font-medium">
                        {p.payslip_number || "N/A"}
                      </td>
                      <td className="py-4 text-slate-600 font-medium">
                        {p.processed_at ? new Date(p.processed_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-xs text-slate-500">
                        {p.payment_method_override || (p.payout_methods ? p.payout_methods.method_type : 'N/A')}
                      </td>
                      <td className="py-4 font-extrabold text-slate-900">
                        ${parseFloat(p.amount).toFixed(2)} {p.currency || 'USD'}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${statusBadge}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="py-4">
                        {p.payslip_url && !p.payslip_acknowledged && statusText !== 'Paid' && statusText !== 'Cancelled' ? (
                          <button
                            onClick={() => setSelectedPayslip(p)}
                            className="text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] px-3 py-1.5 rounded-lg transition-colors"
                          >
                            View Payslip
                          </button>
                        ) : p.payslip_acknowledged ? (
                          <span className="text-xs font-bold text-emerald-600">Acknowledged</span>
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Payslip Review</h3>
            <p className="text-sm text-slate-500 mb-4">Please review your payslip before the payout is processed. This ensures transparency in your earnings.</p>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500">Payslip No.</span>
                <span className="text-sm font-bold text-slate-900">{selectedPayslip.payslip_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500">Pay Period</span>
                <span className="text-sm font-bold text-slate-900">{selectedPayslip.pay_period || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500">Amount</span>
                <span className="text-sm font-bold text-[#E84E29]">${parseFloat(selectedPayslip.amount).toFixed(2)} {selectedPayslip.currency}</span>
              </div>
              {selectedPayslip.payslip_url && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <a href={selectedPayslip.payslip_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#E84E29] hover:underline">
                    View Full PDF Document ↗
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleAcknowledge(selectedPayslip.id)}
                className="px-4 py-2 text-sm font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] rounded-lg transition-colors shadow-sm"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
