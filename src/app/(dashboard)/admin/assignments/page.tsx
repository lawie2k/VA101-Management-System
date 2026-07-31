"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { StatusBadge } from "../../../../components/shared/StatusBadge";

type Assignment = {
  id: string;
  va: string;
  client: string;
  job: string;
  rate: string;
  hrs: string;
  status: string;
};

export default function AssignmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useDynamicPagination(containerRef, 53, 160, 8);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/assignments");
      const data = await res.json();
      if (data.assignments) {
        setAssignments(data.assignments);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);
  
  const totalPages = Math.ceil(assignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssignments = assignments.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }


  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assignments</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">Active VA assignments created after client acceptance.</p>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse mobile-card-table">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%]">ID</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">VA</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">Client</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[25%]">Job</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%]">Rate</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[5%]">Hrs</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 relative">
                {loading && assignments.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 min-h-[200px]">
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-[#DA431E] rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">No active assignments found.</td>
                  </tr>
                ) : currentAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors bg-white h-[53px]">
                    <td className="px-6 py-3 font-bold text-slate-400">{assignment.id}</td>
                    <td className="px-6 py-3 font-bold text-slate-900">{assignment.va}</td>
                    <td className="px-6 py-3 font-medium text-slate-900">{assignment.client}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{assignment.job}</td>
                    <td className="px-6 py-3 font-medium text-slate-900">{assignment.rate}</td>
                    <td className="px-6 py-3 font-medium text-slate-900">{assignment.hrs}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={assignment.status} />
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
