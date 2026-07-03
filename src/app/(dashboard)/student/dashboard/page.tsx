"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentLeftSidebar from "../../../../components/student-dashboard-components/StudentLeftSidebar";
import StudentMainFeed from "../../../../components/student-dashboard-components/dashboard/StudentMainFeed";
import StudentRightSidebar from "../../../../components/student-dashboard-components/dashboard/StudentRightSidebar";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if profile is configured; if not, redirect to setup
    const saved = localStorage.getItem("student_profile_data");
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.learningGoal) {
          router.replace("/student/profile/setup-profile-form");
          return;
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fetch from API if not in local storage
      fetch("/api/student/profile")
        .then(res => {
          if (res.status === 404) {
            router.replace("/student/profile/setup-profile-form");
            throw new Error("Profile not found");
          }
          return res.json();
        })
        .then(data => {
          if (!data.learningGoal) {
            router.replace("/student/profile/setup-profile-form");
          } else {
            localStorage.setItem("student_profile_data", JSON.stringify(data));
          }
        })
        .catch(err => console.error(err));
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E84E29] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <StudentLeftSidebar />
          </div>
        </div>

        {/* Main Feed (6 cols) */}
        <div className="md:col-span-6">
          <StudentMainFeed />
        </div>

        {/* Right Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <StudentRightSidebar />
          </div>
        </div>

      </div>
    </div>
  );
}
