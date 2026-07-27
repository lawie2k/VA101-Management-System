"use client";

import { useState, useEffect } from "react";
import { useToast, Toast } from "../../../../components/shared/useToast";

type Notice = {
  id: string;
  title: string;
  message: string;
  audience_type: string;
  priority: string;
  created_at: string;
  users?: {
    full_name: string;
  };
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("All users");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast, showToast } = useToast();

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notices");
      if (res.ok) {
        const json = await res.json();
        setNotices(json.notices || []);
      }
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      showToast("Title and message are required", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          audience_type: audience,
          priority
        }),
      });
      
      if (res.ok) {
        showToast("Notice sent successfully", "success");
        setTitle("");
        setMessage("");
        setAudience("All users");
        setPriority("normal");
        fetchNotices();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to send notice", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500">
      <Toast toast={toast} />
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notices</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">Broadcast announcements to user groups.</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col sm:flex-row gap-6 overflow-hidden">
        
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="w-full sm:w-1/3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 flex-shrink-0 self-start">
          
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">Title</label>
            <input 
              type="text" 
              placeholder="Subject" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">Recipients</label>
            <select 
              value={audience}
              onChange={e => setAudience(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium transition-all bg-white appearance-none cursor-pointer"
            >
              {[
                { id: "All users", label: "All users" },
                { id: "Clients", label: "Clients" },
                { id: "VAs", label: "VAs" },
                { id: "Trainers", label: "Trainers" },
                { id: "Students", label: "Students" },
                { id: "Admins", label: "Admins" },
                { id: "Finance", label: "Finance" },
                { id: "Employees", label: "Employees" }
              ].map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">Priority</label>
            <select 
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium transition-all bg-white appearance-none cursor-pointer"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">Message</label>
            <textarea 
              rows={6}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium transition-all resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#E84E29] hover:bg-[#DA431E] disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow-sm transition-colors mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            Send notice
          </button>
        </form>

        {/* Right Column: Recent Notices List */}
        <div className="w-full sm:w-2/3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-0 overflow-y-auto relative">
          <h2 className="text-base font-black text-slate-900 mb-6 shrink-0">Recent notices</h2>
          
          {loading && (
            <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          <div className="flex flex-col flex-1 overflow-y-auto pr-2 scrollbar-none">
            {!loading && notices.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                No notices sent yet.
              </div>
            )}
            
            {notices.map((notice, idx) => (
              <div 
                key={notice.id || idx} 
                className={`py-4 ${idx !== notices.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {notice.title}
                      {notice.priority === 'urgent' && <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase">Urgent</span>}
                      {notice.priority === 'high' && <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase">High</span>}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      To {notice.audience_type} · {new Date(notice.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">{notice.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
    </div>
  );
}
