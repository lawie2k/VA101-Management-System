"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast, Toast } from "../../../../components/shared/useToast";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import CreateInvoiceModal from "../../../../components/finance-dashboard-components/CreateInvoiceModal";

export default function FinanceInvoicesPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estimate height: row is ~100px. Offset ~160px for header/pagination.
  const itemsPerPage = useDynamicPagination(containerRef, 130, 20, 6);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/finance/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" })
      });
      if (res.ok) {
        showToast("Successfully approved!", "success");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast("Failed to approve invoice.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error approving invoice.", "error");
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      const res = await fetch("/api/finance/invoices");
      if (res.ok) setData(await res.json());
    };

    async function checkRole() {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (!data.user?.roles?.includes("finance") && !data.user?.roles?.includes("admin")) {
          router.replace("/admin/dashboard");
        } else {
          await fetchInvoices();
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client Invoices</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage outbound invoices and verify client payment receipts.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
          Create Invoice
        </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-none space-y-4 pb-4">
        {data.length === 0 ? <p className="text-sm text-slate-500 p-5">No invoices found.</p> : 
          data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((inv: any) => (
          <div key={inv.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${inv.status === "unpaid" ? "bg-amber-100 text-amber-700" : inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>{inv.status}</span>
                <span className="text-xs font-bold text-slate-400">{inv.invoiceNumber}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{inv.clientName}</h3>
              <p className="text-xs text-slate-500 font-medium">Due Date: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "N/A"}</p>
            </div>

            <div className="flex flex-col md:items-end gap-3">
              <div className="text-left md:text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</p>
                <p className="text-xl font-black text-slate-900">${Number(inv.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => inv.receipts?.length > 0 ? window.open(inv.receipts[0].fileUrl, "_blank") : showToast("No receipt uploaded by client yet.", "error")} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200">
                  View Uploaded Receipt
                </button>
                <button onClick={() => handleApprove(inv.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                  Verify & Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 pt-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(data.length / itemsPerPage) || 1}
          onPageChange={setCurrentPage}
        />
      </div>
      <Toast toast={toast} />
      <CreateInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => window.location.reload()} />
    </div>
  );
}
