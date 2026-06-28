"use client";

import { useState } from "react";
import Link from "next/link";

// Inline SVG Icon Components to avoid external package dependencies
const IconBookmark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconLightbulb = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <line x1="9" y1="18" x2="15" y2="18"></line>
    <line x1="10" y1="22" x2="14" y2="22"></line>
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
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

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// Self-contained Mock Data for immediately viewable frontend structure
const MOCK_PROFILE = {
  fullName: "Jane Doe",
  title: "Executive Virtual Assistant",
  location: "Manila, Philippines",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  completion: 85,
  views: 124,
  availability: "Active Availability (30 hrs/week)",
  skills: ["Executive Support", "Email Management", "Data Entry", "Social Media", "Scheduling"],
};

const MOCK_JOBS = [
  { 
    id: "job-1", 
    title: "Social Media Manager", 
    company: "AeroMedia Group", 
    rate: 10.00, 
    type: "Part-time", 
    description: "Manage Instagram, TikTok, and Facebook posts, content scheduling, and community engagement tracking.", 
    skills: ["Content Creation", "Canva", "Scheduling"] 
  },
  { 
    id: "job-2", 
    title: "Executive Assistant", 
    company: "Summit Ventures", 
    rate: 15.00, 
    type: "Full-time", 
    description: "Manage CEO calendar, coordinate discovery calls, draft stakeholder communications, and handle administration.", 
    skills: ["Calendar Management", "Slack", "Email Handling"] 
  },
  { 
    id: "job-3", 
    title: "Shopify Store Operations Specialist", 
    company: "Zoe Boutique", 
    rate: 12.50, 
    type: "Contract", 
    description: "Inventory updates, order fulfillment, and client support ticketing handling for fashion store orders.", 
    skills: ["Shopify", "Customer Support", "Zendesk"] 
  }
];

const MOCK_INTERVIEWS = [
  { 
    id: "int-1", 
    jobTitle: "Social Media Manager", 
    company: "AeroMedia Group",
    type: "initial_interview", 
    scheduledAt: "June 29, 2026 at 2:00 PM" 
  },
  { 
    id: "int-2", 
    jobTitle: "Executive Assistant", 
    company: "Summit Ventures",
    type: "client_interview", 
    scheduledAt: "July 2, 2026 at 10:00 AM" 
  }
];

const MOCK_COURSES = [
  { id: "c-1", title: "VA101 Professional Ethics & Standards", progress: 80, category: "Core Training" },
  { id: "c-2", title: "Advanced Client Lead Generation Strategies", progress: 35, category: "Marketing & Sales" }
];

const MOCK_APPLICATION = {
  jobTitle: "Junior Project Manager",
  company: "CloudScale Inc.",
  status: "screening", // applied, screening, initial_interview, client_interview, offered, contracted
  appliedDate: "June 25, 2026"
};

export default function Page() {
  const [savedJobs, setSavedJobs] = useState<string[]>(["job-2"]);

  const toggleSaveJob = (id: string) => {
    setSavedJobs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      
      {/* Portal 3-Column LinkedIn-Style Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Profile Summary Card */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            {/* Cover Banner */}
            <div 
              className="h-20 bg-cover bg-center" 
              style={{ backgroundImage: `url(${MOCK_PROFILE.coverImage})` }}
            />
            
            {/* User Avatar overlay */}
            <div className="px-6 pb-6 relative">
              <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-sm absolute -top-8 left-6">
                <img 
                  src={MOCK_PROFILE.avatar} 
                  alt={MOCK_PROFILE.fullName} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Spacer */}
              <div className="h-10" />

              {/* Profile Details */}
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                {MOCK_PROFILE.fullName}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {MOCK_PROFILE.title}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-2">
                <IconMapPin className="w-3.5 h-3.5" />
                <span>{MOCK_PROFILE.location}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                {/* Status Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  {MOCK_PROFILE.availability}
                </span>
              </div>

              {/* Profile Completion Indicator */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Profile Strength</span>
                  <span className="text-teal-600">{MOCK_PROFILE.completion}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-teal-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${MOCK_PROFILE.completion}%` }}
                  />
                </div>
              </div>

              {/* Analytics */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-black text-slate-800">{MOCK_PROFILE.views}</p>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Profile Views</p>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-800">4.8★</p>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Rating Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Tools Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
              Top Core Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {MOCK_PROFILE.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100/70 border border-slate-200/50 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE COLUMN: Recommendations feed / Activity timeline */}
        <main className="lg:col-span-6 space-y-6">
          
          {/* Timeline Progress Tracker */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Active Application Status
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                Applied {MOCK_APPLICATION.appliedDate}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {MOCK_APPLICATION.jobTitle}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {MOCK_APPLICATION.company}
              </p>

              {/* Progress Steps Timeline */}
              <div className="mt-5 grid grid-cols-4 gap-2 relative">
                {/* Applied Step */}
                <div className="text-center relative">
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-1">
                    <IconCheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-800">Applied</span>
                </div>

                {/* Screening Step */}
                <div className="text-center relative">
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-1">
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
                href="/jobs" 
                className="text-xs font-bold text-[#E84E29] hover:text-[#DA431E] flex items-center gap-0.5 hover:underline"
              >
                View all <IconChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {MOCK_JOBS.map((job) => (
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
                      You earn <span className="text-teal-600 text-base">${job.rate.toFixed(2)}/hr</span>
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
                className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
              >
                My learning page
              </Link>
            </div>

            <div className="space-y-4">
              {MOCK_COURSES.map((course) => (
                <div key={course.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-100 rounded-md px-2 py-0.5">
                      {course.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-1.5">{course.title}</h4>
                    
                    {/* Progress bar container */}
                    <div className="flex items-center gap-2 pt-1 w-48 sm:w-56">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full" style={{ width: `${course.progress}%` }} />
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

        {/* RIGHT COLUMN: Upcoming interviews / Saved items / Widgets rail */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Upcoming Interviews widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
              Upcoming Interviews
            </h4>
            
            {MOCK_INTERVIEWS.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold">No interviews scheduled yet.</p>
            ) : (
              <ul className="space-y-3.5">
                {MOCK_INTERVIEWS.map((interview) => (
                  <li key={interview.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-150 rounded px-1.5 py-0.5">
                      {interview.type === "initial_interview" ? "HR Screening" : "Client Call"}
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-800 leading-tight">
                      {interview.jobTitle}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {interview.company}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold pt-1">
                      <IconClock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{interview.scheduledAt}</span>
                    </div>
                    
                    <button className="w-full inline-flex items-center justify-center py-2 border border-transparent rounded-full text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-xs">
                      Join Meeting
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Saved Jobs list widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
              Saved Jobs
            </h4>
            <ul className="space-y-3">
              {MOCK_JOBS.filter(j => savedJobs.includes(j.id)).length === 0 ? (
                <p className="text-xs text-slate-400 font-semibold">No jobs bookmarked yet.</p>
              ) : (
                MOCK_JOBS.filter(j => savedJobs.includes(j.id)).map((job) => (
                  <li key={`saved-${job.id}`} className="flex items-start gap-2 text-xs">
                    <IconBookmark className="mt-0.5 w-3.5 h-3.5 text-[#E84E29]" />
                    <div className="min-w-0">
                      <Link 
                        href={`/jobs/${job.id}`} 
                        className="block font-bold text-slate-800 truncate hover:underline"
                      >
                        {job.title}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {job.company} • ${job.rate.toFixed(2)}/hr
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Career Tips box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
              Career Tips
            </h4>
            <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-4 text-xs">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold mb-2">
                <IconLightbulb className="w-4 h-4 text-amber-500" />
                <span>Introduce Yourself</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Adding a 30-second introduction video to your profile card increases discovery rate and call schedules by <strong>2.4×</strong>.
              </p>
              <button className="mt-3.5 text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 hover:underline cursor-pointer">
                Update profile video <IconArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
