"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormHeader from "../../../../components/layout/FormHeader";
import PhoneInput from "../../../../components/forms/PhoneInput";
import { getExpectedPhoneDigits } from "../../../../lib/countryCodes";

const steps = [
  { num: 1, label: "Sign Up" },
  { num: 2, label: "Choose niche" },
  { num: 3, label: "Assessment" },
  { num: 4, label: "Requirements" },
  { num: 5, label: "Payment" },
  { num: 6, label: "Interview" },
  { num: 7, label: "Get approved" },
];

const nichesList = [
  "General Admin VA",
  "Executive Assistant",
  "Customer Support",
  "Social Media Manager",
  "Content Writer",
  "Graphic Design",
  "Video Editing",
  "Book keeping",
  "Real Estate VA",
  "E-commerce / Shopify",
  "Lead Generation",
  "SEO & Marketing"
];

const toolsList = [
  "Slack",
  "Asana",
  "Trello",
  "Notion",
  "Canva",
  "G Suite (Docs, Sheets, etc.)",
  "HubSpot",
  "Zapier",
  "QuickBooks",
  "Shopify"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    // Step 1: Account
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    // Step 2: Niche
    niches: [] as string[],
    experience: "",
    expectedRate: "",
    // Step 3: Assessment
    ans1: "",
    ans2: "",
    ans3: "",
    // Step 4: Documents (file names/urls)
    resumeUrl: "",
    nbiUrl: "",
    idUrl: "",
    addressUrl: "",
    // Step 5: Payment
    paymentMethod: "",
    accountName: "",
    accountDetails: "",
    // Step 6: Interview
    interviewDate: "",
    interviewTime: ""
  });

  // Phone country selection state
  const [selectedCountry, setSelectedCountry] = useState({ code: "+1", name: "United States", flag: "🇺🇸" });

  // Skills
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // Local file loading simulation
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    resume: null,
    id: null,
    nbi: null,
    police: null,
    speed: null
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const toggleNiche = (niche: string) => {
    setFormData((prev) => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter((n) => n !== niche)
        : [...prev.niches, niche]
    }));
  };

  const isCurrentStepComplete = () => {
    if (currentStep === 1) {
      return (
        !!formData.fullName.trim() &&
        !!formData.email.trim() &&
        !!formData.password &&
        !!formData.confirmPassword &&
        !!formData.phone.trim()
      );
    }
    if (currentStep === 2) {
      return (
        formData.niches.length > 0 &&
        !!formData.experience &&
        !!formData.expectedRate
      );
    }
    if (currentStep === 3) {
      return (
        !!formData.ans1.trim() &&
        !!formData.ans2.trim() &&
        !!formData.ans3.trim()
      );
    }
    if (currentStep === 4) {
      return !!files.resume && !!files.id && !!files.nbi && !!files.police && !!files.speed;
    }
    if (currentStep === 5) {
      return (
        !!formData.paymentMethod &&
        !!formData.accountName.trim() &&
        !!formData.accountDetails.trim()
      );
    }
    if (currentStep === 6) {
      return !!formData.interviewDate && !!formData.interviewTime;
    }
    return true;
  };

  const nextStep = () => {
    setErrorMsg("");
    // Validate current step
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
        setErrorMsg("Please fill out all registration fields.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      if (formData.password.length < 8) {
        setErrorMsg("Password must be at least 8 characters long.");
        return;
      }
      if (!/[A-Z]/.test(formData.password)) {
        setErrorMsg("Password must contain at least one uppercase letter (A-Z).");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      const phoneDigits = formData.phone.replace(/\D/g, "");
      const expected = getExpectedPhoneDigits(selectedCountry.code);
      if (phoneDigits.length < expected.min || phoneDigits.length > expected.max) {
        setErrorMsg(`Please enter a valid phone number for ${selectedCountry.name}. Expected format: ${expected.patternLabel}`);
        return;
      }
    } else if (currentStep === 2) {
      if (formData.niches.length === 0 || !formData.experience || !formData.expectedRate) {
        setErrorMsg("Please select at least one niche, and fill out your experience and expected rate.");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.ans1 || !formData.ans2 || !formData.ans3) {
        setErrorMsg("Please answer all assessment questions.");
        return;
      }
    } else if (currentStep === 4) {
      if (!files.resume || !files.id || !files.nbi || !files.police || !files.speed) {
        setErrorMsg("All five onboarding documents are required uploads.");
        return;
      }
    } else if (currentStep === 5) {
      if (!formData.paymentMethod || !formData.accountName || !formData.accountDetails) {
        setErrorMsg("Please provide your payment/payout information.");
        return;
      }
    } else if (currentStep === 6) {
      if (!formData.interviewDate || !formData.interviewTime) {
        setErrorMsg("Please select an interview date and time slot.");
        return;
      }
      // Submit final data
      submitOnboarding();
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const submitOnboarding = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Simulate file upload or send via Base64.
      // To keep backend robust, we'll create FormData
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", `${selectedCountry.code} ${formData.phone}`);
      data.append("niches", JSON.stringify(formData.niches));
      data.append("experience", formData.experience);
      data.append("expectedRate", formData.expectedRate);
      data.append("tools", JSON.stringify(selectedTools));
      data.append("ans1", formData.ans1);
      data.append("ans2", formData.ans2);
      data.append("ans3", formData.ans3);
      data.append("paymentMethod", formData.paymentMethod);
      data.append("accountName", formData.accountName);
      data.append("accountDetails", formData.accountDetails);
      data.append("interviewDate", formData.interviewDate);
      data.append("interviewTime", formData.interviewTime);

      // Append files
      if (files.resume) data.append("resume", files.resume);
      if (files.id) data.append("id", files.id);
      if (files.nbi) data.append("nbi", files.nbi);
      if (files.police) data.append("police", files.police);
      if (files.speed) data.append("speed", files.speed);

      const response = await fetch("/api/onboarding", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        setCurrentStep(7);
      } else {
        setErrorMsg(result.error || "Failed to submit onboarding application.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen flex flex-col items-center pb-20">
      {/* Dark Top Banner */}
      <div className="w-screen bg-[#000312] bg-[linear-gradient(93deg,#000312_55%,#021959_100%)] flex flex-col items-center px-6 md:px-0 py-6 border-b border-white/5">
        <div className="w-full max-w-5xl flex flex-col justify-center">
          <FormHeader />
        </div>
      </div>

      {/* Onboarding Wizard Card Container */}
      <div className="w-full max-w-4xl px-4 md:px-0 mt-10 flex flex-col items-center">
        
        {/* Step Progress bar (hide on success step 7) */}
        {currentStep < 7 && (
          <div className="w-full max-w-3xl mb-12">
            {/* Step info row from picture */}
            <div className="flex items-center justify-between text-gray-900 text-sm font-semibold mb-2 px-1">
              <span>Step {currentStep} of 7 — {steps[currentStep - 1].label}</span>
              <span className="text-gray-500 font-normal">{Math.round((currentStep / 7) * 100)}% complete</span>
            </div>

            {/* Sleek top progress bar from picture */}
            <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 mb-8 overflow-hidden">
              <div 
                className="bg-[#000829] h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(currentStep / 7) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between relative mt-6">
              {/* Connector line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#000829]/30 transition-all duration-300 z-0" 
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>

              {steps.map((s) => {
                const isActive = s.num === currentStep;
                const isCompleted = s.num < currentStep;
                const isStepDone = isCompleted || (isActive && isCurrentStepComplete());
                return (
                  <div key={s.num} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2 ${
                        isStepDone
                          ? `border-orange-500 bg-orange-500 text-white ${isActive ? "ring-4 ring-orange-500/25" : ""}`
                          : isActive
                          ? "border-[#000829] text-[#000829] bg-white ring-4 ring-[#000829]/10"
                          : "border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      {isStepDone ? (
                        <svg className="w-4.5 h-4.5 stroke-current" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s.num
                      )}
                    </div>
                    <span 
                      className={`text-[10px] mt-2 font-semibold absolute top-10 whitespace-nowrap ${
                        isActive ? "text-[#000829] font-bold" : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="w-full bg-white border border-gray-200/80 rounded-3xl p-6 md:p-10 shadow-sm text-gray-900 mt-6 min-h-[400px] flex flex-col justify-between">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Wizard step renderer */}
          <div className="flex-grow">
            
            {/* STEP 1: Account Creation */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">Create your VA account</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your personal details to set up your applicant workspace.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="Create a strong password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <PhoneInput
                    value={formData.phone}
                    onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Niche & Skills */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">Select your Niche & Tools</h2>
                <p className="text-gray-500 text-sm mb-6">Tell us about your background, specializations, and expected hourly rate.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Years of Experience</label>
                    <div className="relative">
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      >
                        <option value="">Select experience</option>
                        <option value="entry">Entry Level (No experience)</option>
                        <option value="junior">Junior (1-2 years)</option>
                        <option value="intermediate">Intermediate (3-5 years)</option>
                        <option value="expert">Senior / Expert (5+ years)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Expected Hourly Rate (USD)</label>
                    <input
                      type="number"
                      name="expectedRate"
                      value={formData.expectedRate}
                      onChange={handleInputChange}
                      min="3"
                      max="50"
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="e.g. $8 / hr"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Select your Niches (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {nichesList.map((n) => {
                      const isSelected = formData.niches.includes(n);
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => toggleNiche(n)}
                          className={`flex items-center text-left rounded-xl border p-3.5 transition-all text-sm font-medium ${
                            isSelected
                              ? "border-orange-400 bg-orange-50/50 text-orange-950"
                              : "border-gray-200 bg-white hover:border-orange-300 text-gray-800"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border-2 transition-all shrink-0 ${
                              isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                            )}
                          </div>
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-2">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Select the Tools you specialize in (Optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {toolsList.map((tool) => {
                      const isSelected = selectedTools.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleTool(tool)}
                          className={`flex items-center text-left rounded-xl border p-3.5 transition-all text-sm font-medium ${
                            isSelected
                              ? "border-orange-400 bg-orange-50/50 text-orange-950"
                              : "border-gray-200 bg-white hover:border-orange-300 text-gray-800"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border-2 transition-all ${
                              isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                            )}
                          </div>
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Assessment */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">VA Skills Assessment</h2>
                <p className="text-gray-500 text-sm mb-6">Answer the following questions to verify your communication and role suitability.</p>

                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block leading-relaxed">
                      1. A client emails you stating that their meeting link is broken right as a meeting is starting. How do you handle this?
                    </label>
                    <textarea
                      name="ans1"
                      value={formData.ans1}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                      placeholder="Write your email response or action steps..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block leading-relaxed">
                      2. How do you prioritize tasks when you have three urgent requests from different clients due at the same time?
                    </label>
                    <textarea
                      name="ans2"
                      value={formData.ans2}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                      placeholder="Explain your task management strategy..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block leading-relaxed">
                      3. Which tool do you prefer for tracking calendar schedules and tasks? Why?
                    </label>
                    <textarea
                      name="ans3"
                      value={formData.ans3}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                      placeholder="Share your preference and brief reasoning..."
                    />
                  </div>
                </div>
              </div>
            )}

             {/* STEP 4: Requirements Upload */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">Upload onboarding documents</h2>
                <p className="text-gray-500 text-sm mb-6">Attach your files to finish verification faster. PDF or Image files only.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resume */}
                  <div className="border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col bg-gray-50/50 justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">Resume / CV (Required)</h4>
                      <p className="text-xs text-gray-400 mb-4">Latest resume showing contact info and experiences.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="file-resume"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, "resume")}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-resume"
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-950 cursor-pointer transition-all shadow-2xs"
                      >
                        Choose file
                      </label>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {files.resume ? files.resume.name : "No file selected"}
                      </span>
                    </div>
                  </div>

                  {/* ID */}
                  <div className="border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col bg-gray-50/50 justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">Government-Issued ID (Required)</h4>
                      <p className="text-xs text-gray-400 mb-4">Valid Passport, Driver's License, or State ID card.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="file-id"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, "id")}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-id"
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-950 cursor-pointer transition-all shadow-2xs"
                      >
                        Choose file
                      </label>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {files.id ? files.id.name : "No file selected"}
                      </span>
                    </div>
                  </div>

                  {/* NBI Clearance */}
                  <div className="border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col bg-gray-50/50 justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">NBI Clearance (Required)</h4>
                      <p className="text-xs text-gray-400 mb-4">Official background check document from the NBI.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="file-nbi"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, "nbi")}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-nbi"
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-950 cursor-pointer transition-all shadow-2xs"
                      >
                        Choose file
                      </label>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {files.nbi ? files.nbi.name : "No file selected"}
                      </span>
                    </div>
                  </div>

                  {/* Police Clearance */}
                  <div className="border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col bg-gray-50/50 justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">Police Clearance (Required)</h4>
                      <p className="text-xs text-gray-400 mb-4">Local police clearance or background check cert.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="file-police"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, "police")}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-police"
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-950 cursor-pointer transition-all shadow-2xs"
                      >
                        Choose file
                      </label>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {files.police ? files.police.name : "No file selected"}
                      </span>
                    </div>
                  </div>

                  {/* Internet Speed Screenshot */}
                  <div className="border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col bg-gray-50/50 justify-between md:col-span-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">Internet Speed Screenshot (Required)</h4>
                      <p className="text-xs text-gray-400 mb-4">Screenshot of your speedtest result showing download/upload speeds and ping.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="file-speed"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, "speed")}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-speed"
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-950 cursor-pointer transition-all shadow-2xs"
                      >
                        Choose file
                      </label>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {files.speed ? files.speed.name : "No file selected"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Payment Setup */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">Setup payout details</h2>
                <p className="text-gray-500 text-sm mb-6">Select your preferred payout method to receive timely and secure payments.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Payout Method</label>
                    <div className="relative">
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      >
                        <option value="">Select payout method</option>
                        <option value="Wise">Wise (Recommended)</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Direct Bank Transfer</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Account / Holder Name</label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Account Details (Email / Number)</label>
                    <input
                      type="text"
                      name="accountDetails"
                      value={formData.accountDetails}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="Email for Wise/PayPal or Bank Account info"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Schedule Interview */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-950 mb-1">Schedule your Interview</h2>
                <p className="text-gray-500 text-sm mb-6">Select a convenient date and 30-minute time slot for your Zoom video interview.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Choose Date</label>
                    <input
                      type="date"
                      name="interviewDate"
                      value={formData.interviewDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Available Time Slots</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["09:00 AM", "10:30 AM", "01:30 PM", "03:00 PM", "04:30 PM"].map((slot) => {
                        const isSelected = formData.interviewTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, interviewTime: slot }))}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all text-center cursor-pointer ${
                              isSelected
                                ? "border-orange-500 bg-orange-50 text-orange-950 font-semibold"
                                : "border-gray-200 bg-white hover:border-orange-300 text-gray-700"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Success Page */}
            {currentStep === 7 && (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Onboarding Submitted!</h2>
                <p className="text-gray-500 mt-3 text-base max-w-lg leading-relaxed">
                  Thank you, <strong className="text-gray-900">{formData.fullName}</strong>. Your account has been registered, and your skills assessment and uploaded documents are now under review.
                </p>

                <div className="bg-[#FAF6F0] border border-gray-200/80 rounded-3xl p-6 mt-8 max-w-md w-full shadow-2xs">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Your Interview Schedule</h4>
                  <div className="flex items-center justify-center gap-3 text-orange-600 font-semibold text-lg">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {formData.interviewDate} at {formData.interviewTime}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    A Zoom invitation link and confirmation calendar event has been dispatched to <span className="text-gray-700 font-medium">{formData.email}</span>. Please have a stable internet connection ready.
                  </p>
                </div>

                <Link
                  href="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all mt-10 cursor-pointer inline-flex items-center gap-2"
                >
                  Go to dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}

          </div>

          {/* Footer Controls (hide on success step 7) */}
          {currentStep < 7 && (
            <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer ${
                  currentStep === 1 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                disabled={loading || !isCurrentStepComplete()}
                className={`rounded-xl px-6 py-2.5 font-semibold flex items-center gap-1.5 transition-all ${
                  loading || !isCurrentStepComplete()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : currentStep === 6 ? (
                  <>
                    Complete Application
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
