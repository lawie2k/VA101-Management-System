export default function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">Approved</span>;
  if (status === "pending_review") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full border border-amber-200">Pending</span>;
  if (status === "needs_revision") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 rounded-full border border-red-200">Needs Revision</span>;
  if (status === "archived") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 rounded-full border border-slate-300">Archived</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full border border-slate-200">Draft</span>;
}
