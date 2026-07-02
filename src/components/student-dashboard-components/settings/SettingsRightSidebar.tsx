export function SettingsRightSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <button className="text-xs font-bold text-slate-600 hover:text-[#E84E29] transition-colors">
              Account Security
            </button>
          </li>
          <li>
            <button className="text-xs font-bold text-slate-600 hover:text-[#E84E29] transition-colors">
              Notification Preferences
            </button>
          </li>
          <li>
            <button className="text-xs font-bold text-slate-600 hover:text-[#E84E29] transition-colors">
              Connected Apps
            </button>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Security Status</h3>
        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
          <span className="text-emerald-600"></span>
          <span className="text-xs font-bold text-emerald-700">Account is secure</span>
        </div>
      </div>
    </div>
  );
}
