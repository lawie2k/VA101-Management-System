"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast, Toast } from "./useToast";

// --- Icons ---
const IconUser = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconLock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconBell = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconPlug = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-5" />
    <path d="M9 8V2" />
    <path d="M15 8V2" />
    <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
  </svg>
);
const IconTrash = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

type Tab = "account" | "security" | "notifications" | "danger";

export function SettingsPanel({ role }: { role: string }) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "account";
  const [activeTab, setActiveTab] = useState<Tab>(["account", "security", "notifications", "danger"].includes(initialTab) ? initialTab : "account");
  
  const [userData, setUserData] = useState<{ fullName?: string, email?: string }>({});

  const { toast, showToast } = useToast();

  const navItems = [
    { id: "account", label: "Account", icon: IconUser },
    { id: "security", label: "Security", icon: IconLock },
    { id: "notifications", label: "Notifications", icon: IconBell },
    { id: "danger", label: "Danger zone", icon: IconTrash },
  ] as const;

  // Fetch real auth state for basic settings
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUserData({ fullName: data.user.fullName, email: data.user.email });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full max-w-7xl animate-in fade-in duration-500 pb-20 mx-auto">
      
      <Toast toast={toast} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Manage your Super Admin account preferences and security.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="w-full md:w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm sticky top-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.id === "danger") {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors text-left mt-2 ${
                      isActive 
                        ? "bg-[#0b1120] text-white font-bold" 
                        : "text-slate-600 font-semibold hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors text-left ${
                    isActive 
                      ? "bg-[#0b1120] text-white font-bold" 
                      : "text-slate-600 font-semibold hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* 1. Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              
              {/* Tab Header Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0b1120] text-white flex items-center justify-center shrink-0">
                  <IconUser />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Account</h2>
                  <p className="text-xs font-semibold text-slate-500">Your name, contact info, and basic identity.</p>
                </div>
              </div>

              {/* Profile Photo Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Profile photo</h3>
                <p className="text-xs font-medium text-slate-500 mb-6">A friendly face helps people recognize you.</p>
                <div className="flex items-center gap-5 border-t border-slate-100 pt-6">
                  <div className="w-16 h-16 rounded-full bg-[#059669] text-white flex items-center justify-center text-xl font-bold">
                    AO
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                      Upload new
                    </button>
                    <button className="px-4 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors bg-transparent">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-6">Personal info</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Full Name</label>
                      <input type="text" defaultValue={userData.fullName || "Admin Operator"} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Display Name</label>
                      <input type="text" defaultValue={userData.fullName?.split(' ')[0] || "Admin"} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Email</label>
                      <div className="relative">
                        <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="email" defaultValue={userData.email || "admin@va101.example"} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1.5">Used for sign-in and notifications.</p>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Phone</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Country</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        <input type="text" defaultValue="Philippines" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Language</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                        <input type="text" defaultValue="English" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Time Zone</label>
                      <input type="text" defaultValue="EST (UTC-5)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                    </div>
                  </div>
                </div>
                
                {/* Actions Footer */}
                <div className="border-t border-slate-100 p-6 flex justify-end gap-3 bg-slate-50/50 mt-4">
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] shadow-sm transition-colors" onClick={() => showToast("Changes saved!", "success")}>
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0b1120] text-white flex items-center justify-center shrink-0">
                  <IconLock />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Security</h2>
                  <p className="text-xs font-semibold text-slate-500">Password, 2FA, and active sessions.</p>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-6">Change password</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Current Password</label>
                      <input type="password" defaultValue="........" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">New Password</label>
                        <input type="password" placeholder="At least 8 characters" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Confirm New Password</label>
                        <input type="password" placeholder="" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 p-6 flex justify-end gap-3 bg-slate-50/50 mt-2">
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0b1120] hover:bg-slate-800 shadow-sm transition-colors" onClick={() => showToast("Password updated", "success")}>
                    Update password
                  </button>
                </div>
              </div>



              {/* Active Sessions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Active sessions</h3>
                <p className="text-xs font-medium text-slate-500 mb-6">You're signed in on these devices.</p>
                
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        MacBook Pro — Chrome 
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#166534]">This device</span>
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">Manila, PH · Active now</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">iPhone 15 — Safari</h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">Manila, PH · 2 hours ago</p>
                    </div>
                    <button className="px-4 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
                      Sign out
                    </button>
                  </div>

                  <div className="pt-2">
                    <button className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
                      Sign out of all other sessions
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 3. Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0b1120] text-white flex items-center justify-center shrink-0">
                  <IconBell />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Notifications</h2>
                  <p className="text-xs font-semibold text-slate-500">What you want to be notified about, and where.</p>
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Delivery channels</h3>
                <p className="text-xs font-medium text-slate-500 mb-6">How we contact you when something changes.</p>
                
                <div className="space-y-3 border-t border-slate-100 pt-6">
                  
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                    <h4 className="text-sm font-bold text-slate-900">Email notifications</h4>
                    <div className="w-10 h-6 bg-[#00897B] rounded-full flex items-center p-1 justify-end cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                    <h4 className="text-sm font-bold text-slate-900">In-app notifications</h4>
                    <div className="w-10 h-6 bg-[#00897B] rounded-full flex items-center p-1 justify-end cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                    <h4 className="text-sm font-bold text-slate-900">SMS for time-sensitive events</h4>
                    <div className="w-10 h-6 bg-slate-200 rounded-full flex items-center p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Operations */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6">Operations</h3>
                
                <div className="space-y-3">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">New VA applications</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">When a VA submits an application.</p>
                    </div>
                    <div className="w-10 h-6 bg-[#00897B] rounded-full flex items-center p-1 justify-end cursor-pointer shrink-0">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Job posts pending review</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">When clients post new jobs.</p>
                    </div>
                    <div className="w-10 h-6 bg-[#00897B] rounded-full flex items-center p-1 justify-end cursor-pointer shrink-0">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Materials pending review</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">When trainers upload material.</p>
                    </div>
                    <div className="w-10 h-6 bg-[#00897B] rounded-full flex items-center p-1 justify-end cursor-pointer shrink-0">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quiet Hours Form */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Quiet hours</h3>
                  <p className="text-xs font-medium text-slate-500 mb-6">Mute non-urgent notifications during these hours.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-100 pt-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">From</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <input type="text" defaultValue="10:00 PM" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">To</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <input type="text" defaultValue="07:00 AM" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions Footer */}
                <div className="border-t border-slate-100 p-6 flex justify-end gap-3 bg-slate-50/50 mt-2">
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] shadow-sm transition-colors" onClick={() => showToast("Notifications saved!", "success")}>
                    Save changes
                  </button>
                </div>
              </div>

            </div>
          )}



          {/* 5. Danger Zone Tab */}
          {activeTab === "danger" && (
            <div className="space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0b1120] text-white flex items-center justify-center shrink-0">
                  <IconTrash />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Danger zone</h2>
                  <p className="text-xs font-semibold text-slate-500">Deactivate or delete your account.</p>
                </div>
              </div>

              {/* Danger Actions Area */}
              <div className="bg-red-50/30 border border-red-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-red-900 mb-1">Danger zone</h3>
                <p className="text-xs font-medium text-red-600/80 mb-6">These actions are permanent. Please be careful.</p>
                
                <div className="space-y-4 border-t border-red-200/60 pt-6">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-red-200 rounded-xl bg-white gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Pause account</h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">Temporarily hide your profile and stop notifications.</p>
                    </div>
                    <button className="px-5 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm shrink-0">
                      Pause
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-red-200 rounded-xl bg-white gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-red-700">Delete account</h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">Permanently delete your account, data, and history. This cannot be undone.</p>
                    </div>
                    <button className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] transition-colors shadow-sm shrink-0">
                      Delete account
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Icon for Mail
function IconMail({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,12 2,6" />
    </svg>
  );
}
