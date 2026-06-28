"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FormHeader from "../../../components/layout/FormHeader";

const navItems = [
  { label: "Dashboard", href: "/va/dashboard" },
  { label: "My Profile", href: "/va/profile" },
  { label: "Jobs", href: "/jobs" },
  { label: "My Applications", href: "/va/applications" },
  { label: "Interviews", href: "/va/interviews" },
  { label: "Training", href: "/va/training" },
  { label: "My Learning", href: "/va/my-learning" },
];

export default function VaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Sync scroll detection to match standard FormHeader transparent transition threshold
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Dynamic transparent-to-solid FormHeader */}
      <FormHeader isDashboard={true} />

      {/* 
        Secondary role tab navigation bar (positioned directly underneath the header).
        Height matches FormHeader top offsets.
      */}
      <div className="fixed top-[72px] md:top-[80px] left-0 w-screen z-40 py-2.5 transition-all duration-300">
        
        {/* Solid Background Layer (fades in on scroll) */}
        <div 
          className={`absolute inset-0 bg-[#000312] border-b border-[#1c1c1e] transition-opacity duration-300 -z-10 ${
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
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                  isActive 
                    ? "bg-[#4ade80] text-black" // Capsule active highlight
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

      {/* 
        Main content padding-top (pt-36) offset accounts for both headers.
        Saves content layout elements from overlapping.
      */}
      <div className="flex-grow pt-36">
        {children}
      </div>
    </div>
  );
}
