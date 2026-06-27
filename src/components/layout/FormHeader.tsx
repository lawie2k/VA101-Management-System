"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DropdownItem {
  label: string;
  href: string;
}

const aboutItems: DropdownItem[] = [
  { label: "About Us", href: "https://www.virtualassistant101.com/p/about-us.html" },
  { label: "Privacy Policy", href: "https://www.virtualassistant101.com/p/privacy-policy.html" },
  { label: "Data Breach Response Policy", href: "https://www.virtualassistant101.com/p/data-breach-response-policy.html" },
  { label: "Standard Operating Procedure", href: "https://www.virtualassistant101.com/p/standard-operating-procedure.html" },
  { label: "Earnings Disclaimer", href: "https://www.virtualassistant101.com/p/earnings-disclaimer.html" },
  { label: "Terms & Conditions", href: "https://www.virtualassistant101.com/p/terms-and-conditions.html" },
  { label: "Data Processing Agreement", href: "https://www.virtualassistant101.com/p/data-processing-agreement.html" },
  { label: "Non-Disclosure Agreement", href: "https://www.virtualassistant101.com/p/non-disclosure-agreement.html" },
];

const servicesItems: DropdownItem[] = [
  { label: "Services", href: "https://www.virtualassistant101.com/p/services.html" },
  { label: "Accounting Services", href: "https://www.virtualassistant101.com/p/accounting-services.html" },
  { label: "App Development Services", href: "https://www.virtualassistant101.com/p/app-development-services.html" },
  { label: "Appointment Setting Services", href: "https://www.virtualassistant101.com/p/appointment-setting-services.html" },
  { label: "Bookkeeping Services", href: "https://www.virtualassistant101.com/p/bookkeeping-services.html" },
  { label: "Customer Support Outsourcing", href: "https://www.virtualassistant101.com/p/customer-support-outsourcing.html" },
  { label: "Executive Virtual Assistant", href: "https://www.virtualassistant101.com/p/executive-virtual-assistant.html" },
  { label: "Graphic Design Services", href: "https://www.virtualassistant101.com/p/graphic-design-service.html" },
  { label: "Healthcare Virtual Assistant", href: "https://www.virtualassistant101.com/p/healthcare-virtual-assistant.html" },
  { label: "Insurance Virtual Assistant", href: "https://www.virtualassistant101.com/p/insurance-virtual-assistant.html" },
  { label: "Lead Generation Services", href: "https://www.virtualassistant101.com/p/lead-generation-services.html" },
  { label: "Online Fitness Instructors", href: "https://www.virtualassistant101.com/p/online-fitness-instructors.html" },
  { label: "Online Tutorial Services", href: "https://www.virtualassistant101.com/p/online-tutorial-services.html" },
  { label: "Real Estate Virtual Assistant", href: "https://www.virtualassistant101.com/p/real-estate-virtual-assistant.html" },
  { label: "SEO Services", href: "https://www.virtualassistant101.com/p/seo-services.html" },
  { label: "Social Media Management", href: "https://www.virtualassistant101.com/p/social-media-management.html" },
  { label: "Video Editing Services", href: "https://www.virtualassistant101.com/p/video-editing-services.html" },
  { label: "Web Design Services", href: "https://www.virtualassistant101.com/p/web-design-services.html" },
];

export default function FormHeader() {
  const [activeDropdown, setActiveDropdown] = useState<"about" | "services" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<"about" | "services" | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (menu: "about" | "services") => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header className="fixed top-0 left-0 w-screen z-50 px-6 py-4 md:px-12 transition-all duration-300">
      {/* Solid Background Layer (visible on scroll) */}
      <div 
        className={`absolute inset-0 bg-[#000312] border-b border-[#1C1C1E] shadow-sm transition-opacity duration-300 -z-10 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`} 
      />
      {/* Gradient Fade Layer (visible at top) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-[#000312]/95 via-[#000312]/50 to-transparent transition-opacity duration-300 -z-10 ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`} 
      />
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="https://www.virtualassistant101.com/" className="flex items-center">
          <img 
            alt="VA 101 Logo" 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiP96kTcTyhmHwJa22OPsARosGQ-HM4ngHtwXt8eoEcM9mYmYXs5n_iOA4mMc4XTzwuew0V57H3wi77AQ4tmp5FpFguXibxs02ZfY5S0MyKyLQWf5tSYOBWg24ClpFiA7JO-Oqa6p63H6_SRlaay-CayDW_gpmhHlRTeYGndWref8gxNIwxL73pqCHhoC4/s993/received_1356092126542779-removebg-preview.png"
            className="h-10 md:h-12 w-auto"
          />
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="https://www.virtualassistant101.com/" className="text-gray-300 hover:text-white font-medium text-xs tracking-wider transition-colors">
            Home
          </a>

          {/* About Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("about")}
              onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
              className="text-gray-300 hover:text-white font-medium text-xs tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            >
              About Us <span className="text-[9px]">▼</span>
            </button>
            {activeDropdown === "about" && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-[#090b16] border border-[#1c1c1e] rounded-xl shadow-xl py-2 flex flex-col z-50">
                {aboutItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-900/50 text-[11px] font-semibold transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("services")}
              onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
              className="text-gray-300 hover:text-white font-medium text-xs tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            >
              Services <span className="text-[9px]">▼</span>
            </button>
            {activeDropdown === "services" && (
              <div className="absolute top-full left-0 mt-3 w-56 max-h-[350px] overflow-y-auto bg-[#090b16] border border-[#1c1c1e] rounded-xl shadow-xl py-2 flex flex-col z-50">
                {servicesItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-900/50 text-[11px] font-semibold transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="https://www.virtualassistant101.com/p/podcast.html" className="text-gray-300 hover:text-white font-medium text-xs tracking-wider transition-colors">
            Podcast
          </a>
          <a href="https://www.virtualassistant101.com/p/blog.html" className="text-gray-300 hover:text-white font-medium text-xs tracking-wider transition-colors">
            Blog
          </a>
          <a href="https://www.virtualassistant101.com/p/contact-us.html" className="text-gray-300 hover:text-white font-medium text-xs tracking-wider transition-colors">
            Contact Us
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-gray-300 hover:text-white font-medium text-xs tracking-wider hover:border-gray-600 rounded-full px-5 py-2 transition-all"
          >
            Sign in
          </Link>
          <a
            href="https://www.virtualassistant101.com/p/contact-us.html"
            className="bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs tracking-wider rounded-full px-5 py-2 transition-all flex items-center gap-1"
          >
            Get started <span>↗</span>
          </a>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 justify-center items-center h-8 w-8 cursor-pointer"
          aria-label="Toggle Menu"
        >
          <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-screen bg-[#070912] border-b border-[#1c1c1e] px-6 py-6 flex flex-col gap-4 z-50 animate-fade-in">
          <a href="https://www.virtualassistant101.com/" className="text-gray-300 hover:text-white font-bold text-sm tracking-wider">
            Home
          </a>

          {/* Mobile About */}
          <div>
            <button
              onClick={() => setMobileSubmenu(mobileSubmenu === "about" ? null : "about")}
              className="text-gray-300 hover:text-white font-bold text-sm tracking-wider w-full text-left flex justify-between items-center"
            >
              About Us <span>{mobileSubmenu === "about" ? "▲" : "▼"}</span>
            </button>
            {mobileSubmenu === "about" && (
              <div className="pl-4 mt-2 flex flex-col gap-2.5 border-l border-[#1c1c1e]">
                {aboutItems.map((item) => (
                  <a key={item.label} href={item.href} className="text-gray-400 hover:text-white text-xs font-semibold">
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Services */}
          <div>
            <button
              onClick={() => setMobileSubmenu(mobileSubmenu === "services" ? null : "services")}
              className="text-gray-300 hover:text-white font-bold text-sm tracking-wider w-full text-left flex justify-between items-center"
            >
              Services <span>{mobileSubmenu === "services" ? "▲" : "▼"}</span>
            </button>
            {mobileSubmenu === "services" && (
              <div className="pl-4 mt-2 flex flex-col gap-2.5 max-h-[250px] overflow-y-auto border-l border-[#1c1c1e]">
                {servicesItems.map((item) => (
                  <a key={item.label} href={item.href} className="text-gray-400 hover:text-white text-xs font-semibold">
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="https://www.virtualassistant101.com/p/podcast.html" className="text-gray-300 hover:text-white font-bold text-sm tracking-wider">
            Podcast
          </a>
          <a href="https://www.virtualassistant101.com/p/blog.html" className="text-gray-300 hover:text-white font-bold text-sm tracking-wider">
            Blog
          </a>
          <a href="https://www.virtualassistant101.com/p/contact-us.html" className="text-gray-300 hover:text-white font-bold text-sm tracking-wider">
            Contact Us
          </a>

          <div className="flex flex-col gap-3 mt-4 pt-4 ">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-gray-300 hover:text-white font-bold text-sm tracking-wider border border-[#1c1c1e] rounded-full py-2.5"
            >
              Sign in
            </Link>
            <a
              href="https://www.virtualassistant101.com/p/contact-us.html"
              className="w-full text-center bg-orange-500 text-white font-bold text-sm tracking-wider rounded-full py-2.5"
            >
              Get started ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
