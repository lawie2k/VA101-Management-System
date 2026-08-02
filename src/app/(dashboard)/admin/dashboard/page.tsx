"use client";

import Link from "next/link";
import Pagination from "../../../../components/shared/Pagination";
import { useEffect, useState } from "react";
import { useToast, Toast } from "../../../../components/shared/useToast";

// Types matching our new API response
type DashboardData = {
  metrics: {
    pendingJobPosts: number;
    pendingApplications: number;
    pendingTrainingMaterials: number;
    discoveryCalls: number;
    initialInterviews: number;
    clientInterviews: number;
    shortlisted: number;
  };
  queues: {
    recentPendingJobs: { id: string; title: string; company: string; status: string }[];
    recentApplications: { id: string; name: string; jobTitle: string; status: string }[];
    recentTrainingMaterials: { id: string; title: string; trainer: string; price: number; status: string }[];
    recentDiscoveryCalls: { id: string; company: string; date: string; status: string }[];
  };
};

export default function AdminDashboardPage() {
  const { toast, showToast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("admin");
  const [pageFinancePayouts, setPageFinancePayouts] = useState(1);
  const [pageFinanceInvoices, setPageFinanceInvoices] = useState(1);
  const [pageAdminJobs, setPageAdminJobs] = useState(1);
  const [pageAdminApps, setPageAdminApps] = useState(1);
  const [pageAdminTraining, setPageAdminTraining] = useState(1);
  const [pageAdminCalls, setPageAdminCalls] = useState(1);
  const ITEMS_PER_PAGE = 4;


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch role
        let currentRole = "admin";
        const authRes = await fetch("/api/auth/me");
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.user?.roles?.includes("finance")) {
            currentRole = "finance";
            setRole("finance");
          } else if (authData.user?.roles?.includes("employee")) {
            currentRole = "employee";
            setRole("employee");
          }
        }

        if (currentRole === "finance") {
          const res = await fetch("/api/finance/dashboard");
          if (res.ok) setFinanceData(await res.json());
        }

        // Only fetch admin dashboard data if not finance
        if (currentRole !== "finance") {
          const res = await fetch("/api/admin/dashboard");
          if (res.ok) {
            const json = await res.json();
            setData(json);
          } else {
            console.error("Failed to fetch dashboard");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Helper for Badge Styles based on Status
  const getBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending_review":
      case "under_review":
      case "payment_pending":
      case "requested":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "applied":
      case "draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "confirmed":
      case "active":
      case "shortlisted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "needs_revision":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-[#fff0ed] text-[#DA431E] border-[#ffcdbd]";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pb-12 animate-in fade-in flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E84E29] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallback defaults if API fails
  const metrics = data?.metrics || {
    pendingJobPosts: 0, pendingApplications: 0, pendingTrainingMaterials: 0, 
    discoveryCalls: 0, initialInterviews: 0, clientInterviews: 0, shortlisted: 0
  };
  const queues = data?.queues || {
    recentPendingJobs: [], recentApplications: [], recentTrainingMaterials: [], recentDiscoveryCalls: []
  };

  
  
  const handleGenerateReport = async () => {
    try {
      // Create CSV headers
      let csv = "Type,Date,Name,Amount,Status\n";
      
      // Fetch data
      const payoutsRes = await fetch("/api/finance/payouts");
      if (payoutsRes.ok) {
        const payouts = await payoutsRes.json();
        payouts.forEach((p: any) => {
          csv += `Payout,${p.date || "N/A"},${p.recipientName},${p.amount},${p.status}\n`;
        });
      }
      
      const invoicesRes = await fetch("/api/finance/invoices");
      if (invoicesRes.ok) {
        const invoices = await invoicesRes.json();
        invoices.forEach((inv: any) => {
          csv += `Invoice,${inv.dueDate || "N/A"},${inv.clientName},${inv.amount},${inv.status}\n`;
        });
      }
      
      // Trigger download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `finance_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to generate report:", err);
      showToast("Failed to generate report.", "error");
    }
  };

  const paginate = (arr: any[], page: number) => arr.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = (arr: any[]) => Math.ceil(arr.length / ITEMS_PER_PAGE) || 1;

  // -------------------------------------------------------------
  // FINANCE DASHBOARD VIEW
  // -------------------------------------------------------------
  if (role === "finance") {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Finance Overview</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Monitor revenue, manage payouts, and audit transactions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleGenerateReport} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
              Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-slate-600">Total Revenue (Unpaid Invoices)</span>
            </div>
            <p className="text-3xl font-black text-emerald-600 mt-4">${financeData?.metrics?.totalReceivables?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-slate-600">Pending Payables</span>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-4">${financeData?.metrics?.totalPayables?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-slate-600">Outstanding Invoices</span>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-4">{financeData?.queues?.recentInvoices?.length || 0}</p>
          </div>
          <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-sm bg-rose-50/30">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-rose-700">Receipts Needed (Audit)</span>
            </div>
            <p className="text-3xl font-black text-rose-700 mt-4">{financeData?.metrics?.actionItems || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Action Needed: Payouts</h3>
              <Link href="/admin/payouts" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View all <span>→</span>
              </Link>
            </div>
            <div className="space-y-3">
              {financeData?.queues?.recentPayouts?.length === 0 ? (
                <p className="text-xs text-slate-500 font-medium italic">No pending payouts.</p>
              ) : paginate(financeData?.queues?.recentPayouts || [], pageFinancePayouts).map((payout: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {payout.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{payout.name}</p>
                      <p className="text-xs font-medium text-rose-500">{payout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{payout.amount}</p>
                    <Link href="/admin/payouts" className="text-[10px] font-bold text-emerald-600 hover:underline mt-1 block">Process payout</Link>
                  </div>
                </div>
              ))}
            </div>
  <div className="mt-4 border-t border-slate-100 pt-4">
    <Pagination currentPage={pageFinancePayouts} totalPages={totalPages(financeData?.queues?.recentPayouts || [])} onPageChange={setPageFinancePayouts} />
  </div>
</div>
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
    <h3 className="text-sm font-extrabold text-slate-900">Pending Client Invoices</h3>
              <Link href="/admin/invoices" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View all <span>→</span>
              </Link>
            </div>
            <div className="space-y-3">
              {financeData?.queues?.recentInvoices?.length === 0 ? (
                <p className="text-xs text-slate-500 font-medium italic">No pending invoices.</p>
              ) : paginate(financeData?.queues?.recentInvoices || [], pageFinanceInvoices).map((invoice: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">
                      {invoice.client.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{invoice.client}</p>
                      <p className="text-xs font-medium text-slate-500">{invoice.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{invoice.amount}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      invoice.status === "receipt_uploaded" ? "bg-amber-100 text-amber-700" :
                      invoice.status === "overdue" ? "bg-rose-100 text-rose-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
  <div className="mt-4 border-t border-slate-100 pt-4">
    <Pagination currentPage={pageFinanceInvoices} totalPages={totalPages(financeData?.queues?.recentInvoices || [])} onPageChange={setPageFinanceInvoices} />
  </div>
</div>
</div>
</div>
);
}
// -------------------------------------------------------------
  // ADMIN/EMPLOYEE DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin operations</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">Approvals, screening, interviews, and shortlists.</p>
      </div>

      {/* Top Metrics Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Pending job posts</span>
            
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.pendingJobPosts}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">VA applications to screen</span>
            
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.pendingApplications}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Pending training materials</span>
            
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.pendingTrainingMaterials}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Discovery calls</span>
            
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.discoveryCalls}</p>
        </div>
      </div>

      {/* Top Metrics Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Initial interviews</span>
            
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.initialInterviews}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Client interviews</span>
            
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.clientInterviews}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Currently shortlisted</span>
            
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.shortlisted}</p>
        </div>
      </div>

      {/* Queues Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Job Posts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Pending job posts</h3>
            <Link href="/admin/jobs" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {queues.recentPendingJobs.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium italic">No pending jobs.</p>
            ) : paginate(queues.recentPendingJobs, pageAdminJobs).map((job) => (
              <div key={job.id} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">{job.title}</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{job.company} - JOB-{job.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getBadgeStyle(job.status)}`}>
                  {formatStatus(job.status)}
                </span>
              </div>
            ))}
          </div>
  <div className="mt-4 border-t border-slate-100 pt-4">
    <Pagination currentPage={pageAdminJobs} totalPages={totalPages(queues.recentPendingJobs)} onPageChange={setPageAdminJobs} />
  </div>
</div>
{/* VA Applications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">VA applications awaiting screening</h3>
            <Link href="/admin/applications" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {queues.recentApplications.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium italic">No pending applications.</p>
            ) : paginate(queues.recentApplications, pageAdminApps).map((app) => (
              <div key={app.id} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">{app.name}</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{app.jobTitle}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getBadgeStyle(app.status)}`}>
                  {formatStatus(app.status)}
                </span>
              </div>
            ))}
          </div>
  <div className="mt-4 border-t border-slate-100 pt-4">
    <Pagination currentPage={pageAdminApps} totalPages={totalPages(queues.recentApplications)} onPageChange={setPageAdminApps} />
  </div>
</div>
</div>
{/* Queues Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Materials */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Training materials to review</h3>
            <Link href="/admin/training" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {queues.recentTrainingMaterials.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium italic">No materials pending review.</p>
            ) : paginate(queues.recentTrainingMaterials, pageAdminTraining).map((mat) => (
              <div key={mat.id} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">{mat.title}</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{mat.trainer} - ${mat.price}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getBadgeStyle(mat.status)}`}>
                  {formatStatus(mat.status)}
                </span>
              </div>
            ))}
          </div>
  <div className="mt-4 border-t border-slate-100 pt-4">
    <Pagination currentPage={pageAdminTraining} totalPages={totalPages(queues.recentTrainingMaterials)} onPageChange={setPageAdminTraining} />
  </div>
</div>
{/* Discovery Calls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Discovery call queue</h3>
            <Link href="/admin/discovery-calls" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {queues.recentDiscoveryCalls.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium italic">No upcoming discovery calls.</p>
            ) : paginate(queues.recentDiscoveryCalls, pageAdminCalls).map((call) => (
              <div key={call.id} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">{call.company}</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{call.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getBadgeStyle(call.status)}`}>
                  {formatStatus(call.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Toast toast={toast} />
    </div>
  );
}
