"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FormHeader from "../../../components/layout/FormHeader";
import Footer from "../../../components/layout/Footer";

const navItems = [
  { label: "Dashboard", href: "/va/dashboard" },
  { label: "My Profile", href: "/va/profile" },
  { label: "Jobs", href: "/va/jobs" },
  { label: "My Applications", href: "/va/applications" },
  { label: "Interviews", href: "/va/interviews" },
  { label: "Courses", href: "/va/training" },
  { label: "My Learning", href: "/va/my-learning" },
  { label: "Assigned Tasks", href: "/va/tasks" },
  { label: "Payout History", href: "/va/payouts" },
  { label: "Settings", href: "/va/settings" },
];

export default function VaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync scroll detection to match standard FormHeader transparent transition threshold
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    const handleFeedScroll = (e: Event) => {
      const scrollTop = (e as CustomEvent).detail?.scrollTop || 0;
      setIsScrolled(scrollTop > 10);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("feedScroll", handleFeedScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("feedScroll", handleFeedScroll);
    };
  }, []);

  // Fetch session on mount/pathname changes
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.authenticated) {
          setLoading(false);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Layout auth check failed:", err);
        router.replace("/login");
      }
    }
    checkAuth();
  }, [router]);

  const isSetupPage = pathname === "/va/profile/setup-profile-form";

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-pulse">
            <div className="md:col-span-3 space-y-6 hidden md:block">
              <div className="h-[300px] bg-slate-200/50 rounded-3xl"></div>
              <div className="h-[200px] bg-slate-200/50 rounded-3xl"></div>
            </div>
            <div className="md:col-span-9 space-y-6">
              <div className="h-24 bg-slate-200/50 rounded-3xl"></div>
              <div className="h-[400px] bg-slate-200/50 rounded-3xl"></div>
            </div>
          </div>
        </div>
      );
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Dynamic transparent-to-solid FormHeader */}
      <FormHeader isDashboard={true} navItems={navItems} />

      {/* 
        Secondary role tab navigation bar (positioned directly underneath the header).
        Height matches FormHeader top offsets.
      */}
      {!isSetupPage && (
        <div className={`hidden md:block fixed top-[80px] md:top-[96px] left-0 w-screen z-40 py-2.5 transition-all duration-300 ${
          isScrolled 
            ? "border-b border-[#1c1c1e]" 
            : "border-b border-slate-200"
        }`}>
          
          {/* Solid Background Layer (fades in on scroll) */}
          <div 
            className={`absolute inset-0 bg-[#000312] transition-opacity duration-300 -z-10 ${
              isScrolled ? "opacity-100 shadow-sm" : "opacity-0"
            }`} 
          />
          
          {/* Transparent layout text buttons wrapper */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap shrink-0 transition-all ${
                    isActive 
                      ? "bg-[#E84E29] text-white" // Capsule active highlight
                      : isScrolled
                        ? "text-slate-400 hover:text-white" // Solid background text & hover
                        : "text-slate-600 hover:text-black" // Transparent background text & hover
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 
        Main content padding-top (pt-36) offset accounts for both headers.
        Saves content layout elements from overlapping.
      */}
      <div className={`flex-grow ${isSetupPage ? "pt-20 md:pt-24" : "pt-36"}`}>
        {renderContent()}
      </div>
      
      {/* Footer added to all pages */}
      <div className="mt-auto pt-10">
        <Footer />
      </div>
    </div>
  );
}
