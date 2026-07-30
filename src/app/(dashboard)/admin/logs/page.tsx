"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";

type AdminLog = {
  id: string;
  created_at: string;
  action: string;
  entity_type: string;
  entity_id: string;
  users?: {
    full_name: string;
    email: string;
  };
};

export default function LogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Table row height ~53px (slimmer row). Offset ~160px for header/pagination.
  const itemsPerPage = useDynamicPagination(containerRef, 53, 160, 8);
  
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/logs");
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = logs.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit logs</h1>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
        
        {loading && (
          <div className="absolute inset-0 z-20 bg-slate-50/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse mobile-card-table">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">Timestamp</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[20%]">Actor</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[45%]">Action</th>
                  <th className="px-6 py-4 font-bold text-slate-600 w-[15%]">Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No logs recorded yet.
                    </td>
                  </tr>
                )}
                {currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors bg-white h-[53px]">
                    <td className="px-6 py-3 font-bold text-slate-900 font-mono text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-700">
                      {log.users?.full_name || log.users?.email || "System"}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900">{log.action}</td>
                    <td className="px-6 py-3 font-semibold text-slate-400 text-xs truncate max-w-[150px]">
                      {log.entity_type}{log.entity_id ? `-${log.entity_id}` : ''}
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
