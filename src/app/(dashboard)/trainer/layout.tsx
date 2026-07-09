"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FormHeader from "../../../components/layout/FormHeader";
import Footer from "../../../components/layout/Footer";

const navItems = [
  { label: "Dashboard", href: "/trainer/dashboard" },
  { label: "My Profile", href: "/trainer/profile" },
  { label: "My Materials", href: "/trainer/materials/my-materials" },
  { label: "Upload Material", href: "/trainer/materials/upload-material" },
  { label: "Earnings", href: "/trainer/earnings" },
  { label: "Payout History", href: "/trainer/payouts" },
  { label: "Settings", href: "/trainer/settings" },
];

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync scroll detection to match standard FormHeader transparent transition threshold
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Layout auth check failed:", err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname, router]);

  const showNav = isAuthenticated || loading;
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
  const isSetupPage = pathname === "/trainer/profile/setup-profile-form";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Dynamic transparent-to-solid FormHeader */}
      <FormHeader isDashboard={true} />

      {/* Secondary navigation bar */}
      {showNav && !isSetupPage && (
        <div className={`fixed top-[72px] md:top-[80px] left-0 w-screen z-40 py-2.5 transition-all duration-300 ${
          isScrolled 
            ? "border-b border-[#1c1c1e]" 
            : "border-b border-slate-200"
        }`}>
          
          <div 
            className={`absolute inset-0 bg-[#000312] transition-opacity duration-300 -z-10 ${
              isScrolled ? "opacity-100 shadow-sm" : "opacity-0"
            }`} 
          />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                    isActive 
                      ? "bg-[#E84E29] text-white animate-fade-in"
                      : isScrolled
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content padding-top */}
      <div className={`flex-grow ${isSetupPage ? "pt-20 md:pt-24" : (showNav ? "pt-36" : "pt-24")} transition-all duration-300`}>
        {renderContent()}
      </div>
      
      {/* Footer added to all pages */}
      <div className="mt-auto pt-10">
        <Footer />
      </div>
    </div>
  );
}
