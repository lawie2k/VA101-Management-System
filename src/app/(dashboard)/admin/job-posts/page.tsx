"use client";

import { useState, useEffect } from "react";

import { StatusBadge } from "../../../../components/shared/StatusBadge";
import Pagination from "../../../../components/shared/Pagination";

type JobPost = {
  id: string;
  job_title: string;
  client_hourly_rate: string;
  status: string;
  client_profiles: {
    company_name: string;
    users: {
      full_name: string;
      email: string;
    };
  };
};

export default function AdminJobPostsPage() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchJobPosts();
  }, []);

  const fetchJobPosts = async () => {
    try {
      const res = await fetch("/api/admin/job-posts");
      const data = await res.json();
      if (data.jobPosts) {
        setJobPosts(data.jobPosts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/admin/job-posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setJobPosts((prev) =>
          prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter
  const filteredJobs = jobPosts.filter((job) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = job.job_title?.toLowerCase().includes(query);
    const companyMatch = job.client_profiles?.company_name?.toLowerCase().includes(query);
    return titleMatch || companyMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-144px)] overflow-visible lg:overflow-hidden flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Posts Management</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Review, enable, or disable client job postings.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Header & Search */}
        <div className="p-5 border-b border-slate-100 flex flex-col items-start gap-4 shrink-0 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap mobile-card-table">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Job Title</th>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Client Rate</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading job posts...</td>
                </tr>
              ) : currentJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No job posts found.</td>
                </tr>
              ) : (
                currentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{job.job_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700">{job.client_profiles?.company_name}</div>
                      <div className="text-xs text-slate-400">{job.client_profiles?.users?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">${job.client_hourly_rate}/hr</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {job.status !== "active" && (
                          <button
                            onClick={() => handleUpdateStatus(job.id, "active")}
                            disabled={updatingId === job.id}
                            className="px-3 py-1.5 text-xs font-bold text-[#E84E29] bg-[#E84E29]/10 hover:bg-[#E84E29]/20 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {updatingId === job.id ? "..." : "Enable"}
                          </button>
                        )}
                        {job.status !== "disabled" && (
                          <button
                            onClick={() => handleUpdateStatus(job.id, "disabled")}
                            disabled={updatingId === job.id}
                            className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Disable
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
