"use client";

import { useState, useEffect } from "react";

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

export default function PaymentsRightSidebar() {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);

  useEffect(() => {
    async function loadMethods() {
      try {
        const res = await fetch("/api/client/payment-methods");
        if (res.ok) {
          const data = await res.json();
          setPaymentMethods(data.paymentMethods || []);
        }
      } catch (e) {
        console.error("Failed to fetch payment methods:", e);
      } finally {
        setLoadingMethods(false);
      }
    }
    loadMethods();
  }, []);

  const handleAddPaymentMethod = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/create-setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/client/payments?setup_success=true`,
          cancelUrl: `${window.location.origin}/client/payments?setup_canceled=true`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create setup session");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Payment Methods</h4>
        
        {loadingMethods ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 animate-pulse h-16"></div>
        ) : paymentMethods.length > 0 ? (
          paymentMethods.map((pm, i) => (
            <div key={pm.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-black text-slate-800 capitalize">
                  {pm.brand} ending in {pm.last4}
                </span>
                {i === 0 && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Default
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Expires {pm.expMonth}/{pm.expYear.toString().slice(-2)}
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-400">No payment methods found</span>
          </div>
        )}
        
        <button 
          onClick={handleAddPaymentMethod}
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? "Loading..." : "Add Payment Method"}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Billing Cycle</h4>
        <p className="text-[11px] text-slate-500 font-semibold leading-normal">
          Invoices are generated automatically on the <strong className="text-slate-800">1st and 15th</strong> of every month for the active periods. Auto-pay is enabled.
        </p>
      </div>
    </aside>
  );
}
