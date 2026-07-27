"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { useToast, Toast } from "../../../../components/shared/useToast";
import { StatusBadge } from "../../../../components/shared/StatusBadge";

type Interview = {
  id: string;
  job_application_id: string;
  va: string;
  job: string;
  date: string;
  status: string;
  result: string;
};

export default function InitialInterviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast, showToast } = useToast();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useDynamicPagination(containerRef, 65, 160, 6);
  
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/interviews/initial");
      const data = await res.json();
      if (data.interviews) {
        setInterviews(data.interviews);
      }
    } catch (err) {
      console.error("Error fetching interviews:", err);
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

  const handleUpdateResult = async (interviewId: string, result: string) => {
    // Optimistic Update
    setInterviews(prev => prev.map(inv => 
      inv.id === interviewId ? { ...inv, result, status: "Completed" } : inv
    ));

    try {
      const res = await fetch("/api/admin/interviews/initial", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, result })
      });
      
      if (!res.ok) {
        showToast("Failed to update result", "error");
        fetchInterviews();
      } else {
        showToast(`Interview marked as ${result}!`, "success");
      }
    } catch (err) {
      showToast("Network error", "error");
      fetchInterviews();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      <Toast toast={toast} />
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Initial interviews</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">HR-led interviews with screened applicants.</p>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">VA</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[30%]">Job</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">Date</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%]">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%]">Result</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%] text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 relative">
                {loading && interviews.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 min-h-[200px]">
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentInterviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">No initial interviews scheduled.</td>
                  </tr>
                ) : currentInterviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-slate-50/50 transition-colors bg-white h-[65px]">
                    <td className="px-6 py-3 font-bold text-slate-900">{interview.va}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{interview.job}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{interview.date}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={interview.status} />
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={interview.result} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      {interview.result === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateResult(interview.id, "Passed")}
                            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm">
                            Mark passed
                          </button>
                          <button 
                            onClick={() => handleUpdateResult(interview.id, "Failed")}
                            className="px-3 py-1.5 bg-transparent hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors">
                            Fail
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 italic pr-2">Action taken</span>
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
