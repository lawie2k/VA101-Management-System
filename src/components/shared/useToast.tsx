"use client";

import { useState, useCallback } from "react";

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}

export function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;

  return (
    <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 font-bold text-sm ${
      toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
    }`}>
      {toast.type === "success" && (
        <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      )}
      {toast.message}
    </div>
  );
}
