export function PaymentsRightSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Payment Methods</h3>
        <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-2">No active cards</p>
          <button className="text-xs font-bold text-[#E84E29] hover:underline">
            + Add Payment Method
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Billing Summary</h3>
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="text-xs font-medium text-slate-500">This Month</span>
          <span className="text-xs font-extrabold text-slate-900">$0.00</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="text-xs font-medium text-slate-500">Total Spent</span>
          <span className="text-xs font-extrabold text-slate-900">$0.00</span>
        </div>
      </div>
    </div>
  );
}
