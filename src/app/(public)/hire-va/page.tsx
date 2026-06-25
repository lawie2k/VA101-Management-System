"use client";

import { useState } from "react";
import { popularDialCodes, countryDialCodes } from "../../../lib/countryCodes";

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

export default function Page() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    workEmail: "",
    phone: "",
    companyWebsite: "",
    companySize: "",
    roleType: "",
    hoursPerWeek: "",
    startDate: "",
    monthlyBudget: "",
    timezone: "",
    englishLevel: "",
    tasks: "",
    agreeToContact: false
  });

  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState({ code: "+1", name: "United States", flag: "🇺🇸" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const toggleAgree = () => {
    setFormData((prev) => ({
      ...prev,
      agreeToContact: !prev.agreeToContact
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone ? `${selectedCountry.code} ${formData.phone}` : "",
          preferredTools: selectedTools,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Thank you! Your inquiry has been submitted successfully.");
        setFormData({
          fullName: "",
          company: "",
          workEmail: "",
          phone: "",
          companyWebsite: "",
          companySize: "",
          roleType: "",
          hoursPerWeek: "",
          startDate: "",
          monthlyBudget: "",
          timezone: "",
          englishLevel: "",
          tasks: "",
          agreeToContact: false,
        });
        setSelectedTools([]);
        setSelectedCountry({ code: "+1", name: "United States", flag: "🇺🇸" });
      } else {
        alert("Failed to submit inquiry: " + result.error);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center pb-12">
      <div className="w-screen h-60 bg-[#191940] flex flex-col items-center justify-center px-6 md:px-0">
        <div className="w-full max-w-3xl flex flex-col justify-center">
          <div className="flex items-center justify-between w-full">
            <img src="/logo/VA101%20logo1.svg" alt="logo" className="w-50 h-20" />
            <a 
              href="https://www.virtualassistant101.com/" 
              className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-all"
            >
              Back to main site
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="mt-5">
            <h1 className="text-white text-4xl font-semibold py-2">Hire a vetted virtual assistant</h1>
            <p className="text-gray-400">
              Share what you need help with and we&#39;ll hand-match you with a VA from our talent pool. Most clients <br /> get a shortlist within 48 hours.
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Container Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 w-full max-w-3xl shadow-sm text-gray-900 mt-8"
      >
              {/* SECTION 1: Your details */}
              <div>
                  <h2 className="text-xl font-bold mb-6 text-gray-900">Your details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full name</label>
                          <input
                              type="text"
                              name="fullName"
                              required
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              placeholder="e.g. John Doe"
                          />
                      </div>
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Company</label>
                          <input
                              type="text"
                              name="company"
                              required
                              value={formData.company}
                              onChange={handleInputChange}
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              placeholder="e.g. Acme Corp"
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Work email</label>
                          <input
                              type="email"
                              name="workEmail"
                              required
                              value={formData.workEmail}
                              onChange={handleInputChange}
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              placeholder="e.g. john@example.com"
                          />
                      </div>
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone (optional)</label>
                          <div className="flex gap-2">
                              <div className="relative shrink-0 w-32">
                                  {/* Trigger Button */}
                                  <button
                                      type="button"
                                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                      className="w-full flex items-center justify-between border border-gray-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs text-left cursor-pointer"
                                  >
                                      <span className="truncate">
                                          {selectedCountry.flag} {selectedCountry.code}
                                      </span>
                                      <svg
                                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                                              isDropdownOpen ? "rotate-180" : ""
                                          }`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                      >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                  </button>

                                  {/* Dropdown Menu */}
                                  {isDropdownOpen && (
                                      <>
                                          {/* Invisible backdrop to close the dropdown */}
                                          <div
                                              className="fixed inset-0 z-40 cursor-default"
                                              onClick={() => setIsDropdownOpen(false)}
                                          />
                                          <div className="absolute left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col">
                                              {/* Search Input */}
                                              <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                                                  <input
                                                      type="text"
                                                      value={searchQuery}
                                                      onChange={(e) => setSearchQuery(e.target.value)}
                                                      placeholder="Search country or code..."
                                                      className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-gray-900"
                                                  />
                                              </div>

                                              {/* List of Countries - Fixed Height scrollable box */}
                                              <div className="overflow-y-auto max-h-48 divide-y divide-gray-50">
                                                  {/* Popular group (only show when not searching) */}
                                                  {searchQuery === "" && (
                                                      <div>
                                                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                                              Popular
                                                          </div>
                                                          {popularDialCodes.map((country, idx) => (
                                                              <button
                                                                  key={`pop-${idx}`}
                                                                  type="button"
                                                                  onClick={() => {
                                                                      setSelectedCountry(country);
                                                                      setIsDropdownOpen(false);
                                                                  }}
                                                                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-all hover:bg-orange-50/50 ${
                                                                      selectedCountry.code === country.code && selectedCountry.name === country.name
                                                                          ? "bg-orange-50 font-semibold text-orange-950"
                                                                          : "text-gray-700 hover:text-gray-900"
                                                                  }`}
                                                              >
                                                                  <span className="text-base">{country.flag}</span>
                                                                  <span className="font-medium shrink-0">{country.code}</span>
                                                                  <span className="text-xs text-gray-400 truncate">{country.name}</span>
                                                              </button>
                                                          ))}
                                                      </div>
                                                  )}

                                                  {/* All/Filtered list */}
                                                  <div>
                                                      {searchQuery === "" && (
                                                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                                              All Countries
                                                          </div>
                                                      )}
                                                      {(() => {
                                                          const filtered = countryDialCodes.filter(
                                                              (c) =>
                                                                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                                  c.code.includes(searchQuery)
                                                          );
                                                          if (filtered.length === 0) {
                                                              return (
                                                                  <div className="px-3 py-4 text-center text-xs text-gray-400">
                                                                      No results found
                                                                  </div>
                                                              );
                                                          }
                                                          return filtered.map((country, idx) => (
                                                              <button
                                                                  key={`all-${idx}`}
                                                                  type="button"
                                                                  onClick={() => {
                                                                      setSelectedCountry(country);
                                                                      setIsDropdownOpen(false);
                                                                      setSearchQuery("");
                                                                  }}
                                                                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-all hover:bg-orange-50/50 ${
                                                                      selectedCountry.code === country.code && selectedCountry.name === country.name
                                                                          ? "bg-orange-50 font-semibold text-orange-950"
                                                                          : "text-gray-700 hover:text-gray-900"
                                                                  }`}
                                                              >
                                                                  <span className="text-base">{country.flag}</span>
                                                                  <span className="font-medium shrink-0">{country.code}</span>
                                                                  <span className="text-xs text-gray-400 truncate">{country.name}</span>
                                                              </button>
                                                          ));
                                                      })()}
                                                  </div>
                                              </div>
                                          </div>
                                      </>
                                  )}
                              </div>
                              <input
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                                  placeholder="(555) 123-4567"
                              />
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Company website</label>
                          <input
                              type="text"
                              name="companyWebsite"
                              value={formData.companyWebsite}
                              onChange={handleInputChange}
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              placeholder="e.g. https://acme.com"
                          />
                      </div>
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Company size</label>
                          <div className="relative">
                              <select
                                  name="companySize"
                                  value={formData.companySize}
                                  onChange={handleInputChange}
                                  className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              >
                                  <option value="">Select company size</option>
                                  <option value="1-10">1-10 employees</option>
                                  <option value="11-50">11-50 employees</option>
                                  <option value="51-200">51-200 employees</option>
                                  <option value="201-500">201-500 employees</option>
                                  <option value="500+">500+ employees</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* SECTION 2: What you need */}
              <div className="border-t border-gray-100 pt-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">What you need</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Role type</label>
                          <div className="relative">
                              <select
                                  name="roleType"
                                  required
                                  value={formData.roleType}
                                  onChange={handleInputChange}
                                  className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              >
                                  <option value="">Select role</option>
                                  <option value="General VA">General VA</option>
                                  <option value="Executive Assistant">Executive Assistant</option>
                                  <option value="Social Media Manager">Social Media Manager</option>
                                  <option value="Technical VA">Technical VA</option>
                                  <option value="Content Writer">Content Writer</option>
                                  <option value="Customer Support Rep">Customer Support Rep</option>
                                  <option value="Graphic Designer">Graphic Designer</option>
                                  <option value="Web Developer">Web Developer</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Hours per week</label>
                          <div className="relative">
                              <select
                                  name="hoursPerWeek"
                                  required
                                  value={formData.hoursPerWeek}
                                  onChange={handleInputChange}
                                  className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              >
                                  <option value="">Select hours per week</option>
                                  <option value="Part-time (20 hours)">Part-time (20 hours/week)</option>
                                  <option value="Full-time (40 hours)">Full-time (40 hours/week)</option>
                                  <option value="Flexible / As Needed">Flexible / As Needed</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Start date</label>
                          <div className="relative">
                              <select
                                  name="startDate"
                                  required
                                  value={formData.startDate}
                                  onChange={handleInputChange}
                                  className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              >
                                  <option value="">Select start date</option>
                                  <option value="Immediately">Immediately</option>
                                  <option value="1-2 weeks">Within 1-2 weeks</option>
                                  <option value="1 month">Within a month</option>
                                  <option value="exploring">Just exploring</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Monthly budget (USD)</label>
                          <div className="relative">
                              <select
                                  name="monthlyBudget"
                                  required
                                  value={formData.monthlyBudget}
                                  onChange={handleInputChange}
                                  className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              >
                                  <option value="">Select monthly budget</option>
                                  <option value="Under 500">Under $500/mo</option>
                                  <option value="500-1000">$500 - $1,000/mo</option>
                                  <option value="1000-2000">$1,000 - $2,000/mo</option>
                                  <option value="2000-3000">$2,000 - $3,000/mo</option>
                                  <option value="3000+">$3,000+/mo</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Your timezone</label>
                          <input
                              type="text"
                              name="timezone"
                              required
                              value={formData.timezone}
                              onChange={handleInputChange}
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              placeholder="e.g. EST, PST, GMT+1"
                          />
                      </div>
                      <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">English level required</label>
                          <div className="relative">
                              <select
                                  name="englishLevel"
                                  required
                                  value={formData.englishLevel}
                                  onChange={handleInputChange}
                                  className="w-full border border-gray-200 rounded-xl p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs"
                              >
                                  <option value="">Select English level</option>
                                  <option value="Fluent (C1/C2)">Fluent (Professional C1/C2)</option>
                                  <option value="Conversational (B1/B2)">Conversational (B1/B2)</option>
                                  <option value="Basic (A1/A2)">Basic (A1/A2)</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* SECTION 3: Preferred tools */}
              <div className="border-t border-gray-100 pt-8 mb-6">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Preferred tools (select all that apply)
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
                                          isSelected
                                              ? "border-orange-500 bg-orange-500 text-white"
                                              : "border-gray-300 bg-white"
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

              {/* SECTION 4: Tasks you'd like to delegate */}
              <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Tasks you&#39;d like to delegate
                  </label>
                  <textarea
                      name="tasks"
                      rows={4}
                      value={formData.tasks}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-xs resize-none"
                      placeholder="Describe the day-to-day tasks, projects, and goals you'd like your VA to own."
                  />
              </div>

              {/* SECTION 5: Policy acceptance box */}
              <button
                  type="button"
                  onClick={toggleAgree}
                  className={`w-full flex items-center text-left rounded-xl border p-4 mb-8 transition-all text-sm ${
                      formData.agreeToContact
                          ? "border-orange-400 bg-orange-50/50 text-orange-950"
                          : "border-gray-200 bg-white hover:border-orange-300 text-gray-800"
                  }`}
              >
                  <div
                      className={`w-5 h-5 rounded-full mr-3.5 flex items-center justify-center border-2 transition-all shrink-0 ${
                          formData.agreeToContact
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-gray-300 bg-white"
                      }`}
                  >
                      {formData.agreeToContact && (
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                      )}
                  </div>
                  <span className="font-medium">
            I agree to be contacted by the VA101 team about my inquiry and accept the <a href="https://www.virtualassistant101.com/p/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline" onClick={(e) => e.stopPropagation()}>privacy policy</a>.
          </span>
              </button>

              {/* SECTION 6: Buttons */}
              <div className="flex justify-end gap-3">
                  <a
                      href="https://www.virtualassistant101.com/"
                      className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 text-sm font-semibold transition-all inline-flex items-center justify-center text-center cursor-pointer"
                  >
                      Cancel
                  </a>
                  <button
                      type="submit"
                      disabled={!formData.agreeToContact}
                      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all flex items-center text-white ${
                          formData.agreeToContact
                              ? "bg-orange-500 hover:bg-orange-600 shadow-md cursor-pointer"
                              : "bg-gray-300 cursor-not-allowed opacity-50"
                      }`}
                  >
                      <svg
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                      >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      Request my VA match
                  </button>
              </div>
          </form>
  </div>
)
}
