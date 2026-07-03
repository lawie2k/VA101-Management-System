"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormHeader from "../../../components/layout/FormHeader";

type AccountType = "va" | "client" | "trainer" | "student";

interface TypeOption {
  id: AccountType;
  title: string;
  desc: string;
}

const typeOptions: TypeOption[] = [
  {
    id: "va",
    title: "Virtual Assistant",
    desc: "Build a profile and apply to screened jobs.",
  },
  {
    id: "client",
    title: "Client",
    desc: "Post jobs and meet pre-screened VAs.",
  },
  {
    id: "trainer",
    title: "Trainer",
    desc: "Sell admin-approved courses to VAs and students.",
  },
  {
    id: "student",
    title: "Student",
    desc: "Buy VA training and unlock instant access.",
  },
];

export default function Page() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("va");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedOption = typeOptions.find((opt) => opt.id === accountType);

  const isFormValid = !!(
    formData.email.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (pass: string) => {
    const hasMinLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    return hasMinLength && hasUppercase;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Password mismatch validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // 2. Password complexity validation (8 characters, 1 uppercase letter)
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          accountType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Clear previous session data to prevent cross-account pollution
      localStorage.removeItem("va_profile_data");
      localStorage.removeItem("client_profile_data");
      localStorage.removeItem("trainer_profile_data");
      localStorage.removeItem("student_profile_data");

      // Successful registration -> route to setup profile first for VAs, otherwise dashboard
      if (accountType === "va") router.push("/va/profile/setup-profile-form");
      else if (accountType === "client") router.push("/client/profile/setup-profile-form");
      else if (accountType === "trainer") router.push("/trainer/profile/setup-profile-form");
      else if (accountType === "student") router.push("/student/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Section */}
      <div className="w-full max-w-5xl flex flex-col items-center mb-8">
        <FormHeader />
      </div>

      <div className="max-w-5xl w-full space-y-8 my-auto">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Pick an account type to get started.
          </p>
        </div>

        {/* Account Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {typeOptions.map((option) => {
            const isSelected = accountType === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setAccountType(option.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer h-full flex flex-col justify-between ${
                  isSelected
                    ? "border-teal-500 bg-white ring-1 ring-teal-500 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                    {option.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {option.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Container Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-5xl"
        >
          <div className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-xs font-semibold text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-900 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                placeholder="you@example.com"
              />
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-900 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold text-slate-900 mb-2"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* Disclaimer terms */}
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              By creating an account you agree to our{" "}
              <a
                href="https://www.virtualassistant101.com/p/terms-and-conditions.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-600 transition-colors"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="https://www.virtualassistant101.com/p/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-600 transition-colors"
              >
                Privacy Policy
              </a>
              . Payments are routed through our platform and verified by Finance.
            </p>

            {/* Action Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm cursor-pointer disabled:bg-slate-200 disabled:text-slate-450 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? "Creating..." : `Create ${selectedOption ? selectedOption.title : "account"} account`}
              </button>
            </div>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-xs text-slate-500 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-teal-600 hover:text-teal-700 font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Spacer helper to push footer down cleanly */}
      <div className="h-4" />
    </div>
  );
}
