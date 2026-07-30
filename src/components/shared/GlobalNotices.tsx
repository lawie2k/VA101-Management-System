"use client";

import { useState, useEffect, useRef } from "react";

type Notice = {
  id: string;
  title: string;
  message: string;
  audience_type: string;
  priority: string;
  created_at: string;
};

export default function GlobalNotices({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices");
        if (res.ok) {
          const json = await res.json();
          const fetchedNotices = json.notices || [];
          setNotices(fetchedNotices);
          
          if (fetchedNotices.length > 0) {
            // Check if we have seen the latest notice
            const lastSeenId = localStorage.getItem("last_seen_notice_id");
            if (fetchedNotices[0].id !== lastSeenId) {
              setHasUnread(true);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch global notices", err);
      }
    }
    
    // Only fetch once authenticated
    fetchNotices();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && notices.length > 0) {
      setHasUnread(false);
      localStorage.setItem("last_seen_notice_id", notices[0].id);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className={`relative flex items-center justify-center transition-colors cursor-pointer w-9 h-9 rounded-full ${
          isDark ? "hover:bg-slate-800 text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
        }`}
        title="Notifications"
      >
        <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'currentColor'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        
        {hasUnread && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border border-white rounded-full animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-[-60px] md:right-0 mt-3 w-[260px] md:w-80 max-h-[300px] md:max-h-[400px] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 flex flex-col scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Notifications</h3>
            {notices.length > 0 && (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{notices.length} recent</span>
            )}
          </div>
          
          <div className="flex flex-col">
            {notices.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs font-semibold">
                No notifications right now.
              </div>
            ) : (
              notices.map((notice, idx) => (
                <div 
                  key={notice.id} 
                  className={`p-4 transition-colors hover:bg-slate-50 ${idx !== notices.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{notice.title}</h4>
                    {notice.priority === 'urgent' && <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[9px] font-black uppercase">Urgent</span>}
                    {notice.priority === 'high' && <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[9px] font-black uppercase">High</span>}
                  </div>
                  <p className="text-[11px] text-slate-600 whitespace-pre-wrap mt-2">{notice.message}</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-3 uppercase tracking-wider">
                    {new Date(notice.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
