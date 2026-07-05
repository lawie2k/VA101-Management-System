"use client";

import { useState, useEffect } from "react";
import PaymentGatewayModal from "./PaymentGatewayModal";

const IconDownload = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function PaymentsMainFeed() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [gatewayInvoiceId, setGatewayInvoiceId] = useState<string | undefined>(undefined);
  
  // Receipt Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadRemarks, setUploadRemarks] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await fetch("/api/client/invoices");
        if (res.ok) {
          const data = await res.json();
          setInvoices(data);
        }
      } catch (e) {
        console.error("Failed to load invoices", e);
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();

    window.addEventListener("invoiceAdded", loadInvoices);
    return () => window.removeEventListener("invoiceAdded", loadInvoices);
  }, []);

  const openUploadModal = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setReceiptFile(null);
    setUploadRemarks("");
    setIsUploadModalOpen(true);
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile || !selectedInvoiceId) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", receiptFile);
      formData.append("invoiceId", selectedInvoiceId);
      formData.append("remarks", uploadRemarks);

      const res = await fetch("/api/client/invoices/receipts", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setIsUploadModalOpen(false);
        // Refresh invoices locally to show pending review
        setInvoices(invoices.map(inv => 
          inv.id === selectedInvoiceId 
            ? { ...inv, status: "Pending Review" } 
            : inv
        ));
      } else {
        alert(data.error || "Failed to upload receipt");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-purple-50/50 to-white">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Billing & Invoices</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Review your payment history and download invoices.
        </p>
      </div>

      <div className="space-y-4">
        {invoices.map(invoice => (
          <div key={invoice.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#E84E29] transition-colors">{invoice.invoiceNumber || invoice.id}</h3>
                <p className="text-xs text-slate-500 font-medium">{invoice.description}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-slate-900">{invoice.amount}</p>
                <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  invoice.status === "Paid" 
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200" 
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400">Due {invoice.date}</span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer">
                  <IconDownload className="w-3.5 h-3.5" /> Download PDF
                </button>
                {invoice.status !== "Paid" && invoice.status !== "Pending Review" && (
                  <>
                    <button 
                      onClick={() => openUploadModal(invoice.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Upload Receipt
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PaymentGatewayModal 
        isOpen={isGatewayModalOpen} 
        invoiceId={gatewayInvoiceId}
        onClose={() => {
          setIsGatewayModalOpen(false);
          setGatewayInvoiceId(undefined);
        }} 
        onSuccess={() => {
          setIsGatewayModalOpen(false);
          setGatewayInvoiceId(undefined);
          // Reload the invoices!
          async function reload() {
            setLoading(true);
            try {
              const res = await fetch("/api/client/invoices");
              if (res.ok) setInvoices(await res.json());
            } catch (e) { console.error(e); }
            setLoading(false);
          }
          reload();
        }}
      />

      {/* Upload Receipt Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900">Upload Receipt</h2>
              <p className="text-xs font-medium text-slate-500 mt-1">Submit proof of payment for verification.</p>
            </div>

            <form onSubmit={handleUploadReceipt} className="p-6 space-y-4 bg-slate-50">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Receipt Image or PDF</label>
                <input 
                  type="file" 
                  accept="image/*,.pdf"
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#E84E29]/10 file:text-[#E84E29] hover:file:bg-[#E84E29]/20 transition-all cursor-pointer"
                  onChange={e => setReceiptFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Remarks (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paid via Wise on Nov 15"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white outline-none focus:border-[#E84E29] focus:ring-2 focus:ring-[#E84E29]/20 transition-all placeholder:text-slate-400"
                  value={uploadRemarks}
                  onChange={e => setUploadRemarks(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isUploading || !receiptFile}
                  className="w-full h-10 bg-[#E84E29] hover:bg-[#d44321] text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-[#E84E29]/20 disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Submit Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
