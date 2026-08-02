"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecureViewerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fileUrl = searchParams.get("url");
    if (fileUrl) {
      setUrl(fileUrl);
    }
  }, [searchParams]);

  if (!url) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white flex-col gap-4">
        <p className="font-bold">Loading document...</p>
        <button onClick={() => router.back()} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl text-sm font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col overflow-hidden relative">
      {/* Top Header */}
      <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E84E29]/20 flex items-center justify-center text-[#E84E29]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <span className="text-sm font-bold text-white tracking-wide">Secure Document Viewer</span>
        </div>
        <button 
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              window.close();
            }
          }} 
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          Close Document
        </button>
      </div>

      {/* Viewer Area */}
      <div 
        className="flex-1 relative bg-slate-800 flex items-center justify-center"
        onContextMenu={(e) => e.preventDefault()}
      >
        <iframe 
          src={`${url}${url.includes("#") ? "" : "#toolbar=0&navpanes=0&scrollbar=0"}`}
          className="w-full h-full border-0 pointer-events-auto"
          title="Secure Document"
        />

        {/* Anti-download Edge Overlays */}
        <div className="absolute top-0 left-0 w-full h-16 bg-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-transparent z-10" />
        <div className="absolute top-0 right-0 w-16 h-full bg-transparent z-10" />
        <div className="absolute top-0 left-0 w-16 h-full bg-transparent z-10" />
      </div>
    </div>
  );
}
