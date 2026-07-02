export function MyLearningRightSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Course Progress</h3>
        <p className="text-xs font-medium text-slate-500 mb-2">Overall Completion</p>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#E84E29] to-orange-400 h-full w-0" />
        </div>
        <p className="text-xs font-bold text-slate-400 mt-2 text-right">0%</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Upcoming Deadlines</h3>
        <div className="text-center py-6">
          <p className="text-xs font-medium text-slate-500">No upcoming deadlines.</p>
        </div>
      </div>
    </div>
  );
}
