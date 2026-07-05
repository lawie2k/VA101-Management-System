"use client";

import { useState } from "react";
import PaymentGatewayModal from "./PaymentGatewayModal";

export default function PaymentsRightSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-sm font-extrabold text-slate-900 mb-2">Self-Initiated Payment</h3>
        <p className="text-xs text-slate-500 font-medium mb-6">Need to add funds or prepay your VA? Generate a custom invoice here.</p>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-3 rounded-xl text-xs font-bold text-white bg-[#E84E29] hover:bg-[#d44321] transition-all shadow-md shadow-[#E84E29]/20 cursor-pointer"
        >
          Make a Payment
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Billing Cycle</h4>
        <p className="text-[11px] text-slate-500 font-semibold leading-normal">
          Invoices are generated automatically on the <strong className="text-slate-800">1st and 15th</strong> of every month for the active periods.
        </p>
      </div>

      {/* Manual Payout Method Modal */}
      <PaymentGatewayModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </aside>
  );
}
