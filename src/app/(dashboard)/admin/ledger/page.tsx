"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast, Toast } from "../../../../components/shared/useToast";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";

export default function FinanceLedgerPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useDynamicPagination(containerRef, 65, 40, 6);

  useEffect(() => {
    async function checkRole() {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (!data.user?.roles?.includes("finance") && !data.user?.roles?.includes("admin")) {
          router.replace("/admin/dashboard");
        } else {
          const res2 = await fetch("/api/finance/ledger");
          if (res2.ok) setData(await res2.json());
          setLoading(false);
        }
      }
    }
    checkRole();
  }, [router]);

  if (loading) return null;

  const query = searchQuery.toLowerCase();
  const filteredData = data.filter((log) => {
    if (!query) return true;
    return (
      (log.actor && log.actor.toLowerCase().includes(query)) ||
      (log.type && log.type.toLowerCase().includes(query)) ||
      (log.title && log.title.toLowerCase().includes(query)) ||
      (log.id && log.id.toString().includes(query))
    );
  });

  return (
    <div className="max-w-7xl mx-auto animate-fade-in h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Ledger</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Review historical transactions and verify proof of payment receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..." 
            className="w-64 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] bg-white"
          />
          <button 
            onClick={() => showToast("Exporting ledger data...", "success")}
            className="px-4 py-2 border border-slate-300 text-slate-700 bg-white text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-none bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Transaction ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Recipient / Client</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Type</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Amount</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-sm text-slate-500 p-5">
                    No ledger entries found.
                  </td>
                </tr>
              ) : filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                    {log.date ? new Date(log.date).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">
                    LOG-{log.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                    {log.actor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-black text-slate-900">
                    {log.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => showToast("No receipt attached to this transaction yet.", "error")}
                      className="text-emerald-600 hover:text-emerald-800 font-bold text-xs underline"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            </div>
      <div className="shrink-0 pt-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / itemsPerPage) || 1}
          onPageChange={setCurrentPage}
        />
      </div>
      <Toast toast={toast} />
    </div>
  );
}
