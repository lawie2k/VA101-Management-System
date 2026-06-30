"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormHeader from "../../../components/layout/FormHeader";
import { getDashboardRoute } from "../../../lib/roles";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            const dashboardRoute = getDashboardRoute(data.user.roles || []);
            router.replace(dashboardRoute);
          }
        }
      } catch (err) {
        console.error("Check session error:", err);
      }
    }
    checkSession();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      // Session established -> route user to dashboard based on primary role
      const dashboardRoute = getDashboardRoute(data.user.roles || []);
      router.push(dashboardRoute);
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
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-xs font-semibold text-red-700 rounded-lg animate-fade-in">
              {error}
            </div>
          )}

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
              className="font-bold text-[#E84E29] hover:text-[#DA431E] hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center py-2.5 border border-transparent rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
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

        {/* Discovery Call booking CTA */}
        <div className="mt-6 pt-5 border-t border-slate-150 flex flex-col items-center text-center">
          <p className="text-xs text-slate-500 font-medium">Looking to hire a Virtual Assistant?</p>
          <Link
            href="/discovery-calls"
            className="mt-2.5 w-full inline-flex items-center justify-center py-2.5 px-4 border border-slate-200 hover:border-slate-350 rounded-full text-xs font-extrabold text-slate-755 bg-slate-50 hover:bg-slate-100/70 transition-all cursor-pointer shadow-xs"
          >
             Book a free Discovery Call
          </Link>
        </div>
      </div>

      {/* Spacer helper to push footer down cleanly */}
      <div className="h-4" />
    </div>
  );
}
