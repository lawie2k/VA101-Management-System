"use client";

import React, { useEffect, useState } from "react";
import { PCard, PCardHeader, Badge } from "../va-dashboard-components/profile/VAProfileUI";
import { 
  IconMapPin, IconCalendar, IconBriefcase, IconGraduationCap, 
  IconWrench, IconCheck, IconStar, IconX
} from "../va-dashboard-components/profile/VAProfileIcons";

interface ClientVAProfileModalProps {
  vaProfileId: string;
  shortlistId?: string;
  defaultScheduleForm?: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
];

export default function ClientVAProfileModal({ vaProfileId, shortlistId, defaultScheduleForm = false, onClose }: ClientVAProfileModalProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Scheduling Form State
  const [showScheduleForm, setShowScheduleForm] = useState(defaultScheduleForm);
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [nextDays, setNextDays] = useState<any[]>([]);

  useEffect(() => {
    // Generate next 7 days for schedule picker
    const days = [];
    const date = new Date();
    for (let i = 0; i < 9; i++) {
      date.setDate(date.getDate() + (i === 0 ? 1 : 1));
      if (date.getDay() !== 0) { // Skip Sundays
        days.push({
          fullDate: date.toISOString().split("T")[0],
          dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
          dateNum: date.getDate(),
          monthName: date.toLocaleDateString("en-US", { month: "short" }),
        });
      }
      if (days.length === 7) break;
    }
    setNextDays(days);
    if (days.length > 0) setScheduledDate(days[0].fullDate);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/client/candidates/${vaProfileId}/profile`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (vaProfileId) {
      fetchProfile();
    }
  }, [vaProfileId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div className="w-full max-w-4xl bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center shadow-2xl flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold">Loading VA profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "VA";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`w-full max-h-[90vh] bg-slate-50 border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-250 transition-all ${showScheduleForm || successMessage ? 'max-w-lg' : 'max-w-5xl'}`}>
        
        {/* Sticky Header with Actions (Only show for Profile View) */}
        {!showScheduleForm && !successMessage && (
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shrink-0">
            <h2 className="text-lg font-black text-slate-900">
              Candidate Profile
            </h2>
            <div className="flex items-center gap-3">
              {shortlistId && (
                <button 
                  onClick={() => setShowScheduleForm(true)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-xs cursor-pointer"
                >
                  <IconCalendar className="w-3.5 h-3.5" /> Schedule Interview
                </button>
              )}
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none relative bg-white">
          
          {showScheduleForm ? (
            <div className="w-full animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#E84E29] mx-auto mb-3">
                <IconCalendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 text-center tracking-tight mb-1">Schedule Interview</h3>
              <p className="text-slate-500 text-center font-medium mb-6 text-sm">
                Set a date and time for your interview with {profile.fullName}.
              </p>

                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!scheduledDate || !scheduledTime || !meetingLink) return;
                    setIsSubmitting(true);
                    try {
                      // Combine date and time into ISO string
                      const combinedDateTime = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
                      const res = await fetch("/api/client/interviews/schedule", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          shortlistId,
                          meetingLink,
                          scheduledDate: combinedDateTime
                        })
                      });
                      if (res.ok) {
                        setSuccessMessage("Interview successfully scheduled!");
                        setShowScheduleForm(false);
                      } else {
                        alert("Failed to schedule interview. Please try again.");
                      }
                    } catch (error) {
                      console.error(error);
                      alert("An error occurred.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    {/* A. Calendar Day Picker */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select Date</label>
                      <div className="grid grid-cols-7 gap-1.5">
                        {nextDays.map((day) => {
                          const isActive = scheduledDate === day.fullDate;
                          return (
                            <button
                              key={day.fullDate}
                              type="button"
                              onClick={() => setScheduledDate(day.fullDate)}
                              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                                isActive 
                                  ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                                  : "bg-white border-slate-200 text-slate-650 hover:border-slate-350 hover:bg-slate-50/50"
                              }`}
                            >
                              <span className="text-[9px] font-extrabold uppercase tracking-wide opacity-60">{day.dayName}</span>
                              <span className="text-sm font-black leading-none mt-0.5">{day.dateNum}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* B. Time Slot Picker */}
                    <div className="space-y-1.5 pt-4 border-t border-slate-100">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select Time (EST)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {TIME_SLOTS.map((slot) => {
                          const isActive = scheduledTime === slot.value;
                          return (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() => setScheduledTime(slot.value)}
                              className={`px-3 py-1.5 rounded-full border text-[11px] font-extrabold transition-all cursor-pointer ${
                                isActive 
                                  ? "bg-[#E84E29] border-[#E84E29] text-white shadow-sm" 
                                  : "bg-white border-slate-200 text-slate-650 hover:border-slate-300 hover:bg-slate-50/50"
                              }`}
                            >
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Meeting Link (GMeet, Zoom, etc.)</label>
                    <input 
                      type="url"
                      required
                      placeholder="https://meet.google.com/..."
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#E84E29] focus:ring-4 focus:ring-[#E84E29]/10 outline-none transition-all bg-slate-50 focus:bg-white font-medium"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-colors shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? "Scheduling..." : "Confirm & Schedule"}
                    </button>
                  </div>
                </form>
            </div>
          ) : successMessage ? (
            <div className="w-full py-8 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto mb-6">
                <IconCheck className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Scheduled!</h3>
              <p className="text-slate-500 font-medium mb-8">
                {successMessage} The VA has been notified, and it has been added to your Interviews page.
              </p>
              <button 
                onClick={() => {
                  onClose();
                  window.location.reload(); // Refresh to update dashboard lists
                }}
                className="px-8 py-3 rounded-full font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md"
              >
                Close & Refresh
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Header section similar to VAProfileHeader */}
            <PCard className="overflow-hidden p-0 relative">
              <div 
                className="h-40 bg-cover bg-center border-b border-slate-200 bg-black relative"
                style={{ backgroundImage: `url(${profile.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80"})` }}
              >
              </div>
              <div className="px-6 pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 relative">
                    <div className="relative shrink-0 z-10">
                      <div className="w-34 h-34 rounded-full border-4 border-white overflow-hidden shadow-md bg-slate-50 -mt-20">
                        {profile.avatar ? (
                          <img 
                            src={profile.avatar} 
                            alt={profile.fullName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="grid h-full w-full place-items-center bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-black text-white">
                            {initials}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="pt-5 sm:pt-0">
                      <h1 className="text-2xl font-black tracking-tight text-slate-900">{profile.fullName}</h1>
                      <p className="text-sm font-semibold text-slate-500">{profile.title} · {profile.experienceYears} yrs experience</p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-400">
                        <IconMapPin className="h-3.5 w-3.5 text-slate-400" /> {profile.location} · {profile.niche} niche
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected rate</span>
                  <span className="font-extrabold text-slate-900 text-base">${profile.expectedRate?.toFixed(2) || "0.00"}/hr</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded border border-amber-100">
                    <IconStar className="w-3.5 h-3.5" />
                    5.0 (No reviews yet)
                  </span>
                </div>
              </div>
            </PCard>

            {/* About Section */}
            <PCard>
              <PCardHeader title="About" />
              <p className="text-sm leading-relaxed text-slate-650 font-medium whitespace-pre-wrap">
                {profile.about || "This candidate hasn't added a summary yet."}
              </p>
            </PCard>

            {/* Featured / Portfolio Section */}
            <PCard>
              <PCardHeader title="Featured / portfolio" />
              {!profile.portfolio || profile.portfolio.length === 0 ? (
                <p className="text-xs text-slate-400 font-semibold italic">No portfolio items available.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {profile.portfolio.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-150 bg-slate-50/50 p-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white border border-slate-100 text-xl shadow-xs">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800 leading-tight">{item.title}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PCard>

            {/* Experience Section */}
            <PCard>
              <PCardHeader title="Experience" />
              {!profile.experience || profile.experience.length === 0 ? (
                <p className="text-xs text-slate-400 font-semibold italic">No work experience listed yet.</p>
              ) : (
                <ul className="space-y-4">
                  {profile.experience.map((exp: any) => (
                    <li key={exp.id} className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 border border-orange-100 text-[#E84E29]">
                        <IconBriefcase className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">{exp.role}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-1">{exp.company}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{exp.period}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </PCard>

            {/* Skills Section */}
            <PCard>
              <PCardHeader title="Skills" />
              <div className="flex flex-wrap gap-2">
                {!profile.skills || profile.skills.length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold italic">No skills listed.</p>
                ) : (
                  profile.skills.map((s: string) => (
                    <Badge key={s} variant="default" className="rounded-full font-bold">
                      {s}
                    </Badge>
                  ))
                )}
              </div>
            </PCard>

            {/* Tools Section */}
            <PCard>
              <PCardHeader title="Tools & platforms" />
              <div className="flex flex-wrap gap-2">
                {!profile.tools || profile.tools.length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold italic">No tools listed.</p>
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

            {/* Availability Section */}
            <PCard>
              <PCardHeader title="Availability" />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-4 w-4 text-[#E84E29]" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours</span>
                  </div>
                  <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability?.hours || "N/A"}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <IconBriefcase className="h-4 w-4 text-[#E84E29]" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule</span>
                  </div>
                  <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability?.schedule || "N/A"}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <IconMapPin className="h-4 w-4 text-[#E84E29]" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time zone</span>
                  </div>
                  <p className="mt-1.5 text-sm font-extrabold text-slate-800">{profile.availability?.timezone || "N/A"}</p>
                </div>
              </div>
            </PCard>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
