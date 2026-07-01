"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ==========================================
// 1. Static Configuration / Mock Constants
// ==========================================

const ALL_NICHES = [
  "General VA",
  "Executive Support",
  "Real Estate",
  "E-commerce",
  "SaaS & Tech",
  "Healthcare",
  "Finance & Insurance",
  "Professional Services",
  "Digital Marketing",
  "Social Media",
  "E-learning",
  "Graphics & Video Services"
];

const ALL_SKILLS = [
  "Lead Generation",
  "Cold Calling",
  "Email Management",
  "Data Entry",
  "Social Media",
  "Scheduling",
  "Customer Support",
  "CRM Administration",
  "Canva Design",
  "Copywriting",
  "SEO Optimization",
  "Project Management"
];

const ALL_TOOLS = [
  "HubSpot",
  "Google Workspace",
  "Salesforce",
  "Slack",
  "Asana",
  "Trello",
  "Zoom",
  "Canva",
  "ActiveCampaign",
  "Mailchimp",
  "Zapier",
  "Airtable"
];

// ==========================================
// Helper Sub-Components
// ==========================================

function SplitRow({ label, value, tone }: { label: string; value: string; tone?: "green" | "orange" }) {
  const textColor = tone === "green" ? "text-emerald-600" : tone === "orange" ? "text-[#E84E29]" : "text-slate-800";
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs font-semibold">
      <span className="text-slate-500">{label}</span>
      <span className={`${textColor}`}>{value}</span>
    </div>
  );
}

// ==========================================
// Main PostJob Component
// ==========================================

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: "",
    roleNeeded: "",
    niche: ALL_NICHES[0],
    workDays: "",
    workHours: "",
    description: "",
    timezone: "",
  });

  const [rate, setRate] = useState<number | "">(12);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Split Calculations
  const vaRate = (Number(rate || 0) * 0.7).toFixed(2);
  const platformRate = (Number(rate || 0) * 0.3).toFixed(2);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Selection Toggles
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert states into the payload format expected by the API
    const payload = {
      jobTitle: formData.title,
      roleNeeded: formData.roleNeeded,
      jobDescription: formData.description,
      workSchedule: `${formData.workDays}${formData.workHours ? ", " + formData.workHours : ""}`,
      workShift: "flexible", // Hardcoded or omitted as this is mock
      timezone: formData.timezone,
      clientHourlyRate: rate,
      vaHourlyRate: Number(rate || 0) * 0.7, // Assuming 30% cut
      niche: formData.niche,
      skills: selectedSkills,
      tools: selectedTools,
    };

    try {
      const res = await fetch("/api/client/jobs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          router.push("/client/jobs");
        }, 2500);
      } else {
        const err = await res.json();
        alert(`Failed to post job: ${err.error}`);
        setLoading(false);
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post a New Job</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Job posts will go to the Admin panel for review and approval before becoming public in the marketplace.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-750 p-4 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Main Grid Layout Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        
        {/* Left Form Body */}
        <div className="space-y-6">
          
          {/* Main Info Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-900 mb-1.5">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input 
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Real Estate Lead Generation VA"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="roleNeeded" className="block text-xs font-bold text-slate-900 mb-1.5">
                Role Needed <span className="text-red-500">*</span>
              </label>
              <input 
                id="roleNeeded"
                name="roleNeeded"
                type="text"
                required
                placeholder="e.g. VA / EA / Bookkeeper / Social Media VA"
                value={formData.roleNeeded}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="niche" className="block text-xs font-bold text-slate-900 mb-1.5">
                  Core Specialty (Niche)
                </label>
                <select 
                  id="niche"
                  name="niche"
                  value={formData.niche}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all bg-white text-slate-800 font-medium"
                >
                  {ALL_NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="workDays" className="block text-xs font-bold text-slate-900 mb-1.5">
                  Work Days
                </label>
                <input 
                  id="workDays"
                  name="workDays"
                  type="text"
                  placeholder="e.g. Mon–Fri"
                  value={formData.workDays}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
                />
              </div>

              <div>
                <label htmlFor="workHours" className="block text-xs font-bold text-slate-900 mb-1.5">
                  Work Hours
                </label>
                <input 
                  id="workHours"
                  name="workHours"
                  type="text"
                  placeholder="e.g. 9am–1pm EST"
                  value={formData.workHours}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-slate-900 mb-1.5">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                id="description"
                name="description"
                required
                rows={6}
                placeholder="Describe the role responsibilities, deliverables, required background, and KPIs..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs resize-none"
              />
            </div>
          </div>

          {/* Skills & Tools Selection Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4.5 shadow-xs">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Required Skills</h4>
              <p className="text-[10px] text-slate-450 font-semibold mb-3">Select one or more skills desired for this position</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-[#E84E29] text-white border border-[#E84E29]" 
                          : "bg-white border border-slate-200 hover:border-slate-350 text-slate-700"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Required Tools</h4>
              <p className="text-[10px] text-slate-450 font-semibold mb-3">Select the core platforms the assistant must know</p>
              <div className="flex flex-wrap gap-2">
                {ALL_TOOLS.map((tool) => {
                  const isSelected = selectedTools.includes(tool);
                  return (
                    <button
                      type="button"
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-[#E84E29] text-white border border-[#E84E29]" 
                          : "bg-white border border-slate-200 hover:border-slate-350 text-slate-700"
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Right Pricing Widget & Instructions Sidebar */}
        <aside className="space-y-6">
          
          {/* Rate Split Splitter Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <div>
              <label htmlFor="rate" className="block text-xs font-bold text-slate-900 mb-1.5">
                Hourly Budget Rate (USD)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold text-sm">$</span>
                </div>
                <input 
                  id="rate"
                  type="number"
                  min={5}
                  max={100}
                  value={rate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRate(val === "" ? "" : Number(val));
                  }}
                  className="w-full border border-slate-200 rounded-xl py-3 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <SplitRow label="Client pays" value={`$${Number(rate || 0).toFixed(2)}/hr`} />
              <SplitRow label="VA payout (70%)" value={`$${vaRate}/hr`} tone="green" />
              <SplitRow label="Platform split (30%)" value={`$${platformRate}/hr`} tone="orange" />
            </div>
          </div>

          {/* Workflow/Next Steps Info Box */}
          <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/40 rounded-3xl p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Next Steps</h4>
            <ol className="list-decimal list-inside text-xs font-semibold text-slate-600 space-y-2.5 mt-2">
              <li>
                <span className="text-slate-800">Submit for review:</span> Submit this role information to our operations queue.
              </li>
              <li>
                <span className="text-slate-800">Admin validation:</span> VA101 Admin reviews guidelines compliance within 12h.
              </li>
              <li>
                <span className="text-slate-800">Marketplace Launch:</span> The job goes live and VAs can pitch.
              </li>
              <li>
                <span className="text-slate-800">Review Shortlist:</span> Meet only pre-vetted matching candidates!
              </li>
            </ol>
          </div>

          {/* Action Trigger Submit */}
          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.roleNeeded.trim() || !formData.workDays.trim() || !formData.workHours.trim() || !formData.description.trim() || !rate}
            className={`w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full text-xs font-bold transition-all ${
              (loading || !formData.title.trim() || !formData.roleNeeded.trim() || !formData.workDays.trim() || !formData.workHours.trim() || !formData.description.trim() || !rate)
                ? "bg-slate-200 text-slate-400 border-transparent cursor-not-allowed hover:bg-slate-200 hover:text-slate-400 shadow-none hover:shadow-none"
                : "text-white bg-[#E84E29] hover:bg-[#DA431E] cursor-pointer shadow-sm hover:shadow-md"
            }`}
          >
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </aside>

      </form>
    </div>
  );
}
