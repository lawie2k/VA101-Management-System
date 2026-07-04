"use client";

import { useState, useEffect } from "react";

import { StudentProfileHeader } from "../../../../components/student-dashboard-components/profile/StudentProfileHeader";
import { StudentLearningJourney } from "../../../../components/student-dashboard-components/profile/StudentLearningJourney";
import { StudentProfileSidebar } from "../../../../components/student-dashboard-components/profile/StudentProfileSidebar";
import { IconX } from "../../../../components/student-dashboard-components/profile/ProfileIcons";
import { Button } from "../../../../components/student-dashboard-components/profile/ProfileUI";

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeModal, setActiveModal] = useState<"basic" | "learning" | "avatar" | "cover" | null>(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    learningGoal: "",
    avatarUrl: "",
    coverImage: "",
  });

  const [basicForm, setBasicForm] = useState({ fullName: "" });
  const [learningForm, setLearningForm] = useState({ learningGoal: "" });
  const [avatarForm, setAvatarForm] = useState<string | null>(null);
  const [coverForm, setCoverForm] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/student/profile");
      const data = await res.json();
      
      if (res.ok) {
        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          learningGoal: data.learningGoal || "",
          avatarUrl: data.avatarUrl || "",
          coverImage: data.coverImage || "",
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    let score = 20; // Base
    if (profile.fullName.trim()) score += 40;
    if (profile.learningGoal.trim()) score += 40;
    return Math.min(score, 100);
  })();

  const openModal = (type: "basic" | "learning" | "avatar" | "cover") => {
    if (type === "basic") {
      setBasicForm({ fullName: profile.fullName });
    } else if (type === "learning") {
      setLearningForm({ learningGoal: profile.learningGoal });
    } else if (type === "avatar") {
      setAvatarForm(profile.avatarUrl || "");
    } else if (type === "cover") {
      setCoverForm(profile.coverImage || "");
    }
    setActiveModal(type);
    setError(null);
  };

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: basicForm.fullName,
        }),
      });

      if (!res.ok) throw new Error("Failed to update basic info");
      
      setProfile(prev => ({ ...prev, fullName: basicForm.fullName }));
      
      const cached = JSON.parse(localStorage.getItem("student_profile_data") || "{}");
      localStorage.setItem("student_profile_data", JSON.stringify({ ...cached, fullName: basicForm.fullName }));
      window.dispatchEvent(new Event("studentProfileUpdate"));
      
      setActiveModal(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLearning = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learningGoal: learningForm.learningGoal,
        }),
      });

      if (!res.ok) throw new Error("Failed to update learning goal");
      
      setProfile(prev => ({ ...prev, learningGoal: learningForm.learningGoal }));
      
      const cached = JSON.parse(localStorage.getItem("student_profile_data") || "{}");
      localStorage.setItem("student_profile_data", JSON.stringify({ ...cached, learningGoal: learningForm.learningGoal }));
      window.dispatchEvent(new Event("studentProfileUpdate"));
      
      setActiveModal(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "avatar") setAvatarForm(reader.result as string);
        else setCoverForm(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImages = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updates: any = {};
      if (activeModal === "avatar" && avatarForm !== null) updates.avatarUrl = avatarForm;
      if (activeModal === "cover" && coverForm !== null) updates.coverImage = coverForm;

      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update images");
      
      setProfile(prev => ({ ...prev, ...updates }));
      
      const cached = JSON.parse(localStorage.getItem("student_profile_data") || "{}");
      localStorage.setItem("student_profile_data", JSON.stringify({ ...cached, ...updates }));
      window.dispatchEvent(new Event("studentProfileUpdate"));
      
      setActiveModal(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E84E29]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      <StudentProfileHeader profile={profile} openModal={openModal} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <StudentLearningJourney learningGoal={profile.learningGoal} openModal={() => openModal("learning")} />
        </div>

        <StudentProfileSidebar strength={strength} profile={profile} />
      </div>

      {/* ==========================================
          MODALS
          ========================================== */}
      
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !saving && setActiveModal(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-xl border border-slate-100 overflow-visible flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-lg font-black text-slate-900">
                {activeModal === "basic" && "Edit Basic Information"}
                {activeModal === "learning" && "Edit Learning Goal"}
                {activeModal === "avatar" && "Update Profile Picture"}
                {activeModal === "cover" && "Update Cover Image"}
              </h2>
              <button 
                onClick={() => !saving && setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                disabled={saving}
              >
                <IconX />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="p-6 overflow-visible">
              
              {activeModal === "basic" && (
                <form id="basic-form" onSubmit={handleSaveBasic} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={basicForm.fullName}
                      onChange={(e) => setBasicForm({ ...basicForm, fullName: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                </form>
              )}

              {activeModal === "learning" && (
                <form id="learning-form" onSubmit={handleSaveLearning} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">What are you hoping to learn or achieve?</label>
                    <textarea 
                      rows={6}
                      required
                      value={learningForm.learningGoal}
                      onChange={(e) => setLearningForm({ ...learningForm, learningGoal: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs resize-none"
                    />
                  </div>
                </form>
              )}

              {(activeModal === "avatar" || activeModal === "cover") && (
                <form id="image-form" onSubmit={handleSaveImages} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Upload Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, activeModal)}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#E84E29] hover:file:bg-orange-100"
                    />
                  </div>
                  <div className="w-full h-40 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center">
                    {(activeModal === "avatar" ? avatarForm : coverForm) ? (
                      <img 
                        src={(activeModal === "avatar" ? avatarForm : coverForm)!} 
                        alt="Preview" 
                        className={`w-full h-full ${activeModal === "avatar" ? "object-contain" : "object-cover"}`} 
                      />
                    ) : (
                      <span className="text-sm text-slate-400 font-medium">Preview</span>
                    )}
                  </div>
                </form>
              )}

            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50 mt-auto rounded-b-3xl">
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)} disabled={saving}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                form={activeModal === "avatar" || activeModal === "cover" ? "image-form" : `${activeModal}-form`}
                variant="primary" 
                size="sm" 
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
