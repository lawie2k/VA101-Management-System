"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PaymentGatewayModal from "../payments/PaymentGatewayModal";

/* ─── Inline SVG Icons ─── */

const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconPhone = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconAlertCircle = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconFileText = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconLightbulb = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
  </svg>
);

const IconUpload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

/* ─── Status Badge ─── */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-500/10 border-emerald-500/25",
    completed: "text-blue-700 bg-blue-500/10 border-blue-500/25",
    pending: "text-amber-700 bg-amber-500/10 border-amber-500/25",
    payment_pending: "text-amber-700 bg-amber-500/10 border-amber-500/25",
  };
  const label = status.replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${styles[status] || styles.pending}`}>
      {label}
    </span>
  );
}

/* ─── Interfaces ─── */
interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  status: string;
  description: string;
}

/* ─── Component ─── */

export default function ClientRightSidebar() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | undefined>();
  
  // Receipt Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/client/invoices");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Only show upcoming invoices in the sidebar action queue
        setInvoices(data.filter(inv => inv.status === "Upcoming"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    const handleInvoiceUpdate = () => fetchInvoices();
    window.addEventListener("invoiceAdded", handleInvoiceUpdate);
    return () => window.removeEventListener("invoiceAdded", handleInvoiceUpdate);
  }, []);

  const handlePayClick = (invoiceId: string) => {
    setActiveInvoiceId(invoiceId);
    setIsPaymentModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, invoiceId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(invoiceId);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("invoiceId", invoiceId);

      const res = await fetch("/api/client/invoices/receipts", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        alert("Receipt uploaded successfully! Your invoice is now pending review.");
        fetchInvoices(); // Refresh the list
      } else {
        const data = await res.json();
        alert("Failed to upload receipt: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading receipt.");
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <aside className="lg:col-span-3 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6">

      {/* Payment Reminders */}
      <div className={`bg-white border ${invoices.length > 0 ? 'border-[#E84E29]/20 bg-orange-50/10' : 'border-slate-200'} rounded-3xl p-6 shadow-xs`}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          {invoices.length > 0 ? "Action Required" : "Payment Reminders"}
        </h4>

        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-slate-100 rounded-2xl"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-2xl bg-amber-50/60 border border-amber-200/50 p-4 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <IconAlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">No pending payments</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  All payments are up to date.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] font-semibold text-slate-500 mb-2">You have unpaid invoices. Please pay and upload the receipt.</p>
            {invoices.map(invoice => (
              <div key={invoice.id} className="p-4 bg-orange-50 border border-[#E84E29]/20 rounded-2xl relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Invoice #{invoice.invoiceNumber}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{invoice.description}</p>
                  </div>
                  <strong className="text-sm text-slate-800">{invoice.amount}</strong>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, invoice.id)}
                />
                
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => handlePayClick(invoice.id)}
                    className="flex-1 text-center px-3 py-2 bg-[#E84E29] text-white hover:bg-[#DA431E] transition-colors text-[10px] font-bold rounded-xl shadow-xs"
                  >
                    Pay Now
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingId === invoice.id}
                    className="flex-1 text-center px-3 py-2 bg-white border border-[#E84E29] text-[#E84E29] hover:bg-orange-50 transition-colors text-[10px] font-bold rounded-xl shadow-xs disabled:opacity-60"
                  >
                    {uploadingId === invoice.id ? "Uploading..." : "Upload Receipt"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {invoices.length === 0 && (
          <Link
            href="/client/payments"
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[11px] font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-xs cursor-pointer"
          >
            <IconUpload className="w-3.5 h-3.5" />
            Manage Payments
          </Link>
        )}
      </div>

      {/* Contract Status */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Contract Status
        </h4>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
              <img src="/placeholder-avatar.jpg" alt="VA" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">Sarah Jenkins</p>
                <StatusBadge status="active" />
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">Social Media Manager</p>
            </div>
          </div>
        </div>

        <Link
          href="/client/contracts"
          className="mt-4 w-full inline-flex items-center justify-center py-2.5 rounded-full text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          View All Contracts
        </Link>
      </div>

      {/* Payment Modal */}
      <PaymentGatewayModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoiceId={activeInvoiceId}
        onSuccess={() => fetchInvoices()}
      />
    </aside>
  );
}
