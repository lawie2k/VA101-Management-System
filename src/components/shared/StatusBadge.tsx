import React from "react";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeStyle = (statusName: string) => {
    const s = statusName.toLowerCase();
    
    // Green (Success / Active / Approved / Hired)
    if (["approved", "hired", "active", "published"].includes(s)) {
      return "bg-[#dcfce7] text-[#166534]";
    }
    
    // Orange/Yellow (Pending / Warning)
    if (["pending review", "pending"].includes(s)) {
      return "bg-[#ffedd5] text-[#9a3412]";
    }

    // Blue (In Progress / Action Needed)
    if (["revision requested", "initial interview scheduled", "client interview scheduled", "under business review"].includes(s)) {
      return "bg-blue-100 text-blue-800";
    }

    // Cyan (New / Applied / Shortlisted)
    if (["applied", "shortlisted to client"].includes(s)) {
      return "bg-cyan-100 text-cyan-800";
    }

    // Red (Error / Failed / Rejected / Inactive)
    if (["rejected", "initial interview failed", "inactive", "disabled", "failed"].includes(s)) {
      return "bg-red-100 text-red-800";
    }

    // Default Gray
    return "bg-slate-100 text-slate-800";
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${getBadgeStyle(status)}`}>
      {status}
    </span>
  );
}
