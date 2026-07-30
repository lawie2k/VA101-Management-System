"use client";

import { useState, useEffect } from "react";
import { useToast, Toast } from "../../shared/useToast";

const ALL_NICHES = [
  "General VA", "Executive Support", "Real Estate", "E-commerce",
  "SaaS & Tech", "Healthcare", "Finance & Insurance", "Professional Services",
  "Digital Marketing", "Social Media", "E-learning", "Graphics & Video Services"
];

const ALL_SKILLS = [
  "Lead Generation", "Cold Calling", "Email Management", "Data Entry",
  "Social Media", "Scheduling", "Customer Support", "CRM Administration",
  "Canva Design", "Copywriting", "SEO Optimization", "Project Management"
];

const ALL_TOOLS = [
  "HubSpot", "Google Workspace", "Salesforce", "Slack", "Asana", "Trello",
  "Zoom", "Canva", "ActiveCampaign", "Mailchimp", "Zapier", "Airtable"
];

const TIMEZONE_OPTIONS = [
  "EST", "CST", "MST", "PST", "GMT", "BST", "CET", "EET", "IST", "AEST", "AWST", "PHT"
];

interface EditJobModalProps {
  jobId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditJobModal({ jobId, onClose, onSuccess }: EditJobModalProps) {
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    roleNeeded: "",
    niche: ALL_NICHES[0],
    workSchedule: "",
    description: "",
    timezone: "EST",
  });

  const [rate, setRate] = useState<number | "">(12);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  useEffect(() => {
    async function loadJob() {
      try {
        const res = await fetch(`/api/client/jobs/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.jobTitle || "",
            roleNeeded: data.roleNeeded || "",
            niche: data.niche || ALL_NICHES[0],
            workSchedule: data.workSchedule || "",
            description: data.jobDescription || "",
            timezone: data.timezone || "EST",
          });
          setRate(data.clientHourlyRate || 12);
          setSelectedSkills(data.skills || []);
          setSelectedTools(data.tools || []);
        } else {
          showToast("Failed to load job details.", "error");
        }
      } catch (err) {
        showToast("Error loading job.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [jobId]);

  const toggleSkill = (skill: string) => setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  const toggleTool = (tool: string) => setSelectedTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      jobTitle: formData.title,
      roleNeeded: formData.roleNeeded,
      jobDescription: formData.description,
      workSchedule: formData.workSchedule,
      timezone: formData.timezone,
      clientHourlyRate: rate,
      niche: formData.niche,
      skills: selectedSkills,
      tools: selectedTools,
    };

    try {
      const res = await fetch(`/api/client/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        showToast("Job updated successfully!", "success");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        const err = await res.json();
        showToast(`Failed to update job: ${err.error}`, "error");
        setSaving(false);
      }
    } catch (err: any) {
      showToast(err.message || "An unexpected error occurred.", "error");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900">Edit Job Post</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E84E29] border-t-transparent" />
            </div>
          ) : (
            <form id="edit-job-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Role Needed <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.roleNeeded} onChange={e => setFormData({...formData, roleNeeded: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Core Specialty (Niche)</label>
                  <select value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] outline-none bg-white">
                    {ALL_NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Work Schedule</label>
                  <input type="text" value={formData.workSchedule} onChange={e => setFormData({...formData, workSchedule: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] outline-none" placeholder="e.g. Monday - Friday, 09:00 AM - 05:00 PM EST" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Timezone</label>
                  <select value={formData.timezone} onChange={e => setFormData({...formData, timezone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] outline-none bg-white">
                    {TIMEZONE_OPTIONS.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Hourly Budget Rate (USD)</label>
                  <input type="number" min="5" value={rate} onChange={e => setRate(e.target.value ? Number(e.target.value) : "")} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] outline-none" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-2">Required Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.map(skill => (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedSkills.includes(skill) ? "bg-[#E84E29] text-white border-[#E84E29]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-2">Required Tools</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TOOLS.map(tool => (
                      <button key={tool} type="button" onClick={() => toggleTool(tool)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedTools.includes(tool) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Job Description <span className="text-red-500">*</span></label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={5} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] outline-none resize-y" placeholder="Describe the role, responsibilities, and expectations..."></textarea>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
          <button type="submit" form="edit-job-form" disabled={saving || loading} className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] shadow-sm">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
