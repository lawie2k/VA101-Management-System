"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalNotices from "../shared/GlobalNotices";

export default function AdminHeader({ role, fullName, setSidebarOpen }: { role: string; fullName: string; setSidebarOpen?: (v: boolean) => void }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    window.location.replace("/login");
  };

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-40 relative">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={() => setSidebarOpen?.(true)}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      {/* Right Side: Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <GlobalNotices theme="light" />


        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
              {fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
            </div>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg py-2 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-slate-900">{fullName}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase">{role}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
