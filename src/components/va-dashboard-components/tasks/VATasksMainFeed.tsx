"use client";

import { useState, useEffect } from "react";

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconAlertCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconLink = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export default function VATasksMainFeed() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for submission modal
  const [submissionModal, setSubmissionModal] = useState({
    isOpen: false,
    taskId: "",
    link: ""
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/va/tasks");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTasks(data.data);
          if (data.assignments) {
            setAssignments(data.assignments);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId: string, newStatus: string, submissionLink?: string) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, submission_link: submissionLink || t.submission_link } : t));
      
      const res = await fetch("/api/va/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus, submissionLink })
      });
      if (!res.ok) {
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
      fetchTasks();
    }
  };

  const submitWork = () => {
    if (!submissionModal.taskId) return;
    updateStatus(submissionModal.taskId, "completed", submissionModal.link);
    setSubmissionModal({ isOpen: false, taskId: "", link: "" });
  };

  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const TaskCard = ({ task }: { task: any }) => (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all group flex flex-col gap-3">
      <div>
        <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{task.title}</h3>
        {task.client_profiles?.users?.full_name && (
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">
            From: {task.client_profiles.users.full_name}
          </p>
        )}
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 whitespace-pre-wrap">
          {task.description}
        </p>
      )}

      {task.resource_link && (
        <a 
          href={task.resource_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors w-full break-all"
        >
          <IconLink className="w-3.5 h-3.5 flex-shrink-0" />
          {task.resource_link}
        </a>
      )}

      {task.due_date && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full w-fit">
          <IconAlertCircle className="w-3.5 h-3.5" />
          Due: {new Date(task.due_date).toLocaleDateString()}
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
        {task.status !== "todo" && (
          <button 
            onClick={() => updateStatus(task.id, "todo")}
            className="flex-1 px-3 py-2 rounded-full text-[10px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-center"
          >
            To-Do
          </button>
        )}
        {task.status !== "in_progress" && (
          <button 
            onClick={() => updateStatus(task.id, "in_progress")}
            className="flex-1 px-3 py-2 rounded-full text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all text-center flex justify-center items-center gap-1"
          >
            <IconClock className="w-3 h-3" /> In Progress
          </button>
        )}
        {task.status !== "completed" && (
          <button 
            onClick={() => setSubmissionModal({ isOpen: true, taskId: task.id, link: "" })}
            className="flex-1 px-3 py-2 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all text-center flex justify-center items-center gap-1 cursor-pointer"
          >
            <IconCheckCircle className="w-3 h-3" /> Done
          </button>
        )}
      </div>
    </div>
  );

  return (
    <main className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-5 pb-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-blue-50/50 to-white">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Assigned Tasks</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage your daily work assigned by your clients.
        </p>
      </div>

      {assignments.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 mb-4 tracking-tight">My Active Clients</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map(assignment => {
              const clientName = assignment.client_profiles?.users?.full_name || "Unknown Client";
              const clientAvatar = assignment.client_profiles?.users?.profile_photo_url;
              
              let avatarSrc = "";
              if (clientAvatar) {
                if (clientAvatar.startsWith("{")) {
                  try {
                    const parsed = JSON.parse(clientAvatar);
                    avatarSrc = parsed.avatar || "";
                  } catch {
                    avatarSrc = clientAvatar;
                  }
                } else {
                  avatarSrc = clientAvatar;
                }
              }

              const initials = clientName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

              return (
                <div key={assignment.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl transition-colors hover:bg-slate-100">
                  <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 bg-white">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={clientName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 bg-slate-200 h-full w-full grid place-items-center">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{clientName}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">{assignment.client_profiles?.company_name}</p>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-[#E84E29]/10 text-[#E84E29] text-[9px] font-black uppercase">
                      {assignment.job_posts?.job_title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TO DO COLUMN */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <h2 className="text-sm font-black text-slate-800">To-Do</h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{todoTasks.length}</span>
          </div>
          {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
          {todoTasks.length === 0 && (
            <div className="border-2 border-dashed border-slate-100 rounded-3xl p-6 text-center">
              <p className="text-xs font-bold text-slate-400">No pending tasks</p>
            </div>
          )}
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h2 className="text-sm font-black text-slate-800">In Progress</h2>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{inProgressTasks.length}</span>
          </div>
          {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
          {inProgressTasks.length === 0 && (
            <div className="border-2 border-dashed border-slate-100 rounded-3xl p-6 text-center">
              <p className="text-xs font-bold text-slate-400">Nothing in progress</p>
            </div>
          )}
        </div>

        {/* COMPLETED COLUMN */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h2 className="text-sm font-black text-slate-800">Completed</h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{completedTasks.length}</span>
          </div>
          {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
          {completedTasks.length === 0 && (
            <div className="border-2 border-dashed border-slate-100 rounded-3xl p-6 text-center">
              <p className="text-xs font-bold text-slate-400">No completed tasks yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Modal */}
      {submissionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-white">
              <h3 className="text-lg font-black text-slate-900">Complete Task</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Provide a link to your finished work.</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Submission Link (Optional)</label>
                <input
                  type="url"
                  value={submissionModal.link}
                  onChange={(e) => setSubmissionModal(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="e.g. Google Drive, Frame.io..."
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:border-[#E84E29] focus:ring-[#E84E29] px-4 py-2.5 text-sm transition-colors"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSubmissionModal({ isOpen: false, taskId: "", link: "" })}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitWork}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] shadow-sm transition-all"
              >
                Submit Work
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
