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
    stripeConnected: false,
    avatar: null as string | null,
    coverImage: null as string | null,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
    if (!formData.stripeConnected) errors.stripe = "Please connect your Stripe account to receive payouts.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = formData.fullName.trim() !== "" && formData.bio.trim() !== "" && formData.expertise.trim() !== "" && formData.stripeConnected;

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
        payoutMethod: "Stripe Connect",
        payoutEmail: "connected@stripe.com", // Mock email for now
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

      router.push("/trainer/dashboard");
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

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">Payout Method</h3>
              <p className="text-xs font-semibold text-slate-500 mb-6">
                We use Stripe to make sure you get paid securely and on time. Connect your account below.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#635BFF]" viewBox="0 0 40 40" fill="none">
                      <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm6.92 14.625c-.244-2.617-2.314-4.524-5.467-4.524-3.69 0-6.19 2.222-6.19 5.642 0 6.643 9.077 5.438 9.077 8.358 0 1.25-.976 1.933-2.42 1.933-1.802 0-2.825-.87-3.21-2.26l-3.327.535c.58 2.617 2.802 4.6 6.37 4.6 4.015 0 6.45-2.235 6.45-5.748 0-6.84-9.077-5.542-9.077-8.373 0-1.07.915-1.764 2.225-1.764 1.512 0 2.457.755 2.72 1.986l3.327-.552-.477-4.832v4.999z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Stripe Connect</p>
                    <p className="text-[10px] font-semibold text-slate-500">
                      {formData.stripeConnected ? "Connected and ready for payouts" : "Not connected"}
                    </p>
                  </div>
                </div>

                {formData.stripeConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Connected
                    </span>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, stripeConnected: false}))}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, stripeConnected: true}))}
                    className="px-4 py-2 bg-[#635BFF] hover:bg-[#524BDE] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    Connect Stripe
                  </button>
                )}
              </div>
              {validationErrors.stripe && (
                <p className="text-red-500 text-xs mt-3 font-semibold text-center">{validationErrors.stripe}</p>
              )}
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="font-bold text-emerald-700 text-sm">70% revenue share</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600/70 leading-relaxed">
                Platform retains 30% to cover hosting, payment ops, and marketing.
              </p>
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
