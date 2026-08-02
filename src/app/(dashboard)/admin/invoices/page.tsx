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
  const [activeTab, setActiveTab] = useState<"unpaid" | "paid" | "all">("unpaid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewInvoice, setReviewInvoice] = useState<any | null>(null);
  const [isReceiptVerified, setIsReceiptVerified] = useState(false);
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

      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 shrink-0">
        <button 
          onClick={() => { setActiveTab("unpaid"); setCurrentPage(1); }}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "unpaid" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          Unpaid / Pending
        </button>
        <button 
          onClick={() => { setActiveTab("paid"); setCurrentPage(1); }}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "paid" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          Paid
        </button>
        <button 
          onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "all" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          All Invoices
        </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-none space-y-4 pb-4">
        {(() => {
          const filteredData = data.filter((inv: any) => {
            if (activeTab === "all") return true;
            if (activeTab === "paid") return inv.status === "paid";
            return inv.status !== "paid";
          });

          if (filteredData.length === 0) return <p className="text-sm text-slate-500 p-5">No invoices found for this category.</p>;

          return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((inv: any) => (
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
                {inv.status === "paid" ? (
                  <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed border border-slate-200">
                    Paid
                  </button>
                ) : (
                  <button onClick={() => {
                    setIsReceiptVerified(false);
                    setReviewInvoice(inv);
                  }} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                    Review & Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        ))})()}
      </div>

      <div className="shrink-0 pt-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(
            data.filter((inv: any) => {
              if (activeTab === "all") return true;
              if (activeTab === "paid") return inv.status === "paid";
              return inv.status !== "paid";
            }).length / itemsPerPage
          ) || 1}
          onPageChange={setCurrentPage}
        />
      </div>
      <Toast toast={toast} />
      <CreateInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => window.location.reload()} />
      
      {reviewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Review Payment Receipt</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{reviewInvoice.clientName} - {reviewInvoice.invoiceNumber}</p>
              </div>
              <button onClick={() => setReviewInvoice(null)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-100/50 flex-1 flex items-center justify-center min-h-[500px]">
              {reviewInvoice.receipts?.length > 0 ? (
                <iframe 
                  src={reviewInvoice.receipts[0].fileUrl} 
                  className="w-full h-[65vh] max-h-[700px] border-0 rounded-xl bg-white shadow-sm"
                  title="Payment Receipt"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p className="text-sm font-bold">No receipt uploaded for this invoice.</p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-emerald-600 checked:border-emerald-600 transition-colors cursor-pointer"
                    checked={isReceiptVerified}
                    onChange={(e) => setIsReceiptVerified(e.target.checked)}
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">I confirm that this payment has been received in full</span>
              </label>

              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => setReviewInvoice(null)} className="flex-1 md:flex-none px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button 
                  disabled={!isReceiptVerified}
                  onClick={() => {
                    handleApprove(reviewInvoice.id);
                    setReviewInvoice(null);
                  }} 
                  className={`flex-1 md:flex-none px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    isReceiptVerified ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Mark as Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
