"use client";

import { useState, useEffect } from "react";

const IconFileText = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconClipboardList = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <line x1="12" y1="11" x2="16" y2="11" />
    <line x1="12" y1="16" x2="16" y2="16" />
    <line x1="8" y1="11" x2="8.01" y2="11" />
    <line x1="8" y1="16" x2="8.01" y2="16" />
  </svg>
);

const IconStar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconMessageCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function ContractsMainFeed() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Rating Modal State
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    vaProfileId: "",
    vaName: "",
    rating: 0,
    comment: "",
    isSubmitting: false,
  });

  // Task Modal State
  const [taskModal, setTaskModal] = useState({
    isOpen: false,
    vaProfileId: "",
    vaName: "",
    title: "",
    description: "",
    resourceLink: "",
    dueDate: "",
    isSubmitting: false,
  });

  useEffect(() => {
    async function loadContracts() {
      try {
        const res = await fetch("/api/client/contracts");
        if (res.ok) {
          const data = await res.json();
          setContracts(data);
        }
      } catch (e) {
        console.error("Failed to load contracts", e);
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, []);

  const openRatingModal = (vaProfileId: string, vaName: string) => {
    setRatingModal({
      isOpen: true,
      vaProfileId,
      vaName,
      rating: 0,
      comment: "",
      isSubmitting: false,
    });
  };

  const submitRating = async () => {
    if (!ratingModal.rating) return;
    setRatingModal(prev => ({ ...prev, isSubmitting: true }));
    try {
      const res = await fetch("/api/client/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaProfileId: ratingModal.vaProfileId,
          rating: ratingModal.rating,
          comment: ratingModal.comment
        })
      });
      if (res.ok) {
        alert("Feedback submitted successfully!");
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred while submitting feedback.");
    } finally {
      setRatingModal(prev => ({ ...prev, isOpen: false, isSubmitting: false }));
    }
  };

  const openTaskModal = (vaProfileId: string, vaName: string) => {
    setTaskModal({
      isOpen: true,
      vaProfileId,
      vaName,
      title: "",
      description: "",
      resourceLink: "",
      dueDate: "",
      isSubmitting: false,
    });
  };

  const submitTask = async () => {
    if (!taskModal.title.trim()) return;
    setTaskModal(prev => ({ ...prev, isSubmitting: true }));
    try {
      const res = await fetch("/api/client/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaProfileId: taskModal.vaProfileId,
          title: taskModal.title,
          description: taskModal.description,
          resourceLink: taskModal.resourceLink,
          dueDate: taskModal.dueDate
        })
      });
      if (res.ok) {
        alert("Task assigned successfully!");
      } else {
        alert("Failed to assign task.");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred while assigning task.");
    } finally {
      setTaskModal(prev => ({ ...prev, isOpen: false, isSubmitting: false }));
    }
  };

  return (
    <main className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-emerald-50/50 to-white">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Active Contracts</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          View and manage your active Virtual Assistant contracts.
        </p>
      </div>

      <div className="space-y-4">
        {contracts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <IconFileText className="w-7 h-7 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No Active Contracts</h4>
            <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs mx-auto">
              Once you hire a Virtual Assistant, their contract details will appear here.
            </p>
          </div>
        ) : (
          contracts.map(contract => (
            <div key={contract.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#E84E29] transition-colors">{contract.vaName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{contract.role}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {contract.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Rate</p>
                  <p className="text-xs font-black text-slate-800">{contract.rate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Commitment</p>
                  <p className="text-xs font-black text-slate-800">{contract.hours}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Started</p>
                  <p className="text-xs font-black text-slate-800">{contract.startDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 mt-4 border-t border-slate-100">
                {contract.fileUrl && (
                  <a href={contract.fileUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex-1 text-center cursor-pointer">
                    View Agreement
                  </a>
                )}
                {contract.signedFileUrl && (
                  <a href={contract.signedFileUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex-1 text-center cursor-pointer">
                    View Signed Copy
                  </a>
                )}
                <button 
                  onClick={() => openTaskModal(contract.vaProfileId, contract.vaName)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all flex-1 text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <IconClipboardList className="w-3.5 h-3.5 text-blue-700" /> Assign Task
                </button>
                <button 
                  onClick={() => openRatingModal(contract.vaProfileId, contract.vaName)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all flex-1 text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <IconStar className="w-3.5 h-3.5 fill-amber-700" /> Rate VA
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-br from-amber-50 to-white">
              <div>
                <h3 className="text-lg font-black text-slate-900">Rate Your Experience</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Leave feedback for {ratingModal.vaName}</p>
              </div>
              <button 
                onClick={() => setRatingModal(prev => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700 mb-3">How was your experience working with them?</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingModal(prev => ({ ...prev, rating: star }))}
                      className="group p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                    >
                      <IconStar 
                        className={`w-8 h-8 transition-colors ${
                          ratingModal.rating >= star 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-200 group-hover:text-amber-200'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                {ratingModal.rating > 0 && (
                  <p className="text-xs font-bold text-amber-600 mt-2">
                    {ratingModal.rating === 5 ? "Excellent!" : ratingModal.rating === 4 ? "Great!" : ratingModal.rating === 3 ? "Good" : ratingModal.rating === 2 ? "Fair" : "Poor"}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <IconMessageCircle className="w-4 h-4 text-slate-400" />
                  Written Feedback (Optional)
                </label>
                <textarea
                  value={ratingModal.comment}
                  onChange={(e) => setRatingModal(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share details of your experience..."
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:border-[#E84E29] focus:ring-[#E84E29] resize-none h-32 p-4 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setRatingModal(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                disabled={ratingModal.isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={ratingModal.rating === 0 || ratingModal.isSubmitting}
                className={`px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-sm transition-all ${
                  ratingModal.rating === 0 || ratingModal.isSubmitting
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-[#E84E29] hover:bg-[#DA431E]'
                }`}
              >
                {ratingModal.isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Assignment Modal */}
      {taskModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-br from-blue-50 to-white">
              <div>
                <h3 className="text-lg font-black text-slate-900">Assign Task</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Assign a new task to {taskModal.vaName}</p>
              </div>
              <button 
                onClick={() => setTaskModal(prev => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Task Title</label>
                <input
                  type="text"
                  value={taskModal.title}
                  onChange={(e) => setTaskModal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Weekly Report, Research Leads..."
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:border-[#E84E29] focus:ring-[#E84E29] px-4 py-2.5 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Due Date (Optional)</label>
                <input
                  type="date"
                  value={taskModal.dueDate}
                  onChange={(e) => setTaskModal(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:border-[#E84E29] focus:ring-[#E84E29] px-4 py-2.5 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Resource Link (Optional)</label>
                <input
                  type="url"
                  value={taskModal.resourceLink}
                  onChange={(e) => setTaskModal(prev => ({ ...prev, resourceLink: e.target.value }))}
                  placeholder="e.g. Google Drive folder, Figma link..."
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:border-[#E84E29] focus:ring-[#E84E29] px-4 py-2.5 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description (Optional)</label>
                <textarea
                  value={taskModal.description}
                  onChange={(e) => setTaskModal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide instructions or details..."
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:border-[#E84E29] focus:ring-[#E84E29] resize-none h-24 p-4 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setTaskModal(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                disabled={taskModal.isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={submitTask}
                disabled={!taskModal.title.trim() || taskModal.isSubmitting}
                className={`px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-sm transition-all ${
                  !taskModal.title.trim() || taskModal.isSubmitting
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-[#E84E29] hover:bg-[#DA431E]'
                }`}
              >
                {taskModal.isSubmitting ? 'Assigning...' : 'Assign Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
