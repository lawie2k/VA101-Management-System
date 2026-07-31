"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { useToast, Toast } from "../../../../components/shared/useToast";

type DiscoveryCall = {
  id: string;
  client_profile_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_company: string | null;
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

const isMeetingTime = (dateStr: string, timeStr: string) => {
  if (!dateStr || !timeStr) return false;
  try {
    const meetingDate = new Date(dateStr);
    const timeParts = new Date(timeStr);
    meetingDate.setHours(timeParts.getHours(), timeParts.getMinutes(), 0, 0);
    
    const now = new Date();
    const diffInMinutes = (meetingDate.getTime() - now.getTime()) / 60000;
    
    // Allow joining up to 10 minutes early
    return diffInMinutes <= 10;
  } catch (e) {
    return false;
  }
};

export default function DiscoveryCallsPage() {
  const [calls, setCalls] = useState<DiscoveryCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const { toast, showToast } = useToast();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Approximate height of one discovery call card (with margin) is around 100px
  // Offset includes header and pagination padding (approx 160px)
  const itemsPerPage = useDynamicPagination(containerRef, 100, 160, 6);
  
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

  const handleUpdateStatus = async (id: string, newStatus: string, link?: string) => {
    // Optimistic update
    setCalls(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, meeting_link: link || c.meeting_link } : c));
    
    try {
      const res = await fetch("/api/admin/discovery-calls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, meeting_link: link }),
      });
      if (!res.ok) {
        showToast("Failed to update status", "error");
        fetchCalls();
      } else {
        showToast(`Call marked as ${newStatus}`, "success");
        setConfirmingId(null);
        setMeetingLink("");
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
            <div key={call.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative group transition-all hover:shadow-md flex items-center justify-between h-[100px]">
              
              {/* Info */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1">DC-{call.id.toString()}</p>
                <h3 className="text-base font-black text-slate-900 mb-0.5">
                  {call.client_profiles?.company_name || call.guest_company || "Unknown Company"}
                  {(!call.client_profile_id) && <span className="ml-2 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] uppercase tracking-wider font-extrabold align-middle">Guest</span>}
                </h3>
                <p className="text-[11px] text-slate-600 font-semibold mb-1">
                  {call.client_profiles?.users?.full_name || call.guest_name || "Unknown Name"} &bull; {call.client_profiles?.users?.email || call.guest_email || "No Email"}
                </p>
                <p className="text-xs font-medium text-slate-400">
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
                  confirmingId === call.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="url" 
                        placeholder="https://meet.google.com/..."
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-48"
                      />
                      <button 
                        onClick={() => handleUpdateStatus(call.id, "confirmed", meetingLink)}
                        className="px-3 py-1.5 bg-[#E84E29] hover:bg-[#DA431E] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setConfirmingId(null)}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setConfirmingId(call.id); setMeetingLink(""); }}
                      className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Confirm
                    </button>
                  )
                )}
                {call.status?.toLowerCase() === "confirmed" && (
                  <>
                    <a 
                      href={isMeetingTime(call.requested_date, call.requested_time) ? call.meeting_link || "#" : "#"}
                      target={isMeetingTime(call.requested_date, call.requested_time) ? "_blank" : undefined}
                      rel="noreferrer"
                      className={`px-4 py-1.5 text-white text-xs font-bold rounded-lg transition-colors shadow-sm ${
                        isMeetingTime(call.requested_date, call.requested_time) 
                          ? "bg-blue-500 hover:bg-blue-600" 
                          : "bg-slate-300 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        if (!isMeetingTime(call.requested_date, call.requested_time)) {
                          e.preventDefault();
                          showToast("It's not time for this meeting yet!", "error");
                        }
                      }}
                    >
                      Join Meeting
                    </a>
                    <button 
                      onClick={() => handleUpdateStatus(call.id, "completed")}
                      disabled={!isMeetingTime(call.requested_date, call.requested_time)}
                      className={`px-4 py-1.5 text-white text-xs font-bold rounded-lg transition-colors shadow-sm ${
                        isMeetingTime(call.requested_date, call.requested_time)
                          ? "bg-[#22c55e] hover:bg-[#16a34a]"
                          : "bg-slate-300 cursor-not-allowed"
                      }`}
                    >
                      Complete
                    </button>
                  </>
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
