import StatusBadge from "./StatusBadge";
import { PencilIcon, SendIcon, ArchiveIcon } from "./MaterialIcons";

function Cell({ k, v, tone }: { k: string; v: React.ReactNode; tone?: "teal" | "green" }) {
  const bg = tone === "teal" ? "bg-[#E84E29]/10 text-[#E84E29] border border-[#E84E29]/20" : tone === "green" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-700 border border-slate-100";
  return (
    <div className={`rounded-lg p-2 ${bg} flex flex-col items-center justify-center`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">{k}</p>
      <p className="font-extrabold text-sm">{v}</p>
    </div>
  );
}

export default function MaterialCard({ 
  m, 
  setEditingMaterial, 
  handleSubmitReview, 
  handleArchive 
}: { 
  m: any, 
  setEditingMaterial: (m: any) => void, 
  handleSubmitReview: (id: number) => void, 
  handleArchive: (id: number) => void 
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-md hover:border-slate-300 group flex flex-col">
      {/* Thumbnail Image */}
      <div className="h-32 bg-slate-100 border-b border-slate-100 relative group-hover:opacity-90 transition-opacity">
        <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#E84E29]">{m.category}</p>
            <h3 className="mt-1 truncate font-black text-slate-900 text-[15px]">{m.title}</h3>
          </div>
        </div>
        
        <div className="mt-3 mb-2 flex items-center">
          <StatusBadge status={m.status} />
        </div>

        <div className="mt-auto pt-4 grid grid-cols-3 gap-2 text-center">
          <Cell k="Price" v={`$${m.price}`} />
          <Cell k="Sales" v={m.sales} tone="teal" />
          <Cell k="Earns" v={`$${m.trainerPayout}`} tone="green" />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          <button 
            onClick={() => setEditingMaterial(m)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors"
          >
            <PencilIcon /> Edit
          </button>
          
          {(m.status === "draft" || m.status === "needs_revision") && (
            <button 
              onClick={() => handleSubmitReview(m.id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-[11px] font-bold text-white transition-colors"
            >
              <SendIcon /> Submit
            </button>
          )}
          
          {m.status === "approved" && (
            <button 
              onClick={() => handleArchive(m.id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[11px] font-bold text-slate-700 transition-colors"
            >
              <ArchiveIcon /> Archive
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
