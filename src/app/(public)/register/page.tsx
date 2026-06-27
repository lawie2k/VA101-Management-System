"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [accountType, setAccountType] = useState<AccountType>("va");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const selectedOption = typeOptions.find((opt) => opt.id === accountType);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Submit Registration:", { accountType, ...formData });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 sm:px-6 lg:px-8">
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
            {/* Full Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-bold text-slate-900 mb-2"
                >
                  {accountType === "client" ? "Full name or Company name" : "Full name"}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                  placeholder={accountType === "client" ? "Your name or company name" : "Your name"}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-900 mb-2"
                >
                  Email
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
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-900 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold text-slate-900 mb-2"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all font-medium text-slate-800 bg-slate-50/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Disclaimer terms */}
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              By creating an account you agree to our terms. Payments are routed
              through our platform and verified by Finance.
            </p>

            {/* Action Submit Button */}
            <div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full text-xs font-bold text-white bg-[#F97316] hover:bg-orange-600 transition-all shadow-sm cursor-pointer"
              >
                Create {selectedOption ? selectedOption.title : "account"} account
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
