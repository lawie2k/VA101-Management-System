"use client";

import Link from "next/link";

const IconUpload = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconBook = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default function TrainerMainFeed() {
  return (
    <main className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      
      {/* Welcome Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs bg-gradient-to-br from-[#E84E29]/5 via-white to-orange-50/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E84E29]/5 rounded-bl-full -z-10 blur-3xl"></div>
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trainer Dashboard</h1>
            <p className="text-sm font-medium text-slate-500 mt-2 max-w-sm leading-relaxed">
              Upload your training materials, track student progress, and monitor your earnings.
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
            <Link 
              href="/trainer/materials/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <IconUpload className="w-4 h-4" /> Upload Course
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Materials */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Recent Materials</h2>
          <Link href="/trainer/materials" className="text-xs font-bold text-[#E84E29] hover:text-[#DA431E] transition-colors">
            View All
          </Link>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
            <IconBook className="w-6 h-6 text-slate-300" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No materials yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Upload your first course to start earning.</p>
          <Link 
            href="/trainer/materials/create"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
          >
            Create Course
          </Link>
        </div>
      </div>

    </main>
  );
}
