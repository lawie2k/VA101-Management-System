"use client";

import { useRouter } from "next/navigation";

export default function PayslipPreview() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Payouts
          </button>
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
              onClick={() => window.print()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Payslip Document */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
          
          {/* Header Banner */}
          <div className="bg-slate-900 px-10 py-8 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E84E29] rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h1 className="text-xl font-black tracking-tight">VirtualAssistant101</h1>
              </div>
              <p className="text-sm font-medium text-slate-400">Official Earnings Statement</p>
            </div>

            <div className="text-right relative z-10">
              <p className="text-3xl font-black tracking-tight text-white">PAYSLIP</p>
              <p className="text-sm font-bold text-[#E84E29] mt-1 tracking-wider uppercase">July 2026 Period</p>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employee Name</p>
                <p className="text-sm font-bold text-slate-900">Jane Doe (VA)</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employee ID</p>
                <p className="text-sm font-bold text-slate-900">VA-10492</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Date</p>
                <p className="text-sm font-bold text-slate-900">Aug 1, 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pay Period</p>
                <p className="text-sm font-bold text-slate-900">Jul 1 - Jul 31</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Earnings Table */}
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Earnings Breakdown</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Description</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Hours/Qty</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Rate</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">Base Salary (Monthly)</td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right font-medium">160 hrs</td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right font-medium">$5.00/hr</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">$800.00</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">Performance Bonus</td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right font-medium">-</td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right font-medium">-</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">+$150.00</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">Overtime (Weekend Shift)</td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right font-medium">10 hrs</td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right font-medium">$7.50/hr</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">$75.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deductions & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Deductions */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Deductions</h3>
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-700">Platform Fee</span>
                    <span className="text-sm font-bold text-rose-500">-$25.00</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-700">Advance Repayment</span>
                    <span className="text-sm font-bold text-rose-500">-$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Deductions</span>
                    <span className="text-sm font-black text-slate-900">-$25.00</span>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Summary</h3>
                <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#E84E29] rounded-full blur-2xl opacity-20 -mr-10 -mb-10 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <span className="text-sm font-bold text-slate-400">Gross Earnings</span>
                    <span className="text-sm font-bold text-white">$1,025.00</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <span className="text-sm font-bold text-slate-400">Total Deductions</span>
                    <span className="text-sm font-bold text-white">-$25.00</span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-4 border-t border-slate-800 mt-4 relative z-10">
                    <div>
                      <span className="text-[10px] font-bold text-[#E84E29] uppercase tracking-wider block mb-1">Net Payout</span>
                      <span className="text-3xl font-black tracking-tight text-white">$1,000.00</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-xs font-bold uppercase tracking-wider">Paid</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <hr className="border-slate-100" />
            
            {/* Footer Note */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                This is a computer generated document. No signature is required.
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">
                For payroll inquiries, please contact finance@virtualassistant101.com
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
