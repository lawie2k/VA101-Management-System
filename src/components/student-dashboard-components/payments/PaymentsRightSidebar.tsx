export function PaymentsRightSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Payment Instructions</h3>
        <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">
          Since we use direct payment gateways (GCash, Maya, Wise, Veem, Coins.ph), we do not save any credit card or billing details here for your security.
        </p>
        <div className="bg-orange-50 border border-[#E84E29]/20 rounded-2xl p-4">
          <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
            <span className="text-[#E84E29]">Important:</span> Please ensure you take a screenshot of your successful transaction. You will need to upload this receipt on the course page to unlock your content.
          </p>
        </div>
      </div>

    </div>
  );
}
