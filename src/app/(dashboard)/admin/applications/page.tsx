"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { useToast, Toast } from "../../../../components/shared/useToast";
import { StatusBadge } from "../../../../components/shared/StatusBadge";

type Application = {
  id: string;
  name: string;
  job: string;
  niche: string;
  match: string;
  status: string;
};

export default function VAApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInterviewApp, setActiveInterviewApp] = useState<string | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  
  const { toast, showToast } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Table row height ~65px. Offset ~160px for header/pagination.
  const itemsPerPage = useDynamicPagination(containerRef, 65, 160, 6);
  
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        const json = await res.json();
        setApplications(json.applications || []);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplications = applications.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInterviewApp) return;

    const applicationId = activeInterviewApp;
    setActiveInterviewApp(null);
    setMeetingLink("");

    // Optimistic UI Update
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: "Initial Interview Scheduled" } : app
    ));

    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: "initial_interview_scheduled", meetingLink })
      });
      
      if (!res.ok) {
        showToast("Failed to schedule interview", "error");
        fetchApplications(); // Revert on failure
      } else {
        showToast("Interview scheduled!", "success");
      }
    } catch (err) {
      showToast("Network error", "error");
      fetchApplications();
    }
  };


  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      
      <Toast toast={toast} />

      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">VA applications</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">Screen applications before shortlisting to clients.</p>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
        
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse mobile-card-table">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-600 w-[15%]">VA</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[25%]">Job</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[15%]">Niche</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[10%]">Match</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[15%] text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No applications found.</td>
                  </tr>
                )}
                {currentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors bg-white h-[65px]">
                    <td className="px-6 py-3 font-bold text-slate-900">{app.name}</td>
                    <td className="px-6 py-3 font-medium text-slate-700 truncate max-w-[200px]">{app.job}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{app.niche}</td>
                    <td className="px-6 py-3 font-bold text-slate-900">{app.match}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      {app.status === "Applied" || app.status === "Under Business Review" ? (
                        <button 
                          onClick={() => setActiveInterviewApp(app.id)}
                          className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm"
                        >
                          Schedule interview
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">Action taken</span>
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
      
      {/* Schedule Interview Modal */}
      {activeInterviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-250">
            <div className="h-2 bg-[#E84E29]" />
            <div className="p-6">
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-4">Schedule Interview</h3>
              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Meeting Link (Zoom / GMeet) <span className="text-red-500">*</span></label>
                  <input
                    type="url"
                    required
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/123456789"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 transition-all font-semibold"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setActiveInterviewApp(null);
                      setMeetingLink("");
                    }}
                    className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold transition-all cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#D54522] transition-all cursor-pointer shadow-xs"
                  >
                    Confirm Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
