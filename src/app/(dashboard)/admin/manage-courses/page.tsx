"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "../../../../components/shared/StatusBadge";
import Pagination from "../../../../components/shared/Pagination";

type Course = {
  id: string;
  rawId: string;
  instructor: string;
  title: string;
  meta: string;
  description: string;
  status: string;
  rawStatus: string;
};

export default function AdminManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/training-materials");
      const data = await res.json();
      if (data.materials) {
        setCourses(data.materials);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (materialId: string, newStatus: string, displayStatus: string) => {
    try {
      setUpdatingId(materialId);
      const res = await fetch("/api/admin/training-materials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId, status: newStatus }),
      });
      if (res.ok) {
        setCourses((prev) =>
          prev.map((course) => (course.rawId === materialId ? { ...course, status: displayStatus, rawStatus: newStatus } : course))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter
  const filteredCourses = courses.filter((course) => {
    // Only show active or disabled courses (or approved, which is treated as active here)
    if (!["active", "disabled", "approved"].includes(course.rawStatus)) return false;

    const query = searchQuery.toLowerCase();
    const titleMatch = course.title?.toLowerCase().includes(query);
    const instructorMatch = course.instructor?.toLowerCase().includes(query);
    return titleMatch || instructorMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-144px)] overflow-visible lg:overflow-hidden flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Courses Management</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Review, enable, or disable trainer courses.</p>
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
              placeholder="Search courses or trainers..."
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
                <th className="px-6 py-4 font-semibold">Course Title</th>
                <th className="px-6 py-4 font-semibold">Instructor</th>
                <th className="px-6 py-4 font-semibold">Category/Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading courses...</td>
                </tr>
              ) : currentCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No courses found.</td>
                </tr>
              ) : (
                currentCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{course.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700">{course.instructor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{course.meta}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {course.rawStatus !== "active" && course.rawStatus !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(course.rawId, "active", "Active")}
                            disabled={updatingId === course.rawId}
                            className="px-3 py-1.5 text-xs font-bold text-[#E84E29] bg-[#E84E29]/10 hover:bg-[#E84E29]/20 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {updatingId === course.rawId ? "..." : "Enable"}
                          </button>
                        )}
                        {course.rawStatus !== "disabled" && (
                          <button
                            onClick={() => handleUpdateStatus(course.rawId, "disabled", "Disabled")}
                            disabled={updatingId === course.rawId}
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
