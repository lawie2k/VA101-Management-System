"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/src/components/shared/StatusBadge";

type LeaveRequest = {
  id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  admin_remarks: string | null;
  created_at: string;
};

export default function InternalLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "vacation",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaves");
      if (res.ok) {
        const data = await res.json();
        setLeaves(data.leaves || []);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveForm)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit leave request.");
      } else {
        setIsModalOpen(false);
        setLeaveForm({ leaveType: "vacation", startDate: "", endDate: "", reason: "" });
        fetchLeaves(); // Refresh the list
      }
    } catch (err) {
      setSubmitError("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header Section */}
      <div className="flex-shrink-0 flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Leaves</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Manage and request your leaves here.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#E84E29] hover:bg-[#DA431E] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          Request Leave
        </button>
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
                <th className="px-6 py-4 font-bold text-slate-600">Type</th>
                <th className="px-6 py-4 font-bold text-slate-600">Dates</th>
                <th className="px-6 py-4 font-bold text-slate-600">Reason</th>
                <th className="px-6 py-4 font-bold text-slate-600">Admin Remarks</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && leaves.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-semibold">No leave requests found.</td>
                </tr>
              )}
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                  <td className="px-6 py-4 font-bold text-slate-900 capitalize">{leave.leave_type}</td>
                  <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                    {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 max-w-xs truncate" title={leave.reason}>
                    {leave.reason}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500 italic">
                    {leave.admin_remarks || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <StatusBadge status={leave.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Leave Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900">Request Time Off</h2>
              <button 
                onClick={() => { setIsModalOpen(false); setSubmitError(""); }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-lg">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={e => setLeaveForm(f => ({ ...f, leaveType: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all cursor-pointer"
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input 
                    type="date" required
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input 
                    type="date" required
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
                <textarea 
                  required
                  rows={3}
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all"
                  placeholder="Briefly explain your reason for leave..."
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
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#E84E29] hover:bg-[#DA431E] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
