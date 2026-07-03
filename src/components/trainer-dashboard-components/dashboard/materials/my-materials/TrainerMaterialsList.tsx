"use client";

import React from "react";
import Link from "next/link";
import { PlusIcon } from "./MaterialIcons";
import MaterialCard from "./MaterialCard";
import EditMaterialModal from "./EditMaterialModal";

// ==========================================
// MOCK DATA
// ==========================================
const INITIAL_TRAINING_MATERIALS = [
  { id: 1, title: "Onboarding Best Practices", category: "Operations", status: "approved", thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=400&q=80", price: 49, sales: 12, trainerPayout: 411.6 },
  { id: 2, title: "Cold Calling Scripts that Convert", category: "Sales", status: "pending_review", thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=800&h=400&q=80", price: 29, sales: 0, trainerPayout: 0 },
  { id: 3, title: "Advanced Google Workspace", category: "Admin", status: "draft", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=400&q=80", price: 39, sales: 0, trainerPayout: 0 },
  { id: 4, title: "Effective Email Management", category: "Admin", status: "needs_revision", thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&h=400&q=80", price: 19, sales: 0, trainerPayout: 0 }
];

export default function TrainerMaterialsList() {
  const [materials, setMaterials] = React.useState(INITIAL_TRAINING_MATERIALS);
  const [editingMaterial, setEditingMaterial] = React.useState<any>(null);

  const handleSubmitReview = (id: number) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, status: "pending_review" } : m));
  };

  const handleArchive = (id: number) => {
    if (confirm("Are you sure you want to archive this material? It will no longer be visible in the marketplace.")) {
      setMaterials(prev => prev.map(m => m.id === id ? { ...m, status: "archived" } : m));
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    setMaterials(prev => prev.map(m => m.id === editingMaterial.id ? editingMaterial : m));
    setEditingMaterial(null);
  };

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
            <MaterialCard
              key={m.id}
              m={m}
              setEditingMaterial={setEditingMaterial}
              handleSubmitReview={handleSubmitReview}
              handleArchive={handleArchive}
            />
          ))}
        </div>
      </div>

      <EditMaterialModal
        editingMaterial={editingMaterial}
        setEditingMaterial={setEditingMaterial}
        handleSaveEdit={handleSaveEdit}
      />
    </>
  );
}
