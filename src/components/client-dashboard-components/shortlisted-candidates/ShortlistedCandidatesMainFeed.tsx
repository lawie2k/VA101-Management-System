"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ClientVAProfileModal from "../ClientVAProfileModal";

const IconUser = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const IconMail = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconStar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function ShortlistedCandidatesMainFeed({ initialCandidates }: { initialCandidates?: any[] }) {
  const [candidates, setCandidates] = useState<any[]>(initialCandidates || []);
  const [loading, setLoading] = useState(!initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [openInScheduleMode, setOpenInScheduleMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("All Jobs");

  useEffect(() => {
    async function loadShortlists() {
      try {
        const res = await fetch("/api/client/shortlists");
        if (res.ok) {
          const data = await res.json();
          setCandidates(data);
        }
      } catch (e) {
        console.error("Failed to load shortlists", e);
      } finally {
        setLoading(false);
      }
    }
    if (!initialCandidates) {
      loadShortlists();
    }
  }, [initialCandidates]);

  // Extract unique roles for filtering
  const uniqueRoles = ["All Jobs", ...Array.from(new Set(candidates.map(c => c.role)))].filter(Boolean);

  const filteredCandidates = selectedRole === "All Jobs" 
    ? candidates 
    : candidates.filter(c => c.role === selectedRole);

  return (
    <main className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-indigo-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Shortlisted Candidates</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review the top talent matched to your job posts.
          </p>
        </div>
        
        {/* Job Filter Dropdown */}
        {uniqueRoles.length > 1 && (
          <div className="shrink-0">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-xl focus:outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all cursor-pointer shadow-sm appearance-none pr-10"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
            >
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Candidate List */}
      <div className="space-y-4">
        {filteredCandidates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-xs text-center">
            <h4 className="text-sm font-bold text-slate-700">No candidates found</h4>
            <p className="text-xs text-slate-400 font-medium mt-1">
              There are no candidates matching your current filter.
            </p>
          </div>
        ) : (
          filteredCandidates.map(candidate => (
            <div key={candidate.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                {candidate.avatar ? (
                  <img src={candidate.avatar} alt={candidate.candidateName} className="w-full h-full object-cover" />
                ) : (
                  <IconUser className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#E84E29] transition-colors">{candidate.candidateName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{candidate.role} • {candidate.experience}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                    {candidate.status === "shortlisted" ? "Shortlisted" : "Interviewing"}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {candidate.skills?.map((skill: string) => (
                    <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-4 mt-auto flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400">Applied {candidate.appliedDate}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setOpenInScheduleMode(false);
                      }}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setOpenInScheduleMode(true);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-[11px] font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] shadow-sm transition-all cursor-pointer"
                    >
                      <IconCalendar className="w-3 h-3" />
                      Schedule Interview
                    </button>
                  </div>
                </div>
              </div>
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
