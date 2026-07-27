"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          console.error("Failed to fetch dashboard");
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
        return "bg-blue-100 text-blue-700 border-blue-200";
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
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
              <span className="text-xs">💼</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.pendingJobPosts}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">VA applications to screen</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
              <span className="text-xs">📋</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.pendingApplications}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Pending training materials</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
              <span className="text-xs">📚</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.pendingTrainingMaterials}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Discovery calls</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
              <span className="text-xs">📞</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.discoveryCalls}</p>
        </div>
      </div>

      {/* Top Metrics Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Initial interviews</span>
            <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500 border border-cyan-100">
              <span className="text-xs">🎥</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.initialInterviews}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Client interviews</span>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
              <span className="text-xs">📅</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.clientInterviews}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-600">Currently shortlisted</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
              <span className="text-xs">⭐</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{metrics.shortlisted}</p>
        </div>
      </div>

      {/* Queues Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Job Posts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Pending job posts</h3>
            <Link href="/admin/jobs" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {queues.recentPendingJobs.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium italic">No pending jobs.</p>
            ) : queues.recentPendingJobs.map((job) => (
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
        </div>

        {/* VA Applications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">VA applications awaiting screening</h3>
            <Link href="/admin/applications" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {queues.recentApplications.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium italic">No pending applications.</p>
            ) : queues.recentApplications.map((app) => (
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
        </div>
      </div>

      {/* Queues Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Materials */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Training materials to review</h3>
            <Link href="/admin/training" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {queues.recentTrainingMaterials.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium italic">No materials pending review.</p>
            ) : queues.recentTrainingMaterials.map((mat) => (
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
        </div>

        {/* Discovery Calls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Discovery call queue</h3>
            <Link href="/admin/discovery-calls" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {queues.recentDiscoveryCalls.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium italic">No upcoming discovery calls.</p>
            ) : queues.recentDiscoveryCalls.map((call) => (
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
      
    </div>
  );
}
