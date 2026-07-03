"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FormHeader from "../../../components/layout/FormHeader";
import Footer from "../../../components/layout/Footer";

const navItems = [
  { label: "Dashboard", href: "/client/dashboard" },
  { label: "Company Profile", href: "/client/profile" },
  { label: "Post a Job", href: "/client/post-job" },
  { label: "My Jobs", href: "/client/jobs" },
  { label: "Candidates", href: "/client/shortlisted-candidates" },
  { label: "Interviews", href: "/client/interviews" },
  { label: "Contracts", href: "/client/contracts" },
  { label: "Payments", href: "/client/payments" },
  { label: "Settings", href: "/client/settings" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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

  // Loading guard for authenticated pages
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E84E29]"></div>
      </div>
    );
  }

  // Determine if we show navigation tabs. We only show tabs if the user is authenticated.
  // If they are on discovery-calls and NOT logged in, we render the page as guest (no tabs).
  const showNav = isAuthenticated;
  const isSetupPage = pathname === "/client/profile/setup-profile-form";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Dynamic transparent-to-solid FormHeader */}
      <FormHeader isDashboard={true} />

      {/* 
        Secondary client navigation bar (only visible if logged in).
        Height matches FormHeader top offsets.
      */}
      {showNav && !isSetupPage && (
        <div className={`fixed top-[72px] md:top-[80px] left-0 w-screen z-40 py-2.5 transition-all duration-300 ${
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
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                    isActive 
                      ? "bg-[#E84E29] text-white animate-fade-in" // Capsule active highlight (brand orange for client)
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
        Main content padding-top:
        If showing navigation, padding matches double headers offset (pt-36).
        If guest booking page (no navigation) or setup page, padding matches single header offset (pt-24 / pt-20).
      */}
      <div className={`flex-grow ${isSetupPage ? "pt-20 md:pt-24" : (showNav ? "pt-36" : "pt-24")} transition-all duration-300`}>
        {children}
      </div>
      
      {/* Footer added to all pages */}
      <div className="mt-auto pt-10">
        <Footer />
      </div>
    </div>
  );
}
