"use client";

import React, { useState } from "react";
import Link from "next/link";
import ClientVAProfileModal from "../ClientVAProfileModal";

/* ─── Inline SVG Icons ─── */

const IconPhone = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconBriefcase = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconPlus = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconArrowRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconCalendar = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconUser = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const IconStar = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ─── Types ─── */

interface JobPost {
  id: string;
  title: string;
  type: string;
  rate: number;
  status: "active" | "draft" | "closed";
  applicants: number;
  postedDate: string;
}

interface ShortlistedCandidate {
  id: string;
  name: string;
  title: string;
  location: string;
  rating: number | null;
  skills: string[];
  hourlyRate: number;
  avatar: string | null;
}

interface ClientMainFeedProps {
  companyName: string;
  jobPosts: JobPost[];
  shortlistedCandidates: ShortlistedCandidate[];
}

/* ─── Status Badge ─── */

function JobStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-500/10 border-emerald-500/25",
    draft: "text-amber-700 bg-amber-500/10 border-amber-500/25",
    closed: "text-slate-500 bg-slate-200/60 border-slate-300/50",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${styles[status] || styles.draft}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-500 animate-pulse" : status === "draft" ? "bg-amber-500" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}

/* ─── Component ─── */

export default function ClientMainFeed({ companyName, jobPosts, shortlistedCandidates }: ClientMainFeedProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<ShortlistedCandidate | null>(null);
  const [openInScheduleMode, setOpenInScheduleMode] = useState(false);

  return (
    <main className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6">

      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-[#E84E29]/5 via-white to-amber-50/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E84E29]">
              Welcome back
            </p>
            <h2 className="text-xl font-black text-slate-900 mt-1 leading-tight">
              {companyName || "Your Company"}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1.5 max-w-md">
              Manage your job postings, review shortlisted candidates, and grow your remote team.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/discovery-calls"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-[#E84E29] hover:text-white hover:border-[#E84E29] transition-all shadow-sm hover:shadow-md"
            >
              <IconPhone className="w-3.5 h-3.5" />
              Discovery Call
            </Link>
            <Link
              href="/client/post-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-3.5 h-3.5" />
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Your Job Posts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
            Your Job Posts
          </h3>
          <Link
            href="/client/jobs"
            className="text-xs font-bold text-[#E84E29] hover:text-[#DA431E] flex items-center gap-0.5 hover:underline"
          >
            View all <IconArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {jobPosts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <IconBriefcase className="w-7 h-7 text-slate-300" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No job posts yet</h4>
            <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs mx-auto">
              Post your first job to start receiving applications from qualified virtual assistants.
            </p>
            <Link
              href="/client/jobs"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm"
            >
              <IconPlus className="w-3.5 h-3.5" />
              Post Your First Job
            </Link>
          </div>
        ) : (
          jobPosts.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <JobStatusBadge status={job.status} />
                    <span className="text-[10px] font-semibold text-slate-400">
                      Posted {job.postedDate}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight group-hover:text-[#E84E29] transition-colors">
                    {job.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <IconBriefcase className="w-3 h-3" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconUser className="w-3 h-3" />
                      {job.applicants} applicant{job.applicants !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-slate-800">${(job.rate || 0).toFixed(2)}</p>
                  <p className="text-[10px] font-semibold text-slate-400">/hr</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <Link
                  href="/client/jobs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs"
                >
                  View Applicants
                  <IconArrowRight className="w-3 h-3" />
                </Link>
                <button className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer">
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Shortlisted Candidates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
            Shortlisted Candidates
          </h3>
          <Link
            href="/client/candidates"
            className="text-xs font-bold text-[#E84E29] hover:text-[#DA431E] flex items-center gap-0.5 hover:underline"
          >
            View all <IconArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {shortlistedCandidates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <IconUser className="w-7 h-7 text-slate-300" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No shortlisted candidates</h4>
            <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs mx-auto">
              Once VA101 screens applicants for your jobs, shortlisted candidates will appear here for your review.
            </p>
          </div>
        ) : (
          shortlistedCandidates.map((candidate) => (
            <div key={candidate.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  {candidate.avatar ? (
                    <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-extrabold text-xs">
                      {candidate.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {candidate.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {candidate.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                    <span className="flex items-center gap-0.5 text-slate-400 font-semibold">
                      <IconMapPin className="w-3 h-3" />
                      {candidate.location}
                    </span>
                    {candidate.rating !== null ? (
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <IconStar className="w-3 h-3" />
                        {candidate.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-semibold">No ratings</span>
                    )}
                    <span className="font-bold text-slate-700">
                      ${(candidate.hourlyRate || 0).toFixed(2)}/hr
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {candidate.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100/70 border border-slate-200/50 rounded-lg">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-50 rounded-lg">
                        +{candidate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setOpenInScheduleMode(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-xs cursor-pointer"
                >
                  <IconCalendar className="w-3 h-3" />
                  Schedule Interview
                </button>
                <button 
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setOpenInScheduleMode(false);
                  }}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Candidate Profile Modal */}
      {selectedCandidate && selectedCandidate.vaProfileId && (
        <ClientVAProfileModal 
          vaProfileId={selectedCandidate.vaProfileId} 
          shortlistId={selectedCandidate.id}
          defaultScheduleForm={openInScheduleMode}
          onClose={() => {
            setSelectedCandidate(null);
            setOpenInScheduleMode(false);
          }} 
        />
      )}

    </main>
  );
}
