export function BrowseTrainingRightSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Categories</h3>
        <ul className="space-y-2">
          <li>
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#E84E29] transition-colors">
              Virtual Assistance (12)
            </button>
          </li>
          <li>
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#E84E29] transition-colors">
              Digital Marketing (8)
            </button>
          </li>
          <li>
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#E84E29] transition-colors">
              Web Development (5)
            </button>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Top Trainers</h3>
        <div className="text-center py-6">
          <p className="text-xs font-medium text-slate-500">Loading trainers...</p>
        </div>
      </div>
    </div>
  );
}
