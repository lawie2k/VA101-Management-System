"use client";

import React from "react";
import Link from "next/link";

// Removed MOCK DATA

// ==========================================
// ICONS
// ==========================================
const PlusIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const PencilIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const SendIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);
const ArchiveIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);
const CloseIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CameraIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ==========================================
// COMPONENTS
// ==========================================
function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">Approved</span>;
  if (status === "pending_review") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full border border-amber-200">Pending</span>;
  if (status === "needs_revision") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 rounded-full border border-red-200">Needs Revision</span>;
  if (status === "archived") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 rounded-full border border-slate-300">Archived</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full border border-slate-200">Draft</span>;
}

function Cell({ k, v, tone }: { k: string; v: React.ReactNode; tone?: "teal" | "green" }) {
  const bg = tone === "teal" ? "bg-[#E84E29]/10 text-[#E84E29] border border-[#E84E29]/20" : tone === "green" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-700 border border-slate-100";
  return (
    <div className={`rounded-lg p-2 ${bg} flex flex-col items-center justify-center`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">{k}</p>
      <p className="font-extrabold text-sm">{v}</p>
    </div>
  );
}

export default function TrainerMaterialsList() {
  const [materials, setMaterials] = React.useState<any[]>([]);
  const [editingMaterial, setEditingMaterial] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadMaterials() {
      try {
        const res = await fetch("/api/trainer/materials");
        if (res.ok) {
          const data = await res.json();
          if (data.materials) setMaterials(data.materials);
        }
      } catch (err) {
        console.error("Failed to load materials", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const handleSubmitReview = async (id: number) => {
    try {
      const res = await fetch(`/api/trainer/materials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending_review" })
      });
      if (res.ok) {
        setMaterials(prev => prev.map(m => m.id === id ? { ...m, status: "pending_review" } : m));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleArchive = async (id: number) => {
    if (confirm("Are you sure you want to archive this material? It will no longer be visible in the marketplace.")) {
      try {
        const res = await fetch(`/api/trainer/materials/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "archived" })
        });
        if (res.ok) {
          setMaterials(prev => prev.filter(m => m.id !== id));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    
    try {
      const res = await fetch(`/api/trainer/materials/${editingMaterial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingMaterial.title,
          category: editingMaterial.category,
          price: editingMaterial.price
        })
      });
      
      if (res.ok) {
        setMaterials(prev => prev.map(m => m.id === editingMaterial.id ? editingMaterial : m));
        setEditingMaterial(null);
      } else {
        alert("Failed to update material.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  const isEditFormValid = editingMaterial && 
                          editingMaterial.title.trim() !== "" && 
                          editingMaterial.category.trim() !== "" && 
                          String(editingMaterial.price).trim() !== "" && 
                          editingMaterial.price >= 0;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Training Materials</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Drafts stay private. Approved materials appear in the marketplace.
          </p>
        </div>
        <Link 
          href="/trainer/materials/upload-material"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E84E29] hover:bg-[#d03d1c] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-md shadow-orange-500/10 transition-all duration-300 active:scale-[0.98] shrink-0"
        >
          <PlusIcon /> Upload New Material
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-6">All Materials</h2>
        
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {materials.map((m) => (
            <article key={m.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-md hover:border-slate-300 group flex flex-col">
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
          ))}
        </div>
      </div>

      {/* Edit Material Modal */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Edit Material</h3>
              <button onClick={() => setEditingMaterial(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <CloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  value={editingMaterial.title}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Category</label>
                  <input
                    type="text"
                    value={editingMaterial.category}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingMaterial.price}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, price: parseFloat(e.target.value) })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Thumbnail</label>
                <div className="relative h-32 w-full rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group">
                  <img src={editingMaterial.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="flex flex-col items-center text-white">
                      <CameraIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs font-bold">Change Image</span>
                    </div>
                    {/* Mock file input for visual purposes */}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setEditingMaterial(null)} className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!isEditFormValid}
                  className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-full shadow-md transition-all ${
                    !isEditFormValid 
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                      : "bg-[#E84E29] hover:bg-[#d03d1c] text-white"
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
