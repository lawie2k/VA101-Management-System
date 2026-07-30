"use client";

import React from "react";

const IconSearch = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconFilter = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const IconX = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconBookmark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
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
  rate: number;
  type: string;
  location: string;
  description: string;
  skills: string[];
}

interface JobsMainFeedProps {
  filteredJobs: Job[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: any) => void;
  savedJobs: string[];
  appliedJobs: string[];
  toggleSaveJob: (id: string) => void;
  toggleSaveJob: (id: string) => void;
  openApplyModal: (job: Job) => void;
}

function JobCard({ 
  job, 
  isBookmarked, 
  hasApplied, 
  toggleSaveJob, 
  openApplyModal 
}: { 
  job: Job; 
  isBookmarked: boolean; 
  hasApplied: boolean; 
  toggleSaveJob: (id: string) => void; 
  openApplyModal: (job: Job) => void; 
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const shouldTruncate = job.description.length > 150;

  return (
    <div 
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-slate-350 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Job Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-snug hover:text-[#E84E29] cursor-pointer">
              {job.title}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-2">
              <span className="font-bold text-slate-700">{job.company}</span>
              <span>•</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold text-[#E84E29] bg-orange-50 border border-orange-100">
                {job.type}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><IconClock className="w-3.5 h-3.5" /> {job.location}</span>
            </p>
          </div>
          
          {/* Save Bookmark Icon */}
          <button 
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 ${
              isBookmarked 
                ? "bg-orange-50 border-orange-200 text-[#E84E29] scale-105" 
                : "bg-white border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-50"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Job"}
          >
            <IconBookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className={`text-xs text-slate-650 font-medium leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
            {job.description}
          </p>
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-[#E84E29] hover:underline mt-1 cursor-pointer"
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* Required Skills tags */}
        <div className="mt-4.5 flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <span 
              key={skill} 
              className="px-2.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200/50 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Rate and Apply Actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Take-home Rate</p>
          <p className="text-slate-800 text-sm font-black mt-0.5">
            You earn <span className="text-[#E84E29] text-base font-black">${job.rate.toFixed(2)}/hr</span>
          </p>
        </div>

        {hasApplied ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
            <IconCheckCircle className="w-3.5 h-3.5" /> Applied
          </span>
        ) : (
          <button 
            onClick={() => openApplyModal(job)}
            className="inline-flex items-center gap-1.5 px-5.5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#D54522] transition-all shadow-xs cursor-pointer hover:translate-x-0.5"
          >
            Apply Now <IconArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function JobsMainFeed({
  filteredJobs,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  savedJobs,
  appliedJobs,
  toggleSaveJob,
  openApplyModal,
}: JobsMainFeedProps) {
  return (
    <main 
      onScroll={(e) => {
        window.dispatchEvent(new CustomEvent("feedScroll", { detail: { scrollTop: e.currentTarget.scrollTop } }));
      }}
      className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6"
    >
      
      {/* Search & Filter Header card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Browse Posted Jobs</h2>
          <p className="text-xs font-semibold text-slate-450 mt-1">Discover, save, and apply to vetted client requirements matching your profile.</p>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <span className="absolute left-3.5 top-3.5 text-slate-400">
            <IconSearch className="w-4 h-4" />
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company name, or core skills..."
            className="w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category capsules */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1 shrink-0">
            <IconFilter className="w-3.5 h-3.5" /> Filter:
          </span>
          {["All", "Full-time", "Part-time", "Contract"].map((type) => {
            const isActive = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive 
                    ? "bg-[#E84E29] text-white shadow-xs" 
                    : "bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100/50"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Postings Stream */}
      <div className="space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isBookmarked = savedJobs.includes(job.id);
            const hasApplied = appliedJobs.includes(job.id);

            return (
              <JobCard 
                key={job.id} 
                job={job} 
                isBookmarked={isBookmarked} 
                hasApplied={hasApplied} 
                toggleSaveJob={toggleSaveJob} 
                openApplyModal={openApplyModal} 
              />
            );
          })
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <p className="text-sm font-extrabold text-slate-500">No jobs found matching your filters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedType("All"); }}
              className="mt-3 text-xs font-bold text-[#E84E29] hover:underline cursor-pointer"
            >
              Clear search filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
