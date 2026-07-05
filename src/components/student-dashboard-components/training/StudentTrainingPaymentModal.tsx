"use client";

import React, { useState } from "react";
import { PAYMENT_GATEWAY_LINKS } from "../../../lib/constants/payments";

type StudentTrainingPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  courseId: string;
  price: number;
};

export default function StudentTrainingPaymentModal({ isOpen, onClose, onSuccess, courseId, price }: StudentTrainingPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePaymentClick = async (gateway: string) => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/student/training/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          gateway
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert("Failed to initiate purchase. " + (data.error || ""));
        setIsLoading(false);
        return;
      }

      // Notify other components that a new purchase was added
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("trainingPurchaseAdded"));
      }

      // Open the payment link
      const link = PAYMENT_GATEWAY_LINKS[gateway];
      if (link) {
        window.open(link, "_blank");
      } else {
        alert(`Payment link for ${gateway} coming soon!`);
      }

      if (onSuccess) onSuccess();
      
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
          <h2 className="text-lg font-extrabold text-slate-900">Buy Course</h2>
          <p className="text-xs font-medium text-slate-500 mt-1">Select your preferred payment gateway.</p>
        </div>

        <div className="p-6 space-y-5 bg-slate-50">
          <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700">Total Price</span>
            <span className="text-lg font-black text-slate-900">${price.toFixed(2)}</span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block px-1">Payment Method</label>
            
            <div className="grid grid-cols-2 gap-3 relative">
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-slate-50/50 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                  <span className="text-xs font-bold text-[#E84E29] animate-pulse">Processing...</span>
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
