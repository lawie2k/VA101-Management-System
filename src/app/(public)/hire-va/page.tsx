"use client";

import { useState } from "react";
import PhoneInput from "../../../components/forms/PhoneInput";
import FormHeader from "../../../components/layout/FormHeader";
import { getExpectedPhoneDigits } from "../../../lib/countryCodes";

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
    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      const expected = getExpectedPhoneDigits(selectedCountry.code);
      if (phoneDigits.length < expected.min || phoneDigits.length > expected.max) {
        alert(`Please enter a valid phone number for ${selectedCountry.name}. Expected format: ${expected.patternLabel}`);
        return;
      }
    }
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
      <div className="w-screen h-60 bg-[#000312] bg-[linear-gradient(93deg,#000312_55%,#021959_100%)] flex flex-col items-center justify-center px-6 md:px-0">
        {/*header*/}
        <div className="w-full max-w-5xl flex flex-col justify-center">
          <FormHeader />
          <div className="mt-5">
            <h1 className="text-white text-4xl font-semibold py-2">Hire a vetted virtual assistant</h1>
            <p className="text-gray-400">
              Share what you need help with and we&#39;ll hand-match you with a VA from our talent pool. Most clients get a shortlist within 48 hours.
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
                      <PhoneInput
                        value={formData.phone}
                        onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                        selectedCountry={selectedCountry}
                        onCountryChange={setSelectedCountry}
                        label="Phone (optional)"
                        placeholder="(555) 123-4567"
                      />
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
