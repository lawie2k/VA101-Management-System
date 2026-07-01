"use client";

import { useState } from "react";

// ==========================================
// SVG Icons
// ==========================================

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

const IconTrash = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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

// ==========================================
// Section Card
// ==========================================

export function SectionCard({
  icon,
  title,
  subtitle,
  children,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className={`bg-white rounded-3xl border shadow-xs p-6 ${danger ? "border-red-200/60" : "border-slate-200"}`}>
      <div className="flex items-start gap-3 mb-6">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-600"}`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-sm font-extrabold ${danger ? "text-red-600" : "text-slate-900"}`}>{title}</h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ==========================================
// Password / Email Field
// ==========================================

export function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
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

// ==========================================
// Toast
// ==========================================

export function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-bold animate-fade-in ${
      type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
    }`}>
      {type === "success" && <IconCheck />}
      {message}
    </div>
  );
}

// ==========================================
// Delete Confirmation Modal
// ==========================================

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
                <li>All job posts will be permanently removed</li>
                <li>All active contracts will be voided</li>
                <li>Your company profile data will be deleted</li>
                <li>All interview and candidate history will be lost</li>
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

// ==========================================
// SettingsMainFeed Component
// ==========================================

export default function SettingsMainFeed() {
  const [newEmail, setNewEmail]                         = useState("");
  const [confirmEmail, setConfirmEmail]                 = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [emailLoading, setEmailLoading]                 = useState(false);

  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [passwordLoading, setPasswordLoading]   = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showToastMsg = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const emailFormReady = newEmail.includes("@") && newEmail === confirmEmail && currentPasswordForEmail.length >= 8;
  const passwordFormReady = currentPassword.length >= 8 && newPassword.length >= 8 && newPassword === confirmPassword;

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailFormReady) return;
    setEmailLoading(true);
    setTimeout(() => {
      setEmailLoading(false);
      setNewEmail(""); setConfirmEmail(""); setCurrentPasswordForEmail("");
      showToastMsg("Email updated. Check your inbox to verify.", "success");
    }, 1200);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordFormReady) return;
    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      showToastMsg("Password changed successfully.", "success");
    }, 1200);
  };

  const strength = newPassword.length >= 12 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^a-zA-Z0-9]/.test(newPassword)
    ? 4 : newPassword.length >= 10 && /[A-Z]/.test(newPassword) ? 3 : newPassword.length >= 8 ? 2 : 1;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => { setShowDeleteModal(false); showToastMsg("Account scheduled for deletion. You will receive a confirmation email.", "error"); }}
        />
      )}

      <main className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-5 pb-12">

        {/* Page Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs bg-gradient-to-br from-slate-50/80 to-white">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your login credentials and account security. Changes apply only to your account.
          </p>
        </div>

        {/* Change Email */}
        <SectionCard icon={<IconMail />} title="Update Email Address" subtitle="Change the Gmail or email connected to your VA101 account.">
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <Field id="newEmail" label="New Email Address" type="email" value={newEmail} onChange={setNewEmail} placeholder="e.g. newname@gmail.com" />
            <Field id="confirmEmail" label="Confirm New Email" type="email" value={confirmEmail} onChange={setConfirmEmail} placeholder="Re-enter your new email"
              hint={confirmEmail && newEmail !== confirmEmail ? "⚠ Emails do not match." : undefined} />
            <Field id="currentPasswordForEmail" label="Current Password" type="password" value={currentPasswordForEmail} onChange={setCurrentPasswordForEmail}
              placeholder="Enter your current password" hint="We require your password to confirm this change." />
            <button type="submit" disabled={!emailFormReady || emailLoading}
              className={`w-full py-3 rounded-full text-xs font-bold transition-all ${emailFormReady && !emailLoading ? "bg-[#E84E29] text-white hover:bg-[#DA431E] shadow-sm cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
              {emailLoading ? "Saving..." : "Update Email"}
            </button>
          </form>
        </SectionCard>

        {/* Change Password */}
        <SectionCard icon={<IconLock />} title="Change Password" subtitle="Use a strong, unique password to secure your account.">
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <Field id="currentPassword" label="Current Password" type="password" value={currentPassword} onChange={setCurrentPassword} placeholder="Enter your current password" />
            <Field id="newPassword" label="New Password" type="password" value={newPassword} onChange={setNewPassword} placeholder="Minimum 8 characters" hint="Must be at least 8 characters." />
            <Field id="confirmPassword" label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter new password"
              hint={confirmPassword && newPassword !== confirmPassword ? "⚠ Passwords do not match." : undefined} />

            {newPassword.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-500 mb-1.5">Password strength</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strength === 4 ? "bg-emerald-500" : strength === 3 ? "bg-blue-400" : strength === 2 ? "bg-amber-400" : "bg-red-400" : "bg-slate-100"}`} />
                  ))}
                </div>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">
                  {newPassword.length < 8 ? "Weak" : newPassword.length < 10 ? "Fair" : newPassword.length < 12 ? "Good" : "Strong"}
                </p>
              </div>
            )}

            <button type="submit" disabled={!passwordFormReady || passwordLoading}
              className={`w-full py-3 rounded-full text-xs font-bold transition-all ${passwordFormReady && !passwordLoading ? "bg-slate-900 text-white hover:bg-slate-700 shadow-sm cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard icon={<IconTrash />} title="Delete Account" subtitle="Permanently remove your VA101 account and all associated data." danger>
          <div className="bg-red-50/60 border border-red-200/40 rounded-2xl p-4 mb-5">
            <p className="text-[11px] text-red-600 font-semibold leading-relaxed">
              Once you delete your account, all job posts, contracts, candidate shortlists, and profile data will be <strong>permanently erased</strong>. This cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-3 rounded-full text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer"
          >
            Delete My Account
          </button>
        </SectionCard>

      </main>
    </>
  );
}
