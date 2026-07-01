"use client";

export default function ContractsRightSidebar() {
  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Contract Support</h4>
        <div className="space-y-4">
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-900">Need to make changes?</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              If you want to adjust the rate, hours, or role of an active contract, please contact your VA101 account manager.
            </p>
          </div>
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-900">Ending a Contract</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              We require a standard 2-week notice period to terminate an active contract, unless specified otherwise in your MSA.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
