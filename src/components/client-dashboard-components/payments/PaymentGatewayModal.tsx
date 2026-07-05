"use client";

import React, { useState } from "react";
import { PAYMENT_GATEWAY_LINKS } from "../../../lib/constants/payments";

type PaymentGatewayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Added for refreshing the invoice feed
  invoiceId?: string; // If this is opened from an existing invoice, don't ask for amount
};

export default function PaymentGatewayModal({ isOpen, onClose, onSuccess, invoiceId }: PaymentGatewayModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePaymentClick = async (gateway: string) => {
    // If it's a new standalone payment, require an amount
    if (!invoiceId && (!amount || isNaN(Number(amount)) || Number(amount) <= 0)) {
      alert("Please enter a valid amount to pay.");
      return;
    }

    try {
      setIsLoading(true);

      // Only create an invoice if we are not paying an existing one
      if (!invoiceId) {
        const res = await fetch("/api/client/invoices/create-manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            description: description || `Payment via ${gateway}`,
            gateway
          })
        });

        const data = await res.json();
        if (!data.success) {
          alert("Failed to generate billing card. " + (data.error || ""));
          setIsLoading(false);
          return;
        }

        // Notify other components that a new invoice was added
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("invoiceAdded"));
        }
      }

      // Open the payment link
      const link = PAYMENT_GATEWAY_LINKS[gateway];
      if (link) {
        window.open(link, "_blank");
      } else {
        alert(`Payment link for ${gateway} coming soon!`);
      }

      if (onSuccess) onSuccess();
      
      // Reset and close
      setAmount("");
      setDescription("");
      onClose();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900">Make a Payment</h2>
          <p className="text-xs font-medium text-slate-500 mt-1">Select your preferred payment gateway.</p>
        </div>

        <div className="p-6 space-y-5 bg-slate-50">
          
          {/* Only show Amount inputs if not paying an existing invoice */}
          {!invoiceId && (
            <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Amount to Pay ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input 
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-[#E84E29] focus:bg-white focus:ring-2 focus:ring-[#E84E29]/20 transition-all"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Description (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Prepayment for June"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-[#E84E29] focus:bg-white focus:ring-2 focus:ring-[#E84E29]/20 transition-all"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 leading-tight">
                This will automatically generate a pending billing card for you to upload your receipt to.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-slate-50/50 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                <span className="text-xs font-bold text-[#E84E29] animate-pulse">Generating...</span>
              </div>
            )}
            
            <button 
              onClick={() => handlePaymentClick("Wise")}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3.5 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all group cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                <span className="font-extrabold text-base">W</span>
              </div>
              <span className="text-xs font-bold text-slate-700">Wise</span>
            </button>

            <button 
              onClick={() => handlePaymentClick("Veem")}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#635BFF] hover:shadow-md transition-all group cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-[#635BFF]/10 rounded-full flex items-center justify-center text-[#635BFF] mb-2 group-hover:scale-110 transition-transform">
                <span className="font-extrabold text-base">V</span>
              </div>
              <span className="text-xs font-bold text-slate-700">Veem</span>
            </button>

            <button 
              onClick={() => handlePaymentClick("GCash")}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3.5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                <span className="font-extrabold text-base">G</span>
              </div>
              <span className="text-xs font-bold text-slate-700">GCash</span>
            </button>

            <button 
              onClick={() => handlePaymentClick("Maya")}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-3.5 bg-white border border-slate-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all group cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2 group-hover:scale-110 transition-transform">
                <span className="font-extrabold text-base">M</span>
              </div>
              <span className="text-xs font-bold text-slate-700">Maya</span>
            </button>

            <button 
              onClick={() => handlePaymentClick("Coins.ph")}
              disabled={isLoading}
              className="col-span-2 flex flex-col items-center justify-center p-3.5 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all group cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                <span className="font-extrabold text-base">C</span>
              </div>
              <span className="text-xs font-bold text-slate-700">Coins.ph</span>
            </button>
          </div>

          <div className="pt-2 text-center border-t border-slate-200 mt-4">
            <a 
              href="https://www.virtualassistant101.com/2026/06/how-to-make-payment-to-virtual.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-[#E84E29] hover:text-[#c43b17] hover:underline"
            >
              How to make a payment?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
