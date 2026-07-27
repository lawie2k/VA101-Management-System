"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { StatusBadge } from "../../../../components/shared/StatusBadge";
import { useToast, Toast } from "../../../../components/shared/useToast";

// Simple Search SVG Icon component to avoid external dependencies
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

type Course = {
  id: string;
  rawId: string;
  instructor: string;
  title: string;
  meta: string;
  description: string;
  status: string;
  rawStatus: string;
};

export default function TrainingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const { toast, showToast } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useDynamicPagination(containerRef, 160, 160, 4);
  
  // Debounce search typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/training-materials?search=${encodeURIComponent(debouncedSearch)}`);
      const data = await res.json();
      if (data.materials) {
        setCourses(data.materials);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset pagination if search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTraining = courses.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleUpdateStatus = async (materialId: string, newStatus: string) => {
    try {
      // Optimistic update
      setCourses(prev => prev.map(c => 
        c.rawId === materialId ? { ...c, rawStatus: newStatus, status: newStatus === "approved" ? "Approved" : newStatus === "rejected" ? "Rejected" : "Revision Requested" } : c
      ));

      const res = await fetch("/api/admin/training-materials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId, status: newStatus })
      });
      
      if (!res.ok) {
        showToast("Failed to update status", "error");
        fetchCourses();
      } else {
        const actionStr = newStatus === "approved" ? "approved" : newStatus === "rejected" ? "rejected" : "returned for revision";
        showToast(`Material ${actionStr} successfully`, "success");
      }
    } catch (err) {
      showToast("Network error", "error");
      fetchCourses();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      <Toast toast={toast} />
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Training material review</h1>
        </div>
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
            placeholder="Search material or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 space-y-4 relative">
          {loading && courses.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 min-h-[200px]">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : currentTraining.length === 0 ? (
            <div className="py-10 text-center text-slate-500 font-medium">No training materials found.</div>
          ) : currentTraining.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative group transition-all hover:shadow-md flex gap-4">
              
              {/* Icon placeholder (mocking the image from screenshot) */}
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                {course.meta.includes('Finance') ? '📊' : course.meta.includes('Design') ? '🎨' : course.meta.includes('Email') ? '✉️' : '📘'}
              </div>

              <div className="flex-1">
                {/* Status Badge */}
                <div className="absolute top-5 right-5">
                  <StatusBadge status={course.status} />
                </div>

                {/* Course Info */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 mb-1">{course.id} · {course.instructor}</p>
                  <h3 className="text-base font-black text-slate-900">{course.title}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{course.meta}</p>
                  <p className="text-sm font-medium text-slate-700 mt-3 max-w-4xl leading-relaxed">{course.description}</p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-3">
                  {(course.rawStatus === "pending_review" || course.rawStatus === "draft" || course.rawStatus === "revision_requested") && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(course.rawId, "approved")}
                        className="px-4 py-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold rounded-lg transition-colors">
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(course.rawId, "revision_requested")}
                        className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors">
                        Request revision
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(course.rawId, "rejected")}
                        className="px-4 py-1.5 bg-transparent hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                </div>
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
