"use client";

import React from "react";
import Link from "next/link";

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconBookmark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconArrowRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  description: string;
  skills: string[];
  rate: number;
}

interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
}

interface DashboardMainFeedProps {
  mockApplication: {
    appliedDate: string;
    jobTitle: string;
    company: string;
  };
  mockJobs: Job[];
  mockCourses: Course[];
  savedJobs: string[];
  toggleSaveJob: (id: string) => void;
}

export default function DashboardMainFeed({
  mockApplication,
  mockJobs,
  mockCourses,
  savedJobs,
  toggleSaveJob,
}: DashboardMainFeedProps) {
  return (
    <main 
      onScroll={(e) => {
        window.dispatchEvent(new CustomEvent("feedScroll", { detail: { scrollTop: e.currentTarget.scrollTop } }));
      }}
      className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-6 pb-6"
    >
      
      {/* Timeline Progress Tracker */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Active Application Status
          </h3>
          <span className="text-[10px] font-bold text-slate-400">
            Applied {mockApplication.appliedDate}
          </span>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
          <p className="text-xs font-bold text-slate-900 leading-tight">
            {mockApplication.jobTitle}
          </p>
          <p className="text-[11px] text-slate-550 font-medium">
            {mockApplication.company}
          </p>

          {/* Progress Steps Timeline */}
          <div className="mt-5 grid grid-cols-4 gap-2 relative">
            {/* Applied Step */}
            <div className="text-center relative">
              <div className="w-6 h-6 rounded-full bg-[#E84E29] text-white flex items-center justify-center mx-auto mb-1 animate-pulse">
                <IconCheckCircle className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-bold text-slate-800">Applied</span>
            </div>

            {/* Screening Step */}
            <div className="text-center relative">
              <div className="w-6 h-6 rounded-full bg-[#E84E29] text-white flex items-center justify-center mx-auto mb-1">
                <IconCheckCircle className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-bold text-slate-800">Screening</span>
            </div>

            {/* Interview Step */}
            <div className="text-center relative">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-1 border border-slate-300">
                <span className="text-[9px] font-bold">3</span>
              </div>
              <span className="text-[9px] font-bold text-slate-400">Interview</span>
            </div>

            {/* Offered Step */}
            <div className="text-center relative">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-1 border border-slate-300">
                <span className="text-[9px] font-bold">4</span>
              </div>
              <span className="text-[9px] font-bold text-slate-400">Contract</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Job Feed list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
            Recommended Jobs for You
          </h3>
          <Link 
            href="/va/jobs" 
            className="text-xs font-bold text-[#E84E29] hover:text-[#DA431E] flex items-center gap-0.5 hover:underline"
          >
            View all <IconChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {mockJobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base leading-tight hover:text-[#E84E29] cursor-pointer">
                    {job.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    {job.company} • <span className="text-[#E84E29]">{job.type}</span>
                  </p>
                </div>
                
                {/* Save Job Button */}
                <button 
                  onClick={() => toggleSaveJob(job.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    savedJobs.includes(job.id) 
                      ? "bg-orange-50 border-orange-200 text-[#E84E29]" 
                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <IconBookmark className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-3.5">
                {job.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/50 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Card bottom rate block & apply action */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Take-home Rate</p>
                <p className="text-slate-800 text-sm font-black mt-0.5">
                  You earn <span className="text-[#E84E29] text-base">${job.rate.toFixed(2)}/hr</span>
                </p>
              </div>

              <button className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm cursor-pointer">
                Apply Now <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Training Progress Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Active Training Progress
          </h3>
          <Link 
            href="/va/training" 
            className="text-xs font-bold text-[#E84E29] hover:text-[#DA431E] hover:underline"
          >
            My learning page
          </Link>
        </div>

        <div className="space-y-4">
          {mockCourses.map((course) => (
            <div key={course.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-orange-650 bg-orange-50 border border-orange-100 rounded-md px-2 py-0.5">
                  {course.category}
                </span>
                <h4 className="text-xs font-bold text-slate-850 mt-1.5">{course.title}</h4>
                
                {/* Progress bar container */}
                <div className="flex items-center gap-2 pt-1 w-48 sm:w-56">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#E84E29] h-full rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">{course.progress}%</span>
                </div>
              </div>

              <button className="self-start sm:self-center shrink-0 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-700 px-3.5 py-1.5 rounded-full cursor-pointer transition-all">
                Resume Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
