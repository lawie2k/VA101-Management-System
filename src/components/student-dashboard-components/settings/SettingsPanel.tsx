"use client";

import { useState } from "react";
import { IconSettings } from "../StudentIcons";

const IconMail = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,12 2,6" />
  </svg>
);

const IconLock = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconEye = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const DELETE_PHRASE = "DELETE MY ACCOUNT";

export function DeleteModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phrase, setPhrase] = useState("");
  const [password, setPassword] = useState("");
  const isReady = phrase === DELETE_PHRASE && password.length >= 8;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 border border-red-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <IconTrash />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Delete Account</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Step {step} of 2 — {step === 1 ? "Understand consequences" : "Final confirmation"}
            </p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200/60 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-red-700">This action is permanent and irreversible.</p>
              <ul className="text-[11px] text-red-600 font-semibold space-y-1.5 list-disc list-inside">
                <li>All enrolled courses and progress will be lost</li>
                <li>Your student profile data will be permanently deleted</li>
                <li>Access to active purchases will be revoked</li>
                <li>Pending payments may still be processed</li>
              </ul>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer">
                Cancel — Keep my account
              </button>
              <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-full text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-all cursor-pointer">
                I understand, continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Type <span className="font-black text-red-600 tracking-wide">{DELETE_PHRASE}</span> to confirm
              </label>
              <input type="text" value={phrase} onChange={e => setPhrase(e.target.value)} placeholder="Type the phrase exactly..." className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Enter your account password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your current password" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-transparent transition-all" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setStep(1); setPhrase(""); setPassword(""); }} className="flex-1 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer">
                Go back
              </button>
              <button
                disabled={!isReady}
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${isReady ? "text-white bg-red-600 hover:bg-red-700 cursor-pointer shadow-sm" : "text-slate-400 bg-slate-100 cursor-not-allowed"}`}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showToastMsg = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail !== confirmEmail) {
      return showToastMsg("New emails do not match", "error");
    }
    setEmailLoading(true);
    try {
      const res = await fetch("/api/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_email", newEmail, currentPassword: currentPasswordForEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        showToastMsg("Email updated successfully", "success");
        setNewEmail("");
        setConfirmEmail("");
        setCurrentPasswordForEmail("");
      } else {
        showToastMsg(data.error || "Failed to update email", "error");
      }
    } catch (err) {
      showToastMsg("An error occurred", "error");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return showToastMsg("New passwords do not match", "error");
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_password", currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showToastMsg("Password updated successfully", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToastMsg(data.error || "Failed to update password", "error");
      }
    } catch (err) {
      showToastMsg("An error occurred", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-bold animate-fade-in ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" && <IconCheck />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <IconSettings className="text-slate-700 w-5 h-5" stroke={2} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Settings</h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Manage your account and security preferences
            </p>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <IconMail />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Email Address</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Change the email associated with your account</p>
          </div>
        </div>
        
        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <InputField id="newEmail" label="New Email Address" type="email" value={newEmail} onChange={setNewEmail} />
          <InputField id="confirmEmail" label="Confirm New Email" type="email" value={confirmEmail} onChange={setConfirmEmail} />
          <InputField id="currentPasswordForEmail" label="Current Password" type="password" value={currentPasswordForEmail} onChange={setCurrentPasswordForEmail} hint="Required to confirm email changes" />
          
          <div className="pt-2">
            <button type="submit" disabled={emailLoading || !newEmail || !confirmEmail || !currentPasswordForEmail} className="rounded-full px-6 py-2.5 text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {emailLoading ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <IconLock />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Password</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Ensure your account is using a long, random password</p>
          </div>
        </div>
        
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <InputField id="currentPassword" label="Current Password" type="password" value={currentPassword} onChange={setCurrentPassword} />
          <InputField id="newPassword" label="New Password" type="password" value={newPassword} onChange={setNewPassword} hint="Must be at least 8 characters" />
          <InputField id="confirmPassword" label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
          
          <div className="pt-2">
            <button type="submit" disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword} className="rounded-full px-6 py-2.5 text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-3xl border border-red-200/60 shadow-xs p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <IconTrash />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-red-600">Danger Zone</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Permanently delete your account and all associated data</p>
          </div>
        </div>
        
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Delete Account</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm leading-relaxed">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setShowDeleteModal(true)}
            className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-all cursor-pointer shadow-sm w-full sm:w-auto"
          >
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal 
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={async () => {
            try {
              const res = await fetch("/api/student/settings", { method: "DELETE" });
              if (res.ok) {
                window.location.href = "/login";
              } else {
                showToastMsg("Failed to delete account", "error");
                setShowDeleteModal(false);
              }
            } catch (err) {
              showToastMsg("An error occurred", "error");
              setShowDeleteModal(false);
            }
          }} 
        />
      )}

    </div>
  );
}

// Reusable Input Component
function InputField({ id, label, type = "text", value, onChange, placeholder, hint }: any) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-slate-800 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && showPw ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-slate-200 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/40 focus:border-transparent transition-all bg-white text-slate-800"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPw ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
      {hint && <p className="text-[10px] text-slate-400 font-medium mt-1">{hint}</p>}
    </div>
  );
}

