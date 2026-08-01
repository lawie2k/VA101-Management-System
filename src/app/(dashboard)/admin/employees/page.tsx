"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { StatusBadge } from "../../../../components/shared/StatusBadge";

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  status: string;
  hourlyRate: number;
  workSchedule: string;
};

const ROLES = [
  { value: "admin", label: "Super Admin" },
  { value: "finance", label: "Finance Admin" },
  { value: "employee", label: "Operations Admin" },
];

export default function EmployeeManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", roleName: "employee" });
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Approximate height of one table row is 53px
  const itemsPerPage = useDynamicPagination(containerRef, 53, 160, 6);
  
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/employees");
      if (res.ok) {
        const json = await res.json();
        setEmployees(json.employees || []);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTeam = employees.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Optimistic UI update
    setEmployees(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));

    try {
      const res = await fetch("/api/admin/employees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRoleName: newRole })
      });
      if (!res.ok) {
        alert("Failed to update role. Please try again.");
        fetchEmployees(); // Revert on failure
      }
    } catch (err) {
      console.error(err);
      fetchEmployees();
    }
  };

  const handleRateChange = async (userId: string, newRate: number) => {
    setEmployees(prev => prev.map(user => 
      user.id === userId ? { ...user, hourlyRate: newRate } : user
    ));
    try {
      await fetch("/api/admin/employees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, hourlyRate: newRate })
      });
    } catch (err) {
      console.error(err);
      fetchEmployees();
    }
  };

  const handleScheduleChange = async (userId: string, newSchedule: string) => {
    setEmployees(prev => prev.map(user => 
      user.id === userId ? { ...user, workSchedule: newSchedule } : user
    ));
    try {
      await fetch("/api/admin/employees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, workSchedule: newSchedule })
      });
    } catch (err) {
      console.error(err);
      fetchEmployees();
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess("");
    
    try {
      const res = await fetch("/api/admin/employees/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setInviteError(data.error || "Failed to invite employee.");
      } else {
        setInviteSuccess(`Success! The temporary password is: ${data.tempPassword}`);
        setInviteForm({ name: "", email: "", roleName: "employee" });
        fetchEmployees(); // Refresh list
      }
    } catch (err) {
      setInviteError("A network error occurred.");
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header Section */}
      <div className="flex-shrink-0 flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employee management</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Manage internal staff roles and access.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#E84E29] hover:bg-[#DA431E] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          Invite employee
        </button>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm flex-1 flex flex-col relative">
          
          {loading && (
            <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
            </div>
          )}

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse mobile-card-table">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-4 font-bold text-slate-600 w-1/5">Name</th>
                  <th className="px-4 py-4 font-bold text-slate-600 w-1/5">Email</th>
                  <th className="px-4 py-4 font-bold text-slate-600 w-1/6">Internal Role</th>
                  <th className="px-4 py-4 font-bold text-slate-600 w-1/6">Schedule</th>
                  <th className="px-4 py-4 font-bold text-slate-600 w-1/5">Rate ($/hr)</th>
                  <th className="px-4 py-4 font-bold text-slate-600 w-1/6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No employees found.</td>
                  </tr>
                )}
                {currentTeam.map((user) => {
                  const isEditing = editingRowId === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors bg-white h-[53px]">
                      <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                        {user.name}
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600">{user.email}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select 
                            value={user.role} 
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg focus:ring-[#E84E29] focus:border-[#E84E29] block w-full p-2 outline-none cursor-pointer"
                          >
                            {ROLES.map(role => (
                              <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-800 font-medium">
                            {ROLES.find(r => r.value === user.role)?.label || user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select 
                            value={user.workSchedule || "Full-Time"} 
                            onChange={(e) => handleScheduleChange(user.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg focus:ring-[#E84E29] focus:border-[#E84E29] block w-full p-2 outline-none cursor-pointer"
                          >
                            <option value="Full-Time">Full-Time (80hrs)</option>
                            <option value="Part-Time">Part-Time (40hrs)</option>
                          </select>
                        ) : (
                          <span className="text-slate-800 font-medium">{user.workSchedule || "Full-Time"}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input 
                            type="number"
                            min="0"
                            step="0.01"
                            value={user.hourlyRate || 0}
                            onChange={(e) => handleRateChange(user.id, parseFloat(e.target.value) || 0)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg focus:ring-[#E84E29] focus:border-[#E84E29] block w-full p-2 outline-none"
                          />
                        ) : (
                          <span className="text-slate-800 font-bold">${user.hourlyRate || 0}/hr</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <button 
                            onClick={() => setEditingRowId(null)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg transition-colors border border-emerald-200"
                          >
                            Save
                          </button>
                        ) : (
                          <button 
                            onClick={() => setEditingRowId(user.id)}
                            className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-lg transition-colors border border-slate-200"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
      
      {/* Invite Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900">Invite new employee</h2>
              <button 
                onClick={() => { setIsModalOpen(false); setInviteSuccess(""); setInviteError(""); }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              {inviteError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-lg">
                  {inviteError}
                </div>
              )}
              {inviteSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-lg">
                  {inviteSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={inviteForm.name}
                  onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" required
                  value={inviteForm.email}
                  onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all"
                  placeholder="jane@va101.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Role</label>
                <select
                  value={inviteForm.roleName}
                  onChange={e => setInviteForm(f => ({ ...f, roleName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all"
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
