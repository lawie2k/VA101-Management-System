"use client";

import { useState } from "react";
import Link from "next/link";
import FormHeader from "../../../components/layout/FormHeader";

export default function Page() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Section */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-8">
        <FormHeader />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs my-auto">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your workspace
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Enter your email and password to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
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

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-slate-500 font-medium cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <a
              href="#"
              className="font-bold text-orange-500 hover:text-orange-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center py-2.5 border border-transparent rounded-full text-xs font-bold text-white bg-[#F97316] hover:bg-orange-600 transition-all shadow-sm cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-xs text-slate-500 font-medium">
          Need an account?{" "}
          <Link
            href="/register"
            className="text-teal-600 hover:text-teal-700 font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Spacer helper to push footer down cleanly */}
      <div className="h-4" />
    </div>
  );
}
