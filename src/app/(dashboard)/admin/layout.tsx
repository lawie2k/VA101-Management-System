"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminLeftSidebar from "../../../components/admin-dashboard-components/AdminLeftSidebar";
import AdminHeader from "../../../components/admin-dashboard-components/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("admin");
  const [fullName, setFullName] = useState("Admin User");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          const userRoles = data.user.roles || [];
          // Check if user has any of the admin roles
          const isAdmin = userRoles.includes("admin") || userRoles.includes("finance") || userRoles.includes("employee");
          
          if (!isAdmin) {
            router.replace("/login");
            return;
          }

          if (userRoles.includes("admin")) setRole("admin");
          else if (userRoles.includes("finance")) setRole("finance");
          else if (userRoles.includes("employee")) setRole("employee");

          setFullName(data.user.fullName || "Admin User");
          setLoading(false);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Layout auth check failed:", err);
        router.replace("/login");
      }
    }
    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AdminLeftSidebar role={role} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Header */}
        <AdminHeader role={role} fullName={fullName} setSidebarOpen={setSidebarOpen} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-none">
          {children}
        </main>
      </div>
    </div>
  );
}
