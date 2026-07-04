"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentSetupProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    learningGoal: "",
  });

  const [avatar, setAvatar] = useState<string>("");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  
  const [coverImage, setCoverImage] = useState<string>("");
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

  const isFormIncomplete = !formData.fullName.trim() || !formData.learningGoal.trim();

  useEffect(() => {
    // Check if profile is already configured in LocalStorage to block back navigation
    const saved = localStorage.getItem("student_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.learningGoal) {
          router.replace("/student/dashboard");
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Attempt to prefill full name if available
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setFormData((prev) => ({ ...prev, fullName: data.user.full_name || "" }));
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setInitialLoading(false));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormIncomplete) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          learningGoal: formData.learningGoal,
          avatarUrl: avatar || undefined,
          coverImage: coverImage || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile. Please try again.");
      }

      // Build profile data matching API schema
      const profileDataToSave = {
        fullName: formData.fullName,
        learningGoal: formData.learningGoal,
        avatarUrl: avatar || undefined,
        coverImage: coverImage || undefined,
      };

      // Save profile details to LocalStorage to sync client state
      localStorage.setItem("student_profile_data", JSON.stringify(profileDataToSave));
      window.dispatchEvent(new Event("studentProfileUpdate"));

      router.replace("/student/dashboard");
    } catch (err: any) {
      setError(err.message);
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to the Student Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Let's get your profile set up so you can start browsing available training materials.
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
            {/* Avatar Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
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

          {/* Section 1: Profile Details */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Basic Details
            </h3>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-slate-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-medium text-slate-800 bg-slate-50/30"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label htmlFor="learningGoal" className="block text-xs font-bold text-slate-900 mb-2">
                  Learning Goal <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="learningGoal"
                  name="learningGoal"
                  rows={4}
                  required
                  value={formData.learningGoal}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E84E29] focus:ring-1 focus:ring-[#E84E29] transition-all font-medium text-slate-800 bg-slate-50/30 resize-none"
                  placeholder="What do you hope to achieve with these trainings?"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || isFormIncomplete}
              className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 active:scale-[0.98] ${
                loading || isFormIncomplete
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                  : "bg-[#E84E29] hover:bg-[#d03d1c] text-white cursor-pointer shadow-md shadow-orange-500/10"
              } flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
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
