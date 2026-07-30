"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast, Toast } from "../../../../components/shared/useToast";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";

export default function StudentCoursePaymentsPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useDynamicPagination(containerRef, 130, 20, 6);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/finance/course-payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" })
      });
      if (res.ok) {
        showToast("Successfully approved!", "success");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast("Failed to approve payment.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error approving payment.", "error");
    }
  };

  useEffect(() => {
    async function checkRole() {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (!data.user?.roles?.includes("finance") && !data.user?.roles?.includes("admin")) {
          router.replace("/admin/dashboard");
        } else {
          const res2 = await fetch("/api/finance/course-payments?type=student");
          if (res2.ok) setData(await res2.json());
          setLoading(false);
        }
      }
    }
    checkRole();
  }, [router]);

  if (loading) return null;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Course Purchases</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Record and track confirmed inbound client payments.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 overflow-y-auto">
        {data.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-bold text-slate-500">No recent payments logged.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment ID</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((pay: any) => (
                <tr key={pay.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-900">#{pay.id}</td>
                  <td className="p-4 font-bold text-emerald-600">${Number(pay.amount).toFixed(2)}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                      {pay.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => pay.proofs?.length > 0 ? window.open(pay.proofs[0].fileUrl, "_blank") : showToast("No receipt uploaded by client yet.", "error")}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200"
                    >
                      View Receipt
                    </button>
                    <button 
                      onClick={() => handleApprove(pay.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Approve & Mark Paid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="shrink-0 pt-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(data.length / itemsPerPage) || 1}
          onPageChange={setCurrentPage}
        />
      </div>
      <Toast toast={toast} />
    </div>
  );
}
