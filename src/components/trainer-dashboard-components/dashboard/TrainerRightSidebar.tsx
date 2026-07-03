"use client";

import Link from "next/link";

const IconDollarSign = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconTrendingUp = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default function TrainerRightSidebar() {
  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      
      {/* Earnings Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <IconDollarSign className="w-16 h-16 text-[#E84E29]" />
        </div>
        
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2 relative z-10">Available Balance</h3>
        <p className="text-3xl font-black text-slate-900 tracking-tight relative z-10">$0.00</p>
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <IconTrendingUp className="w-3 h-3 text-emerald-500" /> Lifetime: $0.00
          </span>
          <Link href="/trainer/payouts" className="text-xs font-bold text-[#E84E29] hover:text-[#DA431E]">
            Withdraw
          </Link>
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Recent Payouts</h3>
          <Link href="/trainer/payouts" className="text-xs font-bold text-[#E84E29] hover:text-[#DA431E]">
            All
          </Link>
        </div>
        
        <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400">No payout history yet.</p>
        </div>
      </div>

    </aside>
  );
}
