"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrainerSetupProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    expertise: "",
    avatar: null as string | null,
    coverImage: null as string | null,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Restore form data if returning from the legacy Veem flow
    const saved = localStorage.getItem("temp_trainer_setup");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          fullName: parsed.fullName || prev.fullName,
          bio: parsed.bio || prev.bio,
          expertise: parsed.expertise || prev.expertise,
          avatar: parsed.avatar || prev.avatar,
          coverImage: parsed.coverImage || prev.coverImage
        }));
        localStorage.removeItem("temp_trainer_setup");
      } catch (e) {
        console.error("Failed to restore temp setup data", e);
      }
    }
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    async function checkExistingProfile() {
      try {
        const res = await fetch("/api/trainer/profile");
        if (res.ok) {
          const data = await res.json();
          if (data && data.status !== "draft") {
            localStorage.setItem("trainer_profile_data", JSON.stringify(data));
            router.replace("/trainer/dashboard");
            return;
          }
        } else {
          // If the API returns an error (like 403 Forbidden because they are a VA, not a trainer)
          // immediately kick them back to login to re-route them to their correct dashboard.
          if (res.status === 401 || res.status === 403) {
            window.location.href = "/login";
            return;
          }
        }
      } catch (e) {
        console.error("Failed to check profile status:", e);
      } finally {
        setInitialLoading(false);
      }
    }
    checkExistingProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "avatar" | "coverImage") => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, [field]: url }));
    }
  };



  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.bio.trim()) errors.bio = "Bio is required";
    if (!formData.expertise.trim()) errors.expertise = "Expertise is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = formData.fullName.trim() !== "" && formData.bio.trim() !== "" && formData.expertise.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        fullName: formData.fullName,
        bio: formData.bio,
        expertise: formData.expertise,
      };

      const res = await fetch("/api/trainer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to setup profile");
      }

      const updatedProfile = await res.json();

      // Include the avatar/cover in the local storage object for immediate feedback
      const finalProfileData = {
        ...updatedProfile.data,
        avatar: formData.avatar || updatedProfile.data.avatar,
        coverImage: formData.coverImage || updatedProfile.data.coverImage,
      };

      localStorage.setItem("trainer_profile_data", JSON.stringify(finalProfileData));
      window.dispatchEvent(new Event("trainerProfileUpdate"));

      window.location.replace("/trainer/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E84E29]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E84E29]/5 rounded-bl-full -z-10 blur-3xl"></div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Set up your Trainer Profile</h1>
          <p className="text-sm text-slate-500 font-medium mt-2">
            Let students know who you are and what you teach. You must complete this before accessing your dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photos Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-slate-100 pb-5">
            {/* Profile Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-2xl font-black">?</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "avatar")}
                    className="hidden"
                    id="avatar-input"
                  />
                  <label
                    htmlFor="avatar-input"
                    className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-all shadow-xs"
                  >
                    Select Image
                  </label>
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
                  {formData.coverImage ? (
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-xs font-bold">No banner</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "coverImage")}
                    className="hidden"
                    id="cover-input"
                  />
                  <label
                    htmlFor="cover-input"
                    className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-all shadow-xs"
                  >
                    Select Image
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    validationErrors.fullName ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-[#E84E29]"
                  } rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#E84E29]/10 transition-all`}
                />
                {validationErrors.fullName && <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  Expertise <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="e.g. Advanced Meta Ads, SEO Optimization"
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    validationErrors.expertise ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-[#E84E29]"
                  } rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#E84E29]/10 transition-all`}
                />
                {validationErrors.expertise && <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.expertise}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell students about your background and teaching style..."
                className={`w-full px-4 py-3 bg-slate-50 border ${
                  validationErrors.bio ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-[#E84E29]"
                } rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#E84E29]/10 transition-all resize-none`}
              />
              {validationErrors.bio && <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.bio}</p>}
            </div>

            </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`px-8 py-3.5 rounded-full text-sm font-black text-white transition-all shadow-sm ${
                !isFormValid || loading
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-[#E84E29] hover:bg-[#DA431E] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {loading ? "Saving..." : "Complete Setup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
