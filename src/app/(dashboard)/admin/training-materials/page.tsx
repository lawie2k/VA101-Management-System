"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { useToast, Toast } from "../../../../components/shared/useToast";

type TrainingMaterial = {
  id: string;
  rawId: string;
  instructor: string;
  title: string;
  meta: string;
  description: string;
  status: string;
  rawStatus: string;
};

export default function TrainingMaterialsPage() {
  const [materials, setMaterials] = useState<TrainingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast, showToast } = useToast();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Table row height ~65px. Offset ~160px for header/pagination.
  const itemsPerPage = useDynamicPagination(containerRef, 65, 160, 6);
  
  const fetchMaterials = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/training-materials?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        setMaterials(json.materials || []);
      }
    } catch (err) {
      console.error("Failed to fetch training materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMaterials(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMaterials = materials.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleUpdateStatus = async (materialId: string, newStatus: string, displayStatus: string) => {
    setMaterials(prev => prev.map(m => m.rawId === materialId ? { ...m, status: displayStatus, rawStatus: newStatus } : m));
    try {
      const res = await fetch("/api/admin/training-materials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId, status: newStatus }),
      });
      if (!res.ok) {
        showToast("Failed to update status", "error");
        fetchMaterials(search);
      } else {
        showToast(`Material marked as ${displayStatus}`, "success");
      }
    } catch (err) {
      showToast("Network error", "error");
      fetchMaterials(search);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("pending")) return "bg-orange-100 text-orange-800";
    if (s.includes("approved") || s.includes("active")) return "bg-[#dcfce7] text-[#166534]";
    if (s.includes("rejected")) return "bg-red-100 text-red-800";
    return "bg-slate-100 text-slate-800";
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      <Toast toast={toast} />
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Training materials</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Review and approve uploaded courses.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by title or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
        
        {loading && (
          <div className="absolute inset-0 z-20 bg-slate-50/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-600 w-[15%]">ID</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[30%]">Course Title</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">Instructor</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[15%]">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && materials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No training materials found.
                    </td>
                  </tr>
                )}
                {currentMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-slate-50/50 transition-colors bg-white h-[65px]">
                    <td className="px-6 py-3 font-bold text-slate-900">{material.id}</td>
                    <td className="px-6 py-3">
                      <p className="font-bold text-slate-900 truncate max-w-[250px]">{material.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{material.meta}</p>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-700">{material.instructor}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(material.status)}`}>
                        {material.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {material.rawStatus === "pending_review" ? (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(material.rawId, "approved", "Approved")}
                            className="mr-2 px-3 py-1 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(material.rawId, "rejected", "Rejected")}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus(material.rawId, "pending_review", "Pending Review")}
                          className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-lg transition-colors shadow-sm"
                        >
                          Reset Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Container */}
        <div className="flex-shrink-0 pt-4 pb-2">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
      
    </div>
  );
}
