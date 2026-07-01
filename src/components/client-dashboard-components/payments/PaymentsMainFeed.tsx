"use client";

import { useState, useEffect } from "react";

const IconDownload = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function PaymentsMainFeed() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingPay, setLoadingPay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const handlePayInvoice = async (invoiceId: string) => {
    try {
      setLoadingPay(invoiceId);
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoiceId, // Pass actual invoice ID
          successUrl: `${window.location.origin}/client/payments?success=true`,
          cancelUrl: `${window.location.origin}/client/payments?canceled=true`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoadingPay(null);
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
                {invoice.status !== "Paid" && (
                  <button 
                    onClick={() => handlePayInvoice(invoice.id)}
                    disabled={loadingPay === invoice.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingPay === invoice.id ? "Loading..." : "Pay Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
