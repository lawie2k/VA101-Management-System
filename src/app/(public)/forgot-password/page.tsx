"use client";

import { useState } from "react";
import Link from "next/link";
import FormHeader from "../../../components/layout/FormHeader";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Section */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-8">
        <FormHeader />
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs my-auto">
        
        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Reset Password</h3>
              <p className="text-sm text-slate-500 font-medium">Enter your email address to receive a recovery code.</p>
            </div>

            {error && <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 rounded-lg">{error}</div>}

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 font-medium bg-slate-50/30"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] cursor-pointer disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? "Sending..." : "Send Recovery Code"}
            </button>
            
            <p className="text-center mt-4 text-xs text-slate-500 font-medium">
              Remember your password?{" "}
              <Link href="/login" className="text-teal-600 hover:text-teal-700 font-bold hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        )}

        {/* STEP 2: Verify Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Enter Code</h3>
              <p className="text-sm text-slate-500 font-medium">We sent a 6-digit code to <span className="font-bold">{email}</span></p>
            </div>

            {error && <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 rounded-lg">{error}</div>}

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">Recovery Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-slate-300 font-bold bg-slate-50/30"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] cursor-pointer disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            
            <p className="text-center mt-4 text-xs text-slate-500 font-medium">
              <button type="button" onClick={() => setStep(1)} className="text-teal-600 hover:text-teal-700 font-bold hover:underline">
                Change Email
              </button>
            </p>
          </form>
        )}

        {/* STEP 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">New Password</h3>
              <p className="text-sm text-slate-500 font-medium">Enter your new secure password.</p>
            </div>

            {error && <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 rounded-lg">{error}</div>}

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 font-medium bg-slate-50/30"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 font-medium bg-slate-50/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] cursor-pointer disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? "Resetting..." : "Change Password"}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-4 py-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Password Changed!</h3>
            <p className="text-sm text-slate-500 font-medium pb-2">Your password has been successfully updated.</p>
            
            <Link
              href="/login"
              className="w-full flex items-center justify-center mt-4 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] cursor-pointer transition-all shadow-sm"
            >
              Return to Login
            </Link>
          </div>
        )}

      </div>

      <div className="h-4" />
    </div>
  );
}
