export function BrowseTrainingRightSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">Categories</h3>
        <div className="text-center py-6">
          <p className="text-xs font-medium text-slate-500">Loading categories...</p>
        </div>
      </div>
    </div>
  );
}
