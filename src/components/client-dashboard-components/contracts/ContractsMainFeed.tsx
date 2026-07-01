"use client";

import { useState, useEffect } from "react";

const IconFileText = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function ContractsMainFeed() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContracts() {
      try {
        const res = await fetch("/api/client/contracts");
        if (res.ok) {
          const data = await res.json();
          setContracts(data);
        }
      } catch (e) {
        console.error("Failed to load contracts", e);
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, []);

  return (
    <main className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-emerald-50/50 to-white">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Active Contracts</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          View and manage your active Virtual Assistant contracts.
        </p>
      </div>

      <div className="space-y-4">
        {contracts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <IconFileText className="w-7 h-7 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No Active Contracts</h4>
            <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs mx-auto">
              Once you hire a Virtual Assistant, their contract details will appear here.
            </p>
          </div>
        ) : (
          contracts.map(contract => (
            <div key={contract.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#E84E29] transition-colors">{contract.vaName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{contract.role}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {contract.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Rate</p>
                  <p className="text-xs font-black text-slate-800">{contract.rate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Commitment</p>
                  <p className="text-xs font-black text-slate-800">{contract.hours}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Started</p>
                  <p className="text-xs font-black text-slate-800">{contract.startDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {contract.fileUrl && (
                  <a href={contract.fileUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex-1 text-center cursor-pointer">
                    View Agreement
                  </a>
                )}
                {contract.signedFileUrl && (
                  <a href={contract.signedFileUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex-1 text-center cursor-pointer">
                    View Signed Copied
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
