"use client";

import { useState, useEffect, useRef } from "react";
import VALeftSidebar from "../../../../components/va-dashboard-components/VALeftSidebar";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { calculateVAPayoutBreakdown } from "../../../../lib/finance/calculations";

export default function VAPayoutsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = useDynamicPagination(containerRef, 130, 20, 6);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await fetch("/api/finance/payouts");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch payouts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  const paginate = (arr: any[], page: number) => arr.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = (arr: any[]) => Math.ceil(arr.length / itemsPerPage) || 1;

  const currentData = paginate(data, currentPage);

  // Find the next upcoming payout
  const nextPayout = data.find((p: any) => p.status === "pending" || p.status === "processing") || data[0] || null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        <VALeftSidebar />

        <div className="lg:col-span-9 space-y-6 h-full flex flex-col">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Payslips</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Review upcoming payouts and historical payment proofs.</p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Next Payday</p>
                <p className="text-lg font-black text-slate-900 leading-none mt-0.5">
                  {nextPayout?.date ? new Date(nextPayout.date).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-none space-y-4">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
            ) : currentData.length === 0 ? (
              <p className="text-sm text-slate-500 p-5 text-center">No payouts found.</p>
            ) : (
              currentData.map((pay: any, index: number) => {
                const isUpcoming = pay.status === 'pending' || pay.status === 'processing';
                const breakdown = calculateVAPayoutBreakdown(pay.amount);
                
                return (
                  <div key={pay.id || index} className={`bg-white border ${isUpcoming ? 'border-emerald-200 ring-1 ring-emerald-100 shadow-md' : 'border-slate-200 shadow-sm'} rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6`}>
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">
                          {pay.payPeriod || "Monthly Payout"}
                        </h3>
                        {isUpcoming ? (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Pending Transfer</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Paid</span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Rate</p>
                          <p className="text-sm font-bold text-slate-700 mt-1">
                            ${breakdown.baseRate.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hours/Tasks</p>
                          <p className="text-sm font-bold text-slate-700 mt-1">40 hrs</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bonuses</p>
                          <p className="text-sm font-bold text-slate-700 mt-1">
                            +${breakdown.bonusAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Payout</p>
                          <p className="text-lg font-black text-[#E84E29] mt-0.5">${breakdown.netPayout.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 gap-3">
                      <button 
                        onClick={() => {
                          if (pay.payslipUrl) window.open(pay.payslipUrl, "_blank");
                          else alert("Payslip document is not available yet.");
                        }}
                        className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 shadow-sm w-full md:w-auto text-center"
                      >
                        Download Slip
                      </button>
                      {!isUpcoming && (
                        <button className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors border border-indigo-200 shadow-sm w-full md:w-auto text-center flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          View Receipt
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages(data)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
