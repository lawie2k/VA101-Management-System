"use client";

// ==========================================
// SettingsRightSidebar Component
// ==========================================

export default function SettingsRightSidebar() {
  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">

      {/* Security Tips */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Security Tips</h4>
        <div className="space-y-4 text-[11px] text-slate-500 font-semibold">
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none"></span>
            <p>Use a <strong className="text-slate-700">unique password</strong> not used on any other site.</p>
          </div>
          <div className="flex items-start gap-2.5 pt-3 border-t border-slate-100">
            <span className="text-base leading-none"></span>
            <p>Always use an <strong className="text-slate-700">active email</strong> you can access for account recovery.</p>
          </div>
          <div className="flex items-start gap-2.5 pt-3 border-t border-slate-100">
            <span className="text-base leading-none"></span>
            <p>Rotate your password <strong className="text-slate-700">every 90 days</strong> to reduce exposure risk.</p>
          </div>
          <div className="flex items-start gap-2.5 pt-3 border-t border-slate-100">
            <span className="text-base leading-none"></span>
            <p>VA101 will <strong className="text-slate-700">never ask</strong> for your password via email or support chat.</p>
          </div>
        </div>
      </div>

    </aside>
  );
}
