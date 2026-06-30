"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    experienceYears: 1,
    expectedRate: 10,
    location: "",
    niche: "General VA",
    about: "",
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      setAvatarError("Image is too large. Choose under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setAvatarError("Failed to read image.");
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      setCoverError("Image is too large. Choose under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCoverImage(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setCoverError("Failed to read image.");
    };
    reader.readAsDataURL(file);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const nichesList = [
    "General VA",
    "Executive Support",
    "Real Estate",
    "Digital Marketing",
    "Social Media",
    "E-commerce",
    "SaaS & Tech",
    "Healthcare",
    "Finance & Insurance",
    "Graphics & Video Services"
  ];

  useEffect(() => {
    async function loadInitialUserData() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const session = await res.json();
          if (session.authenticated && session.user) {
            setFormData((prev) => ({
              ...prev,
              fullName: session.user.fullName || "",
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load user session", err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadInitialUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/va/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          title: formData.title,
          experienceYears: formData.experienceYears,
          expectedRate: formData.expectedRate,
          location: formData.location,
          niche: formData.niche,
          about: formData.about || `Hello! I am a professional Virtual Assistant specializing in ${formData.niche}.`,
          skills: selectedSkills,
          tools: selectedTools,
          avatar: avatar || undefined,
          coverImage: coverImage || undefined,
          openToOpportunities: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile. Please try again.");
      }

      // Sync local storage so header and dashboard show the updated name/data immediately
      const profileRes = await fetch("/api/va/profile");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        localStorage.setItem("va_profile_data", JSON.stringify(profileData));
        window.dispatchEvent(new Event("profileUpdate"));
      }

      router.push("/va/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#E84E29] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold text-slate-500">Preparing your setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete your VA Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Just a few more details to set up your account and get you matching with clients.
          </p>
        </div>

        {/* Setup Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
        >
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-xs font-semibold text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Full Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-900 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-900 mb-2">
                Professional Title (Headline)
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                placeholder="e.g. Lead-Gen VA / Executive Assistant"
              />
            </div>
          </div>

          {/* Niche & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="niche" className="block text-xs font-bold text-slate-900 mb-2">
                Core Specialty (Niche)
              </label>
              <select
                id="niche"
                name="niche"
                value={formData.niche}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-semibold text-slate-800 bg-slate-50/30"
              >
                {nichesList.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-xs font-bold text-slate-900 mb-2">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                placeholder="e.g. Manila, Philippines"
              />
            </div>
          </div>

          {/* Experience & Expected Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="experienceYears" className="block text-xs font-bold text-slate-900 mb-2">
                Years of Experience
              </label>
              <input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min="0"
                required
                value={formData.experienceYears}
                onChange={handleNumberChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
              />
            </div>

            <div>
              <label htmlFor="expectedRate" className="block text-xs font-bold text-slate-900 mb-2">
                Expected Hourly Rate ($ / hr)
              </label>
              <input
                id="expectedRate"
                name="expectedRate"
                type="number"
                min="1"
                required
                value={formData.expectedRate}
                onChange={handleNumberChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
              />
            </div>
          </div>

          {/* Brief Bio */}
          <div>
            <label htmlFor="about" className="block text-xs font-bold text-slate-900 mb-2">
              Brief Bio (Introduce yourself to clients)
            </label>
            <textarea
              id="about"
              name="about"
              rows={3}
              value={formData.about}
              onChange={handleInputChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
              placeholder="Tell clients about your skills, tools you use, or past experience..."
            />
          </div>

          {/* Photos Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
            {/* Profile Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-2xl font-black">?</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-input"
                  />
                  <label
                    htmlFor="avatar-input"
                    className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-all shadow-xs"
                  >
                    Select Image
                  </label>
                  {avatarError && <p className="text-[10px] text-red-500 font-semibold mt-1">{avatarError}</p>}
                </div>
              </div>
            </div>

            {/* Cover Banner */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                Profile Cover Banner
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-xs font-bold">No banner</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    id="cover-input"
                  />
                  <label
                    htmlFor="cover-input"
                    className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-all shadow-xs"
                  >
                    Select Image
                  </label>
                  {coverError && <p className="text-[10px] text-red-500 font-semibold mt-1">{coverError}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Checklist */}
          <div className="border-t border-slate-100 pt-5">
            <label className="block text-xs font-bold text-slate-900 mb-3">
              My Core Skills (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-[#E84E29] text-white border-[#E84E29] shadow-xs"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-350 hover:text-slate-700"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Checklist */}
          <div className="border-t border-slate-100 pt-5">
            <label className="block text-xs font-bold text-slate-900 mb-3">
              Tools & Platforms I Use (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_TOOLS.map((tool) => {
                const isSelected = selectedTools.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-[#E84E29] text-white border-[#E84E29] shadow-xs"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-350 hover:text-slate-700"
                    }`}
                  >
                    {tool}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={
                loading ||
                !formData.fullName.trim() ||
                !formData.title.trim() ||
                !formData.location.trim() ||
                !formData.about.trim() ||
                formData.experienceYears < 0 ||
                formData.expectedRate <= 0
              }
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? "Saving profile..." : "Save Profile & Enter Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
