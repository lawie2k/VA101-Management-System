"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "../../../../../components/forms/PhoneInput";

// Form validation regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export default function ClientSetupProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "1-10",
    companyWebsite: "",
    companyDescription: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Country selector state for PhoneInput
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    name: "United States",
    flag: "🇺🇸"
  });

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

  const isFormIncomplete =
    !formData.companyName.trim() ||
    !formData.industry.trim() ||
    !formData.companyWebsite.trim() ||
    !formData.companyDescription.trim();

  useEffect(() => {
    // Check if profile is already configured in LocalStorage to block back navigation
    const saved = localStorage.getItem("client_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.companyName && parsed.industry) {
          router.replace("/client/dashboard");
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            window.location.href = "/login";
          }
          return null;
        }
        return res.json();
      })
      .catch((e) => console.error(e))
      .finally(() => setInitialLoading(false));

    // Prevent back navigation during setup
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      errors.companyName = "Company Name is required.";
    }

    if (!formData.industry.trim()) {
      errors.industry = "Industry is required.";
    }

    if (formData.companyWebsite.trim() && !URL_REGEX.test(formData.companyWebsite.trim())) {
      errors.companyWebsite = "Please enter a valid URL (e.g. https://company.com).";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError("Please correct the errors in the form before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Simulate backend latency delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Build profile data matching API schema
      const profileDataToSave = {
        ...formData,
        avatar: avatar || undefined,
        coverImage: coverImage || undefined
      };

      // Save profile details to LocalStorage to sync client state
      localStorage.setItem("client_profile_data", JSON.stringify(profileDataToSave));
      
      // Navigate client to dashboard and replace history state to avoid back navigating loops
      router.replace("/client/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
            Let's Set Up Your Client Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Provide details about your company to start hiring top Virtual Assistants.
          </p>
        </div>

        {/* Setup Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Photos Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
            {/* Avatar / Logo Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">Company Logo (Profile)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-2xl font-black">?</span>
                  )}
                </div>
                <div>
                  <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <label htmlFor="avatar-upload" className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer transition-all shadow-xs">
                    Select Image
                  </label>
                  {avatarError && <p className="text-red-500 text-[10px] mt-1 font-semibold">{avatarError}</p>}
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">Cover Header Image</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-xs font-bold">No banner</span>
                  )}
                </div>
                <div>
                  <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  <label htmlFor="cover-upload" className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer transition-all shadow-xs">
                    Select Image
                  </label>
                  {coverError && <p className="text-red-500 text-[10px] mt-1 font-semibold">{coverError}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="border-t border-slate-100 pt-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="companyName" className="block text-xs font-bold text-slate-900 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-medium text-slate-800 bg-slate-50/30 ${
                    validationErrors.companyName
                      ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-slate-200 focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29]"
                  }`}
                  placeholder="e.g. Acme Corporation"
                />
                {validationErrors.companyName && (
                  <p className="text-red-600 text-[10px] font-semibold mt-1">
                    {validationErrors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="industry" className="block text-xs font-bold text-slate-900 mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  required
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-medium text-slate-800 bg-slate-50/30 ${
                    validationErrors.industry
                      ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-slate-200 focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29]"
                  }`}
                  placeholder="e.g. SaaS, E-commerce, Real Estate"
                />
                {validationErrors.industry && (
                  <p className="text-red-600 text-[10px] font-semibold mt-1">
                    {validationErrors.industry}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div>
                <label htmlFor="companySize" className="block text-xs font-bold text-slate-900 mb-2">
                  Company Size
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all font-semibold text-slate-800 bg-slate-50/30"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>

              <div>
                <label htmlFor="companyWebsite" className="block text-xs font-bold text-slate-900 mb-2">
                  Company Website URL
                </label>
                <input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="text"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-medium text-slate-800 bg-slate-50/30 ${
                    validationErrors.companyWebsite
                      ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-slate-200 focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29]"
                  }`}
                  placeholder="e.g. https://www.acme.com"
                />
                {validationErrors.companyWebsite && (
                  <p className="text-red-600 text-[10px] font-semibold mt-1">
                    {validationErrors.companyWebsite}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="companyDescription" className="block text-xs font-bold text-slate-900 mb-2">
                Company Description
              </label>
              <textarea
                id="companyDescription"
                name="companyDescription"
                rows={4}
                value={formData.companyDescription}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all font-medium text-slate-800 bg-slate-50/30 resize-none"
                placeholder="Tell VAs about your company culture, core mission, and projects..."
              />
              <p className="text-[10px] font-semibold text-slate-500 mt-1.5 ml-1">
                * Minimum 20 characters required for profile completion score.
              </p>
          </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={
                loading ||
                !formData.companyName.trim() ||
                !formData.industry.trim() ||
                !formData.companyWebsite.trim() ||
                !formData.companyDescription.trim()
              }
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Saving Profile...
                </span>
              ) : (
                "Complete Setup"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
