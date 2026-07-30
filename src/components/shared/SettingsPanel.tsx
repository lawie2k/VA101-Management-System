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

const TIME_OPTIONS = [
  "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
];

type Tab = "account" | "security" | "notifications" | "danger";

function TimeDropdown({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <div 
        onClick={() => setOpen(!open)}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white cursor-pointer transition-all flex items-center justify-between"
      >
        <span>{value}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
          <div className="absolute top-full mt-2 left-0 w-full max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 scrollbar-none">
            {TIME_OPTIONS.map(time => (
              <div 
                key={time} 
                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${value === time ? "bg-slate-100 font-bold" : "hover:bg-slate-50 font-medium"}`}
                onClick={() => { onChange(time); setOpen(false); }}
              >
                {time}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function SettingsPanel({ role }: { role: string }) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "account";
  const [activeTab, setActiveTab] = useState<Tab>(["account", "security", "notifications", "danger"].includes(initialTab) ? initialTab : "account");
  
  const [userData, setUserData] = useState<{ 
    fullName?: string, 
    email?: string,
    phone?: string,
    country?: string,
    language?: string,
    timezone?: string
  }>({});

  const [isSubmittingAccount, setIsSubmittingAccount] = useState(false);

  const [securityData, setSecurityData] = useState({ currentPassword: "", newPassword: "" });
  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false);

  const [notificationPrefs, setNotificationPrefs] = useState<{
    email?: boolean,
    inApp?: boolean,
    sms?: boolean,
    newVaApp?: boolean,
    jobPostsPending?: boolean,
    materialsPending?: boolean,
    quietHoursFrom?: string,
    quietHoursTo?: string
  }>({
    email: true,
    inApp: true,
    sms: false,
    newVaApp: true,
    jobPostsPending: true,
    materialsPending: true,
    quietHoursFrom: "10:00 PM",
    quietHoursTo: "07:00 AM"
  });
  const [isSubmittingNotifications, setIsSubmittingNotifications] = useState(false);

  const { toast, showToast } = useToast();

  const navItems = [
    { id: "account", label: "Account", icon: IconUser },
    { id: "security", label: "Security", icon: IconLock },
    { id: "notifications", label: "Notifications", icon: IconBell },
    { id: "danger", label: "Danger zone", icon: IconTrash },
  ] as const;

  const handleAccountSubmit = async () => {
    setIsSubmittingAccount(true);
    try {
      const res = await fetch("/api/settings/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Account settings saved!", "success");
      } else {
        showToast(data.error || "Failed to save settings", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setIsSubmittingAccount(false);
    }
  };

  const handleSecuritySubmit = async () => {
    if (!securityData.currentPassword || !securityData.newPassword) {
      showToast("Please fill in both password fields", "error");
      return;
    }
    setIsSubmittingSecurity(true);
    try {
      const res = await fetch("/api/settings/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(securityData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password updated successfully!", "success");
        setSecurityData({ currentPassword: "", newPassword: "" });
      } else {
        showToast(data.error || "Failed to update password", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setIsSubmittingSecurity(false);
    }
  };

  const handleNotificationsSubmit = async () => {
    setIsSubmittingNotifications(true);
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications: notificationPrefs }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Notification settings saved!", "success");
      } else {
        showToast(data.error || "Failed to save notifications", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setIsSubmittingNotifications(false);
    }
  };

  const handleDangerAction = async (action: "pause" | "delete") => {
    if (!confirm(`Are you sure you want to ${action} your account? This action cannot be easily reversed.`)) return;

    try {
      const res = await fetch("/api/settings/danger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
        // Optionally redirect to login or show logged out state
        if (action === "delete") {
          window.location.href = "/api/auth/logout";
        }
      } else {
        showToast(data.error || `Failed to ${action} account`, "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  // Fetch real auth state for basic settings
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
        .then(data => {
          if (data.authenticated && data.user) {
            setUserData({ 
              fullName: data.user.fullName, 
              email: data.user.email,
              phone: data.user.phone || "",
              country: data.user.country || "",
              language: data.user.language || "",
              timezone: data.user.timezone || ""
            });
            if (data.user.notificationPrefs) {
              setNotificationPrefs(prev => ({
                ...prev,
                ...data.user.notificationPrefs
              }));
            }
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
        <div className="w-full md:w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm md:sticky md:top-6">
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
                      <input 
                        type="text" 
                        value={userData.fullName || ""} 
                        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                        placeholder="Admin Operator" 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Display Name</label>
                      <input 
                        type="text" 
                        value={userData.fullName?.split(' ')[0] || ""} 
                        readOnly
                        placeholder="Admin" 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Email</label>
                      <div className="relative">
                        <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          value={userData.email || ""} 
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          placeholder="admin@va101.example" 
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1.5">Used for sign-in and notifications.</p>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Phone</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <input 
                          type="tel" 
                          value={userData.phone || ""} 
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567" 
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Country</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        <input 
                          type="text" 
                          value={userData.country || ""} 
                          onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                          placeholder="Philippines" 
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Language</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                        <input 
                          type="text" 
                          value={userData.language || ""} 
                          onChange={(e) => setUserData({ ...userData, language: e.target.value })}
                          placeholder="English" 
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Time Zone</label>
                      <input 
                        type="text" 
                        value={userData.timezone || ""} 
                        onChange={(e) => setUserData({ ...userData, timezone: e.target.value })}
                        placeholder="EST (UTC-5)" 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Actions Footer */}
                <div className="border-t border-slate-100 p-6 flex justify-end gap-3 bg-slate-50/50 mt-4">
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button 
                    disabled={isSubmittingAccount}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] shadow-sm transition-colors disabled:opacity-50" 
                    onClick={handleAccountSubmit}
                  >
                    {isSubmittingAccount ? "Saving..." : "Save changes"}
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
                  <p className="text-xs font-semibold text-slate-500">Manage your password.</p>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-6">Change password</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">Current password</label>
                      <input 
                        type="password" 
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">New password</label>
                      <input 
                        type="password" 
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Actions Footer */}
                <div className="border-t border-slate-100 p-6 flex justify-end gap-3 bg-slate-50/50 mt-4">
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button 
                    disabled={isSubmittingSecurity}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] shadow-sm transition-colors disabled:opacity-50" 
                    onClick={handleSecuritySubmit}
                  >
                    {isSubmittingSecurity ? "Updating..." : "Update password"}
                  </button>
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
                    <div 
                      className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${notificationPrefs.email ? "bg-[#00897B] justify-end" : "bg-slate-200 justify-start"}`}
                      onClick={() => setNotificationPrefs(prev => ({ ...prev, email: !prev.email }))}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                    <h4 className="text-sm font-bold text-slate-900">In-app notifications</h4>
                    <div 
                      className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${notificationPrefs.inApp ? "bg-[#00897B] justify-end" : "bg-slate-200 justify-start"}`}
                      onClick={() => setNotificationPrefs(prev => ({ ...prev, inApp: !prev.inApp }))}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>


                </div>
              </div>

              {/* Operations */}
              {(role === "admin" || role === "finance" || role === "employee") && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-6">Operations</h3>
                  
                  <div className="space-y-3">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">New VA applications</h4>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">When a VA submits an application.</p>
                      </div>
                      <div 
                        className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer shrink-0 transition-colors ${notificationPrefs.newVaApp ? "bg-[#00897B] justify-end" : "bg-slate-200 justify-start"}`}
                        onClick={() => setNotificationPrefs(prev => ({ ...prev, newVaApp: !prev.newVaApp }))}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Job posts pending review</h4>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">When clients post new jobs.</p>
                      </div>
                      <div 
                        className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer shrink-0 transition-colors ${notificationPrefs.jobPostsPending ? "bg-[#00897B] justify-end" : "bg-slate-200 justify-start"}`}
                        onClick={() => setNotificationPrefs(prev => ({ ...prev, jobPostsPending: !prev.jobPostsPending }))}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Materials pending review</h4>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">When trainers upload material.</p>
                      </div>
                      <div 
                        className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer shrink-0 transition-colors ${notificationPrefs.materialsPending ? "bg-[#00897B] justify-end" : "bg-slate-200 justify-start"}`}
                        onClick={() => setNotificationPrefs(prev => ({ ...prev, materialsPending: !prev.materialsPending }))}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Quiet Hours Form */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Quiet hours</h3>
                  <p className="text-xs font-medium text-slate-500 mb-6">Mute non-urgent notifications during these hours.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-100 pt-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">From</label>
                      <TimeDropdown 
                        value={notificationPrefs.quietHoursFrom || "10:00 PM"} 
                        onChange={(val) => setNotificationPrefs({ ...notificationPrefs, quietHoursFrom: val })} 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">To</label>
                      <TimeDropdown 
                        value={notificationPrefs.quietHoursTo || "07:00 AM"} 
                        onChange={(val) => setNotificationPrefs({ ...notificationPrefs, quietHoursTo: val })} 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Actions Footer */}
                <div className="border-t border-slate-100 p-6 flex justify-end gap-3 bg-slate-50/50 mt-2">
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button 
                    disabled={isSubmittingNotifications}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] shadow-sm transition-colors disabled:opacity-50" 
                    onClick={handleNotificationsSubmit}
                  >
                    {isSubmittingNotifications ? "Saving..." : "Save changes"}
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
                    <button 
                      onClick={() => handleDangerAction("pause")}
                      className="px-5 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm shrink-0"
                    >
                      Pause
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-red-200 rounded-xl bg-white gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-red-700">Delete account</h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">Permanently delete your account, data, and history. This cannot be undone.</p>
                    </div>
                    <button 
                      onClick={() => handleDangerAction("delete")}
                      className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] transition-colors shadow-sm shrink-0"
                    >
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
