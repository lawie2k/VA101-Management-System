"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast, Toast } from "../../../../components/shared/useToast";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import ProcessPayoutModal from "../../../../components/finance-dashboard-components/ProcessPayoutModal";

export default function FinancePayoutsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"vas" | "employees" | "trainers">("vas");
  const [statusFilter, setStatusFilter] = useState<"pending" | "paid" | "all">("pending");
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [processPayout, setProcessPayout] = useState<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useDynamicPagination(containerRef, 130, 20, 6);

  useEffect(() => {
    async function checkRole() {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (!data.user?.roles?.includes("finance") && !data.user?.roles?.includes("admin")) {
          router.replace("/admin/dashboard");
        } else {
          const res2 = await fetch("/api/finance/payouts");
          if (res2.ok) setData(await res2.json());
          setLoading(false);
        }
      }
    }
    checkRole();
  }, [router]);

  if (loading) return null;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Payouts</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage manual payments and upload transaction receipts.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 shrink-0">
        <button 
          onClick={() => setActiveTab("vas")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "vas" ? "border-[#E84E29] text-[#DA431E]" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          Virtual Assistants
        </button>
        <button 
          onClick={() => setActiveTab("employees")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "employees" ? "border-[#E84E29] text-[#DA431E]" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          Internal Employees
        </button>
        <button 
          onClick={() => setActiveTab("trainers")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "trainers" ? "border-[#E84E29] text-[#DA431E]" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          Trainers (Course Sales)
        </button>
      </div>

      <div className="flex justify-end mb-4 shrink-0">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
            className="appearance-none bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E84E29] focus:border-transparent cursor-pointer shadow-sm"
          >
            <option value="pending">Show: Pending Payouts</option>
            <option value="paid">Show: Paid Payouts</option>
            <option value="all">Show: All Payouts</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* List */}
      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-none space-y-4 pb-4">
        {(() => {
          const filteredData = data.filter((pay: any) => {
            let matchesRole = false;
            if (activeTab === "vas") matchesRole = pay.roles?.includes("va");
            else if (activeTab === "employees") matchesRole = pay.roles?.includes("admin") || pay.roles?.includes("finance") || pay.roles?.includes("super_admin");
            else if (activeTab === "trainers") matchesRole = pay.roles?.includes("trainer");
            
            if (!matchesRole) return false;

            if (statusFilter === "all") return true;
            if (statusFilter === "paid") return pay.status === "paid";
            return pay.status !== "paid";
          });

          if (filteredData.length === 0) return <p className="text-sm text-slate-500 p-5">No payouts found for this category.</p>;

          return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((pay: any) => (
          <div key={pay.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Pending Transfer</span>
                <span className="text-xs font-bold text-slate-400">ID: {pay.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {pay.recipientName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Payout for Period: {pay.payPeriod}</p>
            </div>

            <div className="flex flex-col md:items-end gap-3">
              <div className="text-left md:text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Due</p>
                <p className="text-xl font-black text-slate-900">${Number(pay.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => pay.payslipUrl ? window.open(pay.payslipUrl, "_blank") : showToast("No receipt uploaded.", "error")} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200">
                  View Payslip details
                </button>
                {pay.status === "paid" ? (
                  <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed border border-slate-200">
                    Paid
                  </button>
                ) : (
                  <button onClick={() => setProcessPayout(pay)} className="px-4 py-2 bg-[#DA431E] hover:bg-[#DA431E] text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    Upload Receipt & Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        ));
        })()}
      </div>
      <div className="shrink-0 pt-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil((data.filter((pay: any) => {
            let matchesRole = false;
            if (activeTab === "vas") matchesRole = pay.roles?.includes("va");
            else if (activeTab === "employees") matchesRole = pay.roles?.includes("admin") || pay.roles?.includes("finance") || pay.roles?.includes("super_admin");
            else if (activeTab === "trainers") matchesRole = pay.roles?.includes("trainer");
            
            if (!matchesRole) return false;

            if (statusFilter === "all") return true;
            if (statusFilter === "paid") return pay.status === "paid";
            return pay.status !== "paid";
          }).length) / itemsPerPage) || 1}
          onPageChange={setCurrentPage}
        />
      </div>
      <Toast toast={toast} />
      <ProcessPayoutModal isOpen={!!processPayout} payout={processPayout} onClose={() => setProcessPayout(null)} onSuccess={() => window.location.reload()} />
    </div>
  );
}
