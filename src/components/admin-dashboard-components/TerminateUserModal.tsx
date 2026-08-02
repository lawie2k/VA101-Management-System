"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface TerminateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onSuccess: () => void;
}

export function TerminateUserModal({ isOpen, onClose, userId, userName, onSuccess }: TerminateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  const handleTerminate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}/terminate`, {
        method: "POST",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to terminate user.");
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-black text-slate-900 tracking-tight text-center">Terminate User</h3>
        <p className="text-sm font-semibold text-slate-500 text-center mt-2">
          Are you absolutely sure you want to terminate <span className="text-slate-800 font-bold">{userName}</span>?
        </p>
        <p className="text-xs text-rose-600 font-semibold text-center mt-2 bg-rose-50 p-2 rounded-lg border border-rose-100">
          This will instantly revoke their access and terminate all of their active contracts and assignments.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <input 
            type="checkbox" 
            id="confirm-terminate" 
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-600"
          />
          <label htmlFor="confirm-terminate" className="text-xs font-semibold text-slate-700 cursor-pointer leading-tight">
            I understand that this action is permanent and will forcefully close all active contracts and assignments.
          </label>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button 
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleTerminate}
            disabled={loading || !isConfirmed}
            className="flex-1 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50 flex justify-center"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Yes, Terminate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
