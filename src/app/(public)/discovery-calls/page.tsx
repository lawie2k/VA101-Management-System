"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FormHeader from "../../../components/layout/FormHeader";
import PhoneInput from "../../../components/forms/PhoneInput";

// ==========================================
// 1. Inline SVG Icons
// ==========================================

const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconVideo = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const IconUser = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconBriefcase = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const IconGlobe = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
];

const INDUSTRIES = [
  "Real Estate",
  "E-commerce",
  "Software & SaaS",
  "Digital Marketing Agency",
  "Healthcare & Wellness",
  "Finance & Insurance",
  "Professional Services",
  "Other",
];

const COMPANY_SIZES = [
  "1-5 employees (Solo/Boutique)",
  "6-20 employees (Small team)",
  "21-100 employees (Medium/Growth)",
  "101+ employees (Enterprise)",
];

export default function DiscoveryCallsPage() {
  const [session, setSession] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Selected Country for phone prefix input
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    name: "United States",
    flag: "🇺🇸"
  });

  // Custom industry text when 'Other' is selected
  const [customIndustry, setCustomIndustry] = useState("");

  // Scheduling states
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Input states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
    phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<any>(null);

  // Generate the next 7 available days (excluding Sundays)
  const getNextDays = () => {
    const days = [];
    const date = new Date();
    // Start generating from tomorrow
    for (let i = 0; i < 9; i++) {
      date.setDate(date.getDate() + (i === 0 ? 1 : 1));
      if (date.getDay() !== 0) {
        // Skip Sundays
        days.push({
          fullDate: date.toISOString().split("T")[0],
          dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
          dateNum: date.getDate(),
          monthName: date.toLocaleDateString("en-US", { month: "short" }),
        });
      }
      if (days.length === 7) break;
    }
    return days;
  };

  const nextDays = getNextDays();

  // Load session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.authenticated && data.user) {
          setSession(data.user);
          setFormData((prev) => ({
            ...prev,
            fullName: data.user.fullName || "",
            email: data.user.email || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadSession();
    // Default to the first generated date
    if (nextDays.length > 0) {
      setSelectedDate(nextDays[0].fullDate);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time slot for your call.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/discovery-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: `${selectedCountry.code} ${formData.phone}`,
          requestedDate: selectedDate,
          requestedTime: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book discovery call. Please try again.");
      }

      setBookedDetails({
        date: selectedDate,
        time: selectedTime,
        fullName: session ? session.fullName : formData.fullName,
        companyName: formData.companyName,
        meetingLink: "meet.google.com/cvy-uqns-pxo",
        host: "Erika Santos — Lead Success Partner",
      });

      setIsBooked(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E84E29]"></div>
      </div>
    );
  }

  // Format date display for receipt
  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const isFormValid = !!(
    selectedDate &&
    selectedTime &&
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.companyName.trim() &&
    formData.phone.trim() &&
    formData.companySize.trim() &&
    (formData.industry !== "Other" ? formData.industry.trim() : customIndustry.trim())
  );

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      {/* Top Header Section */}
      <div className="w-full flex flex-col items-center mb-8">
        <FormHeader />
      </div>

      {/* Back Button */}
      <div className="mb-6 flex justify-start mt-20">
        <Link 
          href="/client/dashboard" 
          className="inline-flex items-center gap-1.5 px-4.5 py-2 border border-slate-200 hover:border-slate-350 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* ==========================================
          HEADER TITLE BLOCK
          ========================================== */}
      <div className="text-center mb-8 mt-6">
      
        <h1 className="mt-3 text-3xl font-black text-slate-900 tracking-tight">Book your VA Discovery Call</h1>
        <p className="mt-2 text-slate-500 max-w-md mx-auto text-sm font-medium">
          Schedule a 15-minute consultation with our team to discuss your business requirements and match you with the perfect virtual assistant.
        </p>
      </div>

      {/* ==========================================
          BOOKING CONFIRMATION SCREEN
          ========================================== */}
      {isBooked ? (
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md animate-in fade-in zoom-in-95 duration-300">
          <div className="h-3 bg-gradient-to-r from-orange-500 via-[#E84E29] to-amber-500" />
          <div className="p-8 text-center">
            
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4 shadow-sm">
              <IconCheckCircle className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Discovery Call Requested!</h2>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              We have received your booking. A confirmation link has been sent to your email.
            </p>

            {/* Ticket details */}
            <div className="mt-6 border border-slate-100 rounded-2xl bg-slate-50/50 p-5 text-left space-y-4">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-white border border-slate-100 rounded-lg text-slate-500">
                  <IconCalendar className="w-4 h-4 text-orange-500" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Scheduled Date</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{formatFriendlyDate(bookedDetails.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2 bg-white border border-slate-100 rounded-lg text-slate-500">
                  <IconClock className="w-4 h-4 text-orange-500" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Time & Timezone</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                    {TIME_SLOTS.find(t => t.value === bookedDetails.time)?.label || bookedDetails.time} (EST / UTC-5)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2 bg-white border border-slate-100 rounded-lg text-slate-500">
                  <IconUser className="w-4 h-4 text-orange-500" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Assigned Host</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{bookedDetails.host}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <span className="p-2 bg-white border border-slate-100 rounded-lg text-slate-500">
                  <IconVideo className="w-4 h-4 text-[#E84E29]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Google Meet Link</p>
                  <a 
                    href={`https://${bookedDetails.meetingLink}`} 
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs font-extrabold text-[#E84E29] hover:text-[#DA431E] truncate hover:underline mt-0.5"
                  >
                    {bookedDetails.meetingLink}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
              <button 
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                onClick={() => {
                  alert("Google Calendar integration placeholder: Calendar event added!");
                }}
              >
                📅 Add to Google Calendar
              </button>
              {session ? (
                <Link 
                  href="/client/dashboard" 
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm text-center"
                >
                  Return to Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm text-center"
                >
                  Sign In to Check Progress
                </Link>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* ==========================================
            BOOKING FORM & SELECTION INTERFACE
            ========================================== */
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          
          <div className="bg-black text-white p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Step 1 of 2</h3>
              <h2 className="text-lg font-black mt-1 leading-tight">Choose Date & Time</h2>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Available Slots</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-xs font-semibold text-red-700 rounded-lg animate-fade-in">
                {error}
              </div>
            )}

            {/* A. Calendar Day Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Date</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {nextDays.map((day) => {
                  const isActive = selectedDate === day.fullDate;
                  return (
                    <button
                      key={day.fullDate}
                      type="button"
                      onClick={() => setSelectedDate(day.fullDate)}
                      className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                        isActive 
                          ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                          : "bg-white border-slate-200 text-slate-650 hover:border-slate-350 hover:bg-slate-50/50"
                      }`}
                    >
                      <span className="text-[10px] font-extrabold uppercase tracking-wide opacity-60">{day.dayName}</span>
                      <span className="text-base font-black leading-none mt-1">{day.dateNum}</span>
                      <span className="text-[9px] font-bold mt-1 opacity-70">{day.monthName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. Time Slot Picker */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Time (EST Timezone)</label>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isActive = selectedTime === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setSelectedTime(slot.value)}
                      className={`px-4.5 py-2.5 rounded-full border text-xs font-extrabold transition-all cursor-pointer ${
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

            {/* C. Input Information */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight mb-4">Client Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    disabled={!!session}
                    value={formData.fullName} 
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    disabled={!!session}
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="e.g. john@example.com"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                  <input 
                    type="text" 
                    name="companyName"
                    required
                    value={formData.companyName} 
                    onChange={handleInputChange}
                    placeholder="e.g. Acmo Logistics Inc."
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Website</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-xs font-bold text-slate-450"><IconGlobe className="w-4 h-4 text-slate-400" /></span>
                    <input 
                      type="url" 
                      name="website"
                      value={formData.website} 
                      onChange={handleInputChange}
                      placeholder="e.g. https://company.com"
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</label>
                  <select
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold text-slate-700"
                  >
                    <option value="">Select industry...</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>

                  {formData.industry === "Other" && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 text-orange-600">Please specify your industry</label>
                      <input 
                        type="text"
                        required
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder="e.g. Artificial Intelligence, Real Estate Investing"
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold text-slate-700"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Size</label>
                  <select
                    name="companySize"
                    required
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold text-slate-700"
                  >
                    <option value="">Select size...</option>
                    {COMPANY_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <PhoneInput 
                  value={formData.phone}
                  onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  label="Contact Phone Number"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">What kind of VA are you looking for? / Requirements</label>
                <textarea 
                  name="notes"
                  rows={4}
                  value={formData.notes} 
                  onChange={handleInputChange}
                  placeholder="Tell us about the roles, schedule, and key skills you need from your Virtual Assistant..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-700 leading-relaxed resize-none"
                />
              </div>

            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <p className="text-[10px] text-slate-400 font-bold max-w-sm">
                By booking, you agree to receive email invitations and meeting confirmations for your discovery call.
              </p>
              <button 
                type="submit"
                disabled={loading || !isFormValid}
                className="px-6 py-3 shrink-0 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-md cursor-pointer disabled:bg-slate-200 disabled:text-slate-450 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? "Scheduling Call..." : "Confirm & Book Call"}
              </button>
            </div>

          </form>
        </div>
      )}

    </main>
  );
}
