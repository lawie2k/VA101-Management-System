"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { useToast, Toast } from "../../../../components/shared/useToast";
import { StatusBadge } from "../../../../components/shared/StatusBadge";

// Define Job Type
type Job = {
  id: string;
  company: string;
  title: string;
  meta: string;
  description: string;
  status: string;
};

export default function AdminJobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast, showToast } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Approximate height of one job card (with margin) is around 180px
  const itemsPerPage = useDynamicPagination(containerRef, 180, 160, 4);
  
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.ok) {
        const json = await res.json();
        setJobs(json.jobs || []);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleUpdateStatus = async (jobId: string, newStatus: string, displayStatus: string) => {
    // Optimistic UI Update
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: displayStatus } : job
    ));

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status: newStatus })
      });
      
      if (!res.ok) {
        showToast("Failed to update status", "error");
        fetchJobs(); // Revert on failure
      } else {
        showToast(`Job post ${newStatus.replace('_', ' ')}!`, "success");
      }
    } catch (err) {
      showToast("Network error", "error");
      fetchJobs();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      
      <Toast toast={toast} />

      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job post review</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">Approve, request revisions, or reject job posts.</p>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
        
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-none">
          {!loading && jobs.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
              No job posts found.
            </div>
          )}
          
          {currentJobs.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative group transition-all hover:shadow-md">
              
              {/* Status Badge */}
              <div className="absolute top-5 right-5">
                <StatusBadge status={job.status} />
              </div>

              {/* Job Info */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1">{job.id} · {job.company}</p>
                <h3 className="text-base font-black text-slate-900 pr-32 truncate">{job.title}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 truncate">{job.meta}</p>
                <p className="text-sm font-medium text-slate-700 mt-3 max-w-4xl leading-relaxed line-clamp-2">
                  {job.description}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-3">
                <button 
                  onClick={() => handleUpdateStatus(job.id, "approved", "Approved")}
                  className="px-4 py-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleUpdateStatus(job.id, "revision_requested", "Revision Requested")}
                  className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Request revision
                </button>
                <button 
                  onClick={() => handleUpdateStatus(job.id, "rejected", "Rejected")}
                  className="px-4 py-1.5 bg-transparent hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Container - Pushed to bottom */}
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
