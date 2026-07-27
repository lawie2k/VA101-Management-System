"use client";

import { useState } from "react";

interface ContractSigningUIProps {
  companyName: string;
  onSignSuccess: () => void;
}

export default function ContractSigningUI({ companyName, onSignSuccess }: ContractSigningUIProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState("");

  const handleSignContract = async () => {
    if (!signature.trim()) return;
    try {
      setIsSigning(true);
      const res = await fetch("/api/client/sign-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature })
      });
      if (res.ok) {
        onSignSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 h-[calc(100vh-144px)] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl h-full max-h-[700px] w-full flex flex-col overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50 shrink-0">
          <div className="w-12 h-12 bg-[#E84E29]/10 rounded-xl flex items-center justify-center text-[#E84E29]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Master Service Agreement</h2>
            <p className="text-sm font-medium text-slate-500">Please review and sign to unlock your dashboard</p>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-white prose prose-slate max-w-none text-sm">
          <h3 className="text-lg font-bold">1. Services Provided</h3>
          <p>The Agency (VA101) agrees to provide virtual assistant sourcing, screening, and placement services to the Client ({companyName || "your company"}).</p>
          
          <h3 className="text-lg font-bold mt-6">2. Payment Terms</h3>
          <p>The Client agrees to pay the Agency according to the billing cycle selected for each active Assignment. The Agency acts as the payment processor and employer of record, dispersing the appropriate wages to the assigned Virtual Assistant.</p>
          
          <h3 className="text-lg font-bold mt-6">3. Confidentiality</h3>
          <p>Both parties agree to keep all proprietary information strictly confidential. The Agency guarantees that all placed Virtual Assistants have signed an NDA binding them to this confidentiality.</p>

          <h3 className="text-lg font-bold mt-6">4. Termination</h3>
          <p>Either party may terminate an assignment with 14 days written notice. In the event of early termination, the Client is responsible for pro-rated payment for hours worked.</p>
          
          <div className="h-10"></div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
          <label className="block text-sm font-bold text-slate-700 mb-2">Digital Signature</label>
          <div className="flex gap-4 items-center">
            <input 
              type="text" 
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Type your full name to agree" 
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E84E29] focus:border-[#E84E29] font-medium transition-all outline-none"
            />
            <button 
              onClick={handleSignContract}
              disabled={isSigning || !signature.trim()}
              className="px-8 py-3 bg-[#E84E29] hover:bg-[#d6411e] disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm">
              {isSigning ? "Signing..." : "Sign & Agree"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
