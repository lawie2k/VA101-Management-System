"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { useToast, Toast } from "../../../../components/shared/useToast";

type ClientInterview = {
  id: string;
  interview_type: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_platform: string;
  meeting_link: string;
  status: string;
  result: string;
  remarks: string;
  // If joins were made, we'd have va, client, job fields here
};

export default function ClientInterviewsPage() {
  const [interviews, setInterviews] = useState<ClientInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast, showToast } = useToast();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Table row height ~65px. Offset ~160px for header/pagination.
  const itemsPerPage = useDynamicPagination(containerRef, 65, 160, 6);
  
  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/client-interviews");
      if (res.ok) {
        const json = await res.json();
        setInterviews(json.interviews || []);
      }
    } catch (err) {
      console.error("Failed to fetch client interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const totalPages = Math.ceil(interviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInterviews = interviews.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleUpdate = async (id: string, updates: Partial<ClientInterview>) => {
    setInterviews(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    try {
      const res = await fetch("/api/admin/client-interviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) {
        showToast("Failed to update interview", "error");
        fetchInterviews();
      } else {
        showToast("Interview updated successfully", "success");
      }
    } catch (err) {
      showToast("Network error", "error");
      fetchInterviews();
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("scheduled")) return "bg-[#fff0ed] text-[#DA431E]";
    if (s.includes("completed")) return "bg-[#dcfce7] text-[#166534]";
    if (s.includes("cancelled")) return "bg-slate-200 text-slate-800";
    return "bg-slate-100 text-slate-800";
  };

  const getResultBadge = (result: string) => {
    const r = result?.toLowerCase() || "";
    if (r.includes("pending")) return "bg-orange-100 text-orange-800";
    if (r.includes("passed")) return "bg-[#dcfce7] text-[#166534]";
    if (r.includes("failed")) return "bg-red-100 text-red-800";
    return "bg-slate-100 text-slate-800";
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      <Toast toast={toast} />
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client interviews</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">Interviews scheduled between clients and shortlisted VAs.</p>
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
            <table className="w-full text-left border-collapse mobile-card-table">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-600 w-[15%]">ID</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">Platform</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[25%]">Date</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%]">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%]">Result</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && interviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No client interviews scheduled yet.
                    </td>
                  </tr>
                )}
                {currentInterviews.map((interview, idx) => (
                  <tr key={interview.id} className="hover:bg-slate-50/50 transition-colors bg-white h-[65px]">
                    <td className="px-6 py-3 font-bold text-slate-900">INT-{interview.id.toString()}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">
                      {interview.meeting_platform || "TBD"}
                      {interview.meeting_link && (
                        <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="block text-[11px] text-[#E84E29] hover:underline">Join Link</a>
                      )}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-700">
                      {interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleString() : "TBD"}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold capitalize ${getStatusBadge(interview.status)}`}>
                        {interview.status || "Scheduled"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold capitalize ${getResultBadge(interview.result)}`}>
                        {interview.result || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {(!interview.status || interview.status.toLowerCase() !== "completed") && (
                        <button 
                          onClick={() => handleUpdate(interview.id, { status: "completed" })}
                          className="mr-2 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-lg transition-colors shadow-sm"
                        >
                          Mark Completed
                        </button>
                      )}
                      {(interview.status?.toLowerCase() === "completed" && (!interview.result || interview.result.toLowerCase() === "pending")) && (
                        <>
                          <button 
                            onClick={() => handleUpdate(interview.id, { result: "passed" })}
                            className="mr-2 px-3 py-1 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Pass
                          </button>
                          <button 
                            onClick={() => handleUpdate(interview.id, { result: "failed" })}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Fail
                          </button>
                        </>
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
