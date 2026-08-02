"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { StatusBadge } from "../../../../components/shared/StatusBadge";
import { TerminateUserModal } from "../../../../components/admin-dashboard-components/TerminateUserModal";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  status: string;
};

export default function UsersAndRolesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Approximate height of one table row is 53px
  const itemsPerPage = useDynamicPagination(containerRef, 53, 160, 6);
  
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        setUsers(json.users || []);
        setIsSuperAdmin(json.isSuperAdmin || false);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex-shrink-0 flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform users</h1>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1 relative">
            {loading && (
              <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
              </div>
            )}
            <table className="w-full text-left border-collapse mobile-card-table">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-600 w-1/4">Name</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-1/4">Email</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-1/6">Role</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-1/6">Joined</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-1/6">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-1/6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                  </tr>
                )}
                {currentUsers.map((user, idx) => (
                  <tr key={user.id || idx} className="hover:bg-slate-50/50 transition-colors bg-white h-[53px]">
                    <td className="px-6 py-3 font-bold text-slate-900">{user.name}</td>
                    <td className="px-6 py-3 font-medium text-slate-600">{user.email}</td>
                    <td className="px-6 py-3 font-medium text-slate-800">{user.role}</td>
                    <td className="px-6 py-3 font-medium text-slate-600">{user.joined}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      {isSuperAdmin && user.status.toLowerCase() !== "terminated" && user.role.toLowerCase() !== "admin" && (
                        <button
                          onClick={() => {
                            setSelectedUser({ id: user.id, name: user.name });
                            setIsTerminateModalOpen(true);
                          }}
                          className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline transition-colors"
                        >
                          Terminate
                        </button>
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
      
      <TerminateUserModal 
        isOpen={isTerminateModalOpen}
        onClose={() => {
          setIsTerminateModalOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id || ""}
        userName={selectedUser?.name || ""}
        onSuccess={() => {
          fetchUsers();
        }}
      />
    </div>
  );
}
