"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/src/components/shared/StatusBadge";

type LeaveRequest = {
  id: string;
  user_id: string;
  userName: string;
  userEmail: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  admin_remarks: string | null;
  created_at: string;
};

export default function LeaveReviewHubPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal State for Remarks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{ id: string, status: "approved" | "rejected" } | null>(null);
  const [remarks, setRemarks] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leave-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.leaveRequests || []);
      }
    } catch (err) {
      console.error("Failed to fetch leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleActionClick = (id: string, status: "approved" | "rejected") => {
    setSelectedRequest({ id, status });
    setRemarks("");
    setIsModalOpen(true);
  };

  const submitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setUpdatingId(selectedRequest.id);
    setIsModalOpen(false);

    try {
      const res = await fetch("/api/admin/leave-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveId: selectedRequest.id,
          status: selectedRequest.status,
          adminRemarks: remarks
        })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update leave request.");
      } else {
        // Optimistic UI update
        setRequests(prev => prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: selectedRequest.status, admin_remarks: remarks } 
            : req
        ));
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setUpdatingId(null);
      setSelectedRequest(null);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header Section */}
      <div className="flex-shrink-0 flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leave Approvals</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Review and manage pending time off requests.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm flex-1 flex flex-col relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
          </div>
        )}

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 font-bold text-slate-600">Employee</th>
                <th className="px-6 py-4 font-bold text-slate-600">Type</th>
                <th className="px-6 py-4 font-bold text-slate-600">Dates</th>
                <th className="px-6 py-4 font-bold text-slate-600">Reason</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-semibold">No leave requests found.</td>
                </tr>
              )}
              {requests.map((leave) => (
                <tr key={leave.id} className={`hover:bg-slate-50/50 transition-colors bg-white ${updatingId === leave.id ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{leave.userName}</p>
                    <p className="text-xs font-medium text-slate-500">{leave.userEmail}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 capitalize">{leave.leave_type}</td>
                  <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                    {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 max-w-xs truncate" title={leave.reason}>
                    {leave.reason}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {leave.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleActionClick(leave.id, "approved")}
                          disabled={updatingId === leave.id}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleActionClick(leave.id, "rejected")}
                          disabled={updatingId === leave.id}
                          className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold rounded-lg transition-colors border border-red-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={leave.status} />
                        {leave.admin_remarks && (
                          <span className="text-[10px] text-slate-500 max-w-[150px] truncate" title={leave.admin_remarks}>
                            Note: {leave.admin_remarks}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remarks Modal Overlay */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 capitalize">{selectedRequest.status} Request</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={submitAction} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks (Optional)</label>
                <textarea 
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all"
                  placeholder={`Optional note to the employee explaining the ${selectedRequest.status}...`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`px-5 py-2 text-white text-sm font-bold rounded-xl transition-colors shadow-sm cursor-pointer ${
                    selectedRequest.status === "approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Confirm {selectedRequest.status === "approved" ? "Approval" : "Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
