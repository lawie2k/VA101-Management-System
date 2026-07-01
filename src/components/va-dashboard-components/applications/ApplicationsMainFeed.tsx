"use client";

import React from "react";

const IconInfo = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

interface Application {
  id: string;
  title: string;
  company: string;
  appliedDate: string;
  status: string;
}

interface ApplicationsMainFeedProps {
  applications: Application[];
  getStepNumber: (status: string) => number;
}

export default function ApplicationsMainFeed({
  applications,
  getStepNumber,
}: ApplicationsMainFeedProps) {
  return (
    <main 
      onScroll={(e) => {
        window.dispatchEvent(new CustomEvent("feedScroll", { detail: { scrollTop: e.currentTarget.scrollTop } }));
      }}
      className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-6 pb-6"
    >
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Applications</h2>
        <p className="text-xs font-semibold text-slate-450 mt-1">Track updates for roles you applied to through the portal.</p>
      </div>

      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => {
            const currentStep = getStepNumber(app.status);
            return (
              <div key={app.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base leading-tight">{app.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1">{app.company} • Applied on {app.appliedDate}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold text-teal-850 bg-teal-50 border border-teal-100 capitalize">
                    {app.status === "initial_interview" ? "Interviewing" : app.status}
                  </span>
                </div>

                {/* Application Progress Bar */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Step 1: Applied */}
                    <div className="text-center relative">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-[10px] ${
                        currentStep >= 1 ? "bg-[#E84E29] text-white" : "bg-slate-200 text-slate-500 border border-slate-300"
                      }`}>
                        {currentStep > 1 ? "✓" : "1"}
                      </div>
                      <span className="text-[9px] font-bold text-slate-800">Applied</span>
                    </div>

                    {/* Step 2: Screening */}
                    <div className="text-center relative">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-[10px] ${
                        currentStep >= 2 ? "bg-[#E84E29] text-white" : "bg-slate-200 text-slate-500 border border-slate-300"
                      }`}>
                        {currentStep > 2 ? "✓" : "2"}
                      </div>
                      <span className="text-[9px] font-bold text-slate-800">Screening</span>
                    </div>

                    {/* Step 3: Interview */}
                    <div className="text-center relative">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-[10px] ${
                        currentStep >= 3 ? "bg-[#E84E29] text-white" : "bg-slate-200 text-slate-500 border border-slate-300"
                      }`}>
                        {currentStep > 3 ? "✓" : "3"}
                      </div>
                      <span className="text-[9px] font-bold text-slate-800">Interview</span>
                    </div>

                    {/* Step 4: Offer */}
                    <div className="text-center relative">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-[10px] ${
                        currentStep >= 4 ? "bg-[#E84E29] text-white" : "bg-slate-200 text-slate-500 border border-slate-300"
                      }`}>
                        4
                      </div>
                      <span className="text-[9px] font-bold text-slate-800">Offered</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1"><IconInfo className="w-3.5 h-3.5" /> Client will respond within 3 working days.</span>
                  <button className="text-[#E84E29] hover:underline hover:text-[#DA431E]">Withdraw Application</button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No Applications Yet</p>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              You haven't submitted any job applications yet. Go to the Jobs tab to find matching opportunities!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
