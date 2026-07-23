import React from "react";
import { PCard, PCardHeader, Button, Badge } from "./VAProfileUI";
import { IconCalendar, IconPencil, IconBriefcase, IconMapPin, IconPlus, IconGraduationCap, IconX, IconCheck, IconWrench, IconStar } from "./VAProfileIcons";
import { VAProfileData } from "./types";

export function VAProfileMainFeed({ profile, feedbackData, openEditAbout, openAddExperience, handleDeleteExperience, openAddPortfolio, handleDeletePortfolio, openAddCertification, handleDeleteCertification, editSkills, setEditSkills, toggleSkill, ALL_SKILLS, editTools, setEditTools, toggleTool, ALL_TOOLS, editNiches, setEditNiches, toggleNiche, ALL_NICHES, handleSaveProfile, openEditAvailability }: any) {
  return (
    <div className="space-y-6">
          
          {/* ABOUT SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="About" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full p-2" onClick={openEditAbout}>
                  <IconPencil className="h-4 w-4 text-slate-500" />
                </Button>
              } 
            />
            <p className="text-sm leading-relaxed text-slate-650 font-medium">
              {profile.about || "Write a short summary about your background and specialty to attract potential clients."}
            </p>
          </PCard>

          {/* RATINGS SECTION */}
          {feedbackData && (
            <PCard className="hover:border-slate-350">
              <PCardHeader title="Ratings" />
              {feedbackData.feedbacks && feedbackData.feedbacks.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center">
                      <IconStar className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="ml-1.5 text-xl font-black text-slate-900">{feedbackData.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-slate-500 font-medium">Based on {feedbackData.totalReviews} reviews</span>
                  </div>
                  {feedbackData.feedbacks.map((fb: any) => (
                    <div key={fb.id} className="py-3 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 overflow-hidden">
                            {fb.users?.profile_photo_url ? (
                              <img src={fb.users.profile_photo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold">{fb.users?.full_name?.[0] || 'C'}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{fb.users?.full_name || 'Client'}</p>
                            <p className="text-xs text-slate-500 font-medium">{new Date(fb.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <IconStar key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      {fb.comment && (
                        <p className="text-sm text-slate-700 italic">"{fb.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <IconStar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No ratings yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[250px] mx-auto">
                    As you complete assignments, client and admin ratings will appear here.
                  </p>
                </div>
              )}
            </PCard>
          )}

          {/* FEATURED / PORTFOLIO SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Featured / portfolio" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full px-3 py-1 text-[#E84E29] hover:text-[#DA431E]" onClick={openAddPortfolio}>
                  <span className="flex items-center gap-1"><IconPlus className="h-3.5 w-3.5" /> Add</span>
                </Button>
              } 
            />
            {profile.portfolio.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic">No portfolio items added yet. Click Add to show work samples.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {profile.portfolio.map((item: any) => (
                  <div key={item.id} className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-150 bg-slate-50/50 p-3 hover:border-slate-300 hover:bg-white transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white border border-slate-100 text-xl shadow-xs">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800 leading-tight">{item.title}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all cursor-pointer animate-in fade-in duration-200"
                      title="Delete sample"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </PCard>

          {/* EXPERIENCE SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Experience" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full px-3 py-1 text-[#E84E29] hover:text-[#DA431E]" onClick={openAddExperience}>
                  <span className="flex items-center gap-1"><IconPlus className="h-3.5 w-3.5" /> Add</span>
                </Button>
              } 
            />
            {profile.experience.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic">No work experience listed yet.</p>
            ) : (
              <ul className="space-y-4">
                {profile.experience.map((exp: any) => (
                  <li key={exp.id} className="group flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 border border-orange-100 text-[#E84E29]">
                        <IconBriefcase className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">{exp.role}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-1">{exp.company}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{exp.period}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all cursor-pointer animate-in fade-in duration-200"
                      title="Delete experience"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </PCard>

          {/* SKILLS SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Skills" 
              action={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full px-3 py-1 ${editSkills ? "text-[#E84E29] bg-orange-50" : "text-slate-500"}`}
                  onClick={() => setEditSkills(!editSkills)}
                >
                  {editSkills ? "Done" : "Edit"}
                </Button>
              } 
            />
            <div className="flex flex-wrap gap-2">
              {editSkills ? (
                ALL_SKILLS.map((s: string) => {
                  const active = profile.skills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        active 
                          ? "bg-[#E84E29] text-white border-[#E84E29]" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-650"
                      }`}
                    >
                      {active && <IconCheck className="h-3.5 w-3.5" />} {s}
                    </button>
                  );
                })
              ) : (
                profile.skills.map((s: string) => (
                  <Badge key={s} variant="default" className="rounded-full font-bold">
                    {s}
                  </Badge>
                ))
              )}
            </div>
          </PCard>

          {/* TOOLS & PLATFORMS SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Tools & platforms" 
              action={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full px-3 py-1 ${editTools ? "text-[#E84E29] bg-orange-50" : "text-slate-500"}`}
                  onClick={() => setEditTools(!editTools)}
                >
                  {editTools ? "Done" : "Edit"}
                </Button>
              } 
            />
            <div className="flex flex-wrap gap-2">
              {editTools ? (
                ALL_TOOLS.map((t: string) => {
                  const active = profile.tools.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTool(t)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        active 
                          ? "bg-orange-50 text-orange-700 border-orange-200" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-650"
                      }`}
                    >
                      {active && <IconCheck className="h-3.5 w-3.5 text-[#E84E29]" />} {t}
                    </button>
                  );
                })
              ) : (
                profile.tools.map((t: string) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold bg-orange-50 border border-orange-100 text-orange-750"
                  >
                    <IconWrench className="h-3 w-3 text-[#E84E29]" /> {t}
                  </span>
                ))
              )}
            </div>
          </PCard>

          {/* NICHE SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Niche" 
              action={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full px-3 py-1 ${editNiches ? "text-[#E84E29] bg-orange-50" : "text-slate-500"}`}
                  onClick={() => setEditNiches(!editNiches)}
                >
                  {editNiches ? "Done" : "Edit"}
                </Button>
              } 
            />
            <div className="flex flex-wrap gap-2">
              {editNiches ? (
                ALL_NICHES.map((n: string) => {
                  const active = profile.niche === n;
                  return (
                    <button
                      key={n}
                      onClick={() => toggleNiche(n)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        active 
                          ? "bg-[#E84E29] text-white border-[#E84E29] shadow-xs" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-650"
                      }`}
                    >
                      {active && <IconCheck className="h-3.5 w-3.5" />} {n}
                    </button>
                  );
                })
              ) : (
                <Badge variant="default" className="rounded-full font-bold">
                  {profile.niche}
                </Badge>
              )}
            </div>
          </PCard>

          {/* AVAILABILITY SECTION */}
          <PCard className="hover:border-slate-355">
            <PCardHeader 
              title="Availability" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full p-2" onClick={openEditAvailability}>
                  <IconPencil className="h-4 w-4 text-slate-500" />
                </Button>
              } 
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4 text-[#E84E29]" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours</span>
                </div>
                <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability.hours}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2">
                  <IconBriefcase className="h-4 w-4 text-[#E84E29]" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule</span>
                </div>
                <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability.schedule}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2">
                  <IconMapPin className="h-4 w-4 text-[#E84E29]" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time zone</span>
                </div>
                <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability.timezone}</p>
              </div>
            </div>
          </PCard>

          {/* CERTIFICATIONS & COURSES SECTION */}
          <PCard className="hover:border-slate-350">
            <PCardHeader 
              title="Certifications & courses" 
              action={
                <Button variant="ghost" size="sm" className="rounded-full px-3 py-1 text-[#E84E29] hover:text-[#DA431E]" onClick={openAddCertification}>
                  <span className="flex items-center gap-1"><IconPlus className="h-3.5 w-3.5" /> Add</span>
                </Button>
              } 
            />
            {profile.certifications.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic">No courses or certifications listed.</p>
            ) : (
              <ul className="space-y-3">
                {profile.certifications.map((cert: any) => (
                  <li key={cert.id} className="group flex items-center justify-between gap-3 rounded-2xl bg-slate-50/30 border border-slate-100 p-3 hover:bg-slate-50/70 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-50 text-[#E84E29] border border-orange-100/50">
                        <IconGraduationCap className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800">{cert.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold ml-2">— {cert.provider}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {cert.completed ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-0.5 flex items-center gap-0.5">
                          <IconCheck className="w-3.5 h-3.5 text-emerald-500" /> Completed
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5">
                          In progress {cert.progress}%
                        </span>
                      )}
                      <button 
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all cursor-pointer animate-in fade-in duration-200"
                        title="Remove certification"
                      >
                        <IconX className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </PCard>
        </div>
  );
}
