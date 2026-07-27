"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { useToast, Toast } from "../../../../components/shared/useToast";

type DiscoveryCall = {
  id: string;
  client_profile_id: string;
  requested_date: string;
  requested_time: string;
  scheduled_at: string;
  meeting_link: string;
  status: string;
  notes: string;
  client_profiles: {
    company_name: string;
    users: {
      full_name: string;
      email: string;
    } | null;
  } | null;
};

export default function DiscoveryCallsPage() {
  const [calls, setCalls] = useState<DiscoveryCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast, showToast } = useToast();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Approximate height of one discovery call card (with margin) is around 90px
  // Offset includes header and pagination padding (approx 160px)
  const itemsPerPage = useDynamicPagination(containerRef, 90, 160, 6);
  
  const fetchCalls = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/discovery-calls");
      if (res.ok) {
        const json = await res.json();
        setCalls(json.discoveryCalls || []);
      }
    } catch (err) {
      console.error("Failed to fetch discovery calls:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const totalPages = Math.ceil(calls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCalls = calls.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setCalls(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    
    try {
      const res = await fetch("/api/admin/discovery-calls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) {
        showToast("Failed to update status", "error");
        fetchCalls();
      } else {
        showToast(`Call marked as ${newStatus}`, "success");
      }
    } catch (err) {
      showToast("Network error", "error");
      fetchCalls();
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("pending") || s.includes("requested")) return "bg-orange-100 text-orange-800";
    if (s.includes("confirmed") || s.includes("completed")) return "bg-[#dcfce7] text-[#166534]";
    return "bg-slate-100 text-slate-800";
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      <Toast toast={toast} />

      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discovery calls</h1>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
        
        {loading && (
          <div className="absolute inset-0 z-20 bg-slate-50/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-none">
          {!loading && calls.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
              No discovery calls found.
            </div>
          )}

          {currentCalls.map((call) => (
            <div key={call.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative group transition-all hover:shadow-md flex items-center justify-between h-[90px]">
              
              {/* Info */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1">DC-{call.id.toString()}</p>
                <h3 className="text-base font-black text-slate-900 mb-0.5">
                  {call.client_profiles?.company_name || call.client_profiles?.users?.full_name || "Unknown Client"}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  {call.scheduled_at ? new Date(call.scheduled_at).toLocaleString() : (call.requested_date ? new Date(call.requested_date).toLocaleDateString() : "No date set")} 
                  {call.notes ? ` · ${call.notes}` : ""}
                </p>
              </div>

              {/* Actions & Status */}
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold capitalize ${getStatusBadge(call.status)}`}>
                  {call.status || "Requested"}
                </span>
                
                {(!call.status || call.status.toLowerCase() === "requested") && (
                  <button 
                    onClick={() => handleUpdateStatus(call.id, "confirmed")}
                    className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Confirm
                  </button>
                )}
                {call.status?.toLowerCase() === "confirmed" && (
                  <button 
                    onClick={() => handleUpdateStatus(call.id, "completed")}
                    className="px-4 py-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Complete
                  </button>
                )}
              </div>

            </div>
          ))}
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
