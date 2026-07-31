"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import GlobalNotices from "../shared/GlobalNotices";

interface FormHeaderProps {
  forceSolid?: boolean;
  isDashboard?: boolean;
  navItems?: { label: string; href: string }[];
}

const aboutItems = [
  { label: "About Us", href: "https://www.virtualassistant101.com/p/about-us.html" },
  { label: "FAQS", href: "https://www.virtualassistant101.com/p/faqs.html" },
  { label: "Feedback", href: "https://www.virtualassistant101.com/p/feedback.html" },
  { label: "Official Group", href: "https://www.virtualassistant101.com/p/official-group.html" },
  { label: "Vibe Check", href: "https://www.virtualassistant101.com/p/vibe-check.html" },
];

const servicesItems = [
  { label: "Digital Marketing Specialist", href: "https://www.virtualassistant101.com/p/digital-marketing-specialist.html" },
  { label: "Executive Virtual Assistant", href: "https://www.virtualassistant101.com/p/executive-virtual-assistant.html" },
  { label: "General Virtual Assistant", href: "https://www.virtualassistant101.com/p/general-virtual-assistant.html" },
  { label: "Graphics & Video Services", href: "https://www.virtualassistant101.com/p/graphics-video-services.html" },
  { label: "Online Tutorial Services", href: "https://www.virtualassistant101.com/p/online-tutorial-services.html" },
  { label: "Real Estate Virtual Assistant", href: "https://www.virtualassistant101.com/p/real-estate-virtual-assistant.html" },
  { label: "SEO Services", href: "https://www.virtualassistant101.com/p/seo-services.html" },
  { label: "Social Media Management", href: "https://www.virtualassistant101.com/p/social-media-management.html" },
  { label: "Video Editing Services", href: "https://www.virtualassistant101.com/p/video-editing-services.html" },
  { label: "Web Design Services", href: "https://www.virtualassistant101.com/p/web-design-services.html" },
];

export default function FormHeader({ forceSolid = false, isDashboard = false, navItems }: FormHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<"about" | "services" | "profile" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<"about" | "services" | null>(null);
  const [isScrolled, setIsScrolled] = useState(forceSolid);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [profileImage, setProfileImage] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  const isSetupPage = mounted && pathname.includes("/setup-profile-form");
  
  let basePath = userRole ? `/${userRole}` : "/va";
  if (pathname.startsWith("/trainer")) basePath = "/trainer";
  if (pathname.startsWith("/client")) basePath = "/client";
  if (pathname.startsWith("/student")) basePath = "/student";
  if (pathname.startsWith("/va")) basePath = "/va";

  const initials = profileName
    ? profileName.trim().split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "JD";

  useEffect(() => {
    async function loadProfile() {
      // 1. Try localStorage first for instant client render
      const saved = localStorage.getItem("va_profile_data");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setProfileImage(data.avatar || "");
          if (data.fullName) setProfileName(data.fullName);
          if (data.email) setProfileEmail(data.email);
          setIsAuthenticated(true);
          setUserRole("va");
        } catch (e) {
          console.error(e);
        }
      }

      // Also try client_profile_data for client users
      const clientSaved = localStorage.getItem("client_profile_data");
      if (clientSaved) {
        try {
          const data = JSON.parse(clientSaved);
          if (data.avatar) setProfileImage(data.avatar);
          if (data.companyName) setProfileName(data.companyName);
          if (data.billingEmail) setProfileEmail(data.billingEmail);
          setIsAuthenticated(true);
          setUserRole("client");
        } catch (e) {
          console.error(e);
        }
      }

      // Also try student_profile_data for student users
      const studentSaved = localStorage.getItem("student_profile_data");
      if (studentSaved) {
        try {
          const data = JSON.parse(studentSaved);
          if (data.avatarUrl) setProfileImage(data.avatarUrl);
          if (data.fullName) setProfileName(data.fullName);
          setIsAuthenticated(true);
          setUserRole("student");
        } catch (e) {
          console.error(e);
        }
      }

      // Also try trainer_profile_data for trainer users
      const trainerSaved = localStorage.getItem("trainer_profile_data");
      if (trainerSaved) {
        try {
          const data = JSON.parse(trainerSaved);
          if (data.avatar) setProfileImage(data.avatar);
          if (data.fullName) setProfileName(data.fullName);
          if (data.email) setProfileEmail(data.email);
          setIsAuthenticated(true);
          setUserRole("trainer");
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Fetch session from server to ensure accuracy and freshness
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const session = await res.json();
          if (session.authenticated && session.user) {
            setIsAuthenticated(true);
            const user = session.user;
            if (user.fullName) setProfileName(user.fullName);
            if (user.email) setProfileEmail(user.email);
            if (user.roles && user.roles.length > 0) {
              const role = user.roles[0].toLowerCase();
              if (role.includes("va")) setUserRole("va");
              else if (role.includes("client")) setUserRole("client");
              else if (role.includes("student")) setUserRole("student");
              else if (role.includes("trainer")) setUserRole("trainer");
            }
            
            let avatar = "";
            if (user.profilePhotoUrl) {
              if (user.profilePhotoUrl.startsWith("{")) {
                try {
                  const parsed = JSON.parse(user.profilePhotoUrl);
                  avatar = parsed.avatar || "";
                } catch {
                  avatar = user.profilePhotoUrl;
                }
              } else {
                avatar = user.profilePhotoUrl;
              }
            }
            // Only override avatar from server if it actually has a value
            // This prevents the API call from wiping a locally-set client avatar
            if (avatar) setProfileImage(avatar);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error("Failed to load session profile", err);
      }
    }

    loadProfile();
    window.addEventListener("storage", loadProfile);
    window.addEventListener("profileUpdate", loadProfile);
    window.addEventListener("clientProfileUpdate", loadProfile);
    window.addEventListener("studentProfileUpdate", loadProfile);
    window.addEventListener("trainerProfileUpdate", loadProfile);
    return () => {
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("profileUpdate", loadProfile);
      window.removeEventListener("clientProfileUpdate", loadProfile);
      window.removeEventListener("studentProfileUpdate", loadProfile);
      window.removeEventListener("trainerProfileUpdate", loadProfile);
    };
  }, []);

  useEffect(() => {
    if (forceSolid) return;
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
  }, [forceSolid]);

  const toggleDropdown = (menu: "about" | "services" | "profile") => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Clear profile caches
      localStorage.removeItem("client_profile_data");
      localStorage.removeItem("student_profile_data");
      localStorage.removeItem("trainer_profile_data");
      localStorage.removeItem("va_profile_data");
    } catch (e) {
      console.error(e);
    }
    // Hard redirect clears the Next.js client-side router cache and browser memory, replace prevents back button
    window.location.replace("/login");
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
            src="/logo/VA101%20logo1.svg"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="https://www.virtualassistant101.com/" className="text-gray-300 hover:text-white font-medium text-xs tracking-wider transition-colors">
            Home
          </a>

          {/* About Us Dropdown */}
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

        {/* Action Buttons / User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Always show Notices Bell on Desktop & Mobile if authenticated */}
          {(isDashboard || isAuthenticated) && (
            <div className="flex items-center">
              <GlobalNotices />
            </div>
          )}

          {/* Profile Dropdown is now visible on mobile & desktop */}
          {(isDashboard || isAuthenticated) && (
            <div className="relative">
              <button
                onClick={() => toggleDropdown("profile")}
                onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                className="flex items-center gap-2 focus:outline-none cursor-pointer group"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-[#E84E29] overflow-hidden transition-all group-hover:border-[#DA431E] shadow-sm flex items-center justify-center bg-slate-850">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-black text-white bg-gradient-to-br from-orange-500 to-amber-500 h-full w-full grid place-items-center">
                      {initials}
                    </span>
                  )}
                </div>
              </button>
              {activeDropdown === "profile" && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-[#090b16] border border-[#1c1c1e] rounded-xl shadow-xl py-3.5 px-1.5 flex flex-col z-50">
                  <div className="px-3 pb-3 mb-2 border-b border-[#1c1c1e]">
                    <p className="text-xs font-extrabold text-white">{profileName}</p>
                    <p className="text-[10px] text-gray-500 font-semibold mt-0.5 truncate">
                      {profileEmail}
                    </p>
                  </div>
                  
                  {/* Dynamic Nav Items or Fallback */}
                  {navItems ? (
                    navItems.map((item) => (
                      isSetupPage ? (
                        <span
                          key={item.href}
                          className="px-3 py-2 text-slate-500 cursor-not-allowed text-[11px] font-bold rounded-lg"
                          title="Please complete your profile setup first"
                        >
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-900/50 text-[11px] font-bold rounded-lg transition-all"
                        >
                          {item.label}
                        </Link>
                      )
                    ))
                  ) : (
                    <>
                      {isSetupPage ? (
                        <span className="px-3 py-2 text-slate-500 cursor-not-allowed text-[11px] font-bold rounded-lg" title="Please complete your profile setup first">Dashboard</span>
                      ) : (
                        <Link href={`${basePath}/dashboard`} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-900/50 text-[11px] font-bold rounded-lg transition-all">Dashboard</Link>
                      )}
                      {isSetupPage ? (
                        <span className="px-3 py-2 text-slate-500 cursor-not-allowed text-[11px] font-bold rounded-lg" title="Please complete your profile setup first">My Profile</span>
                      ) : (
                        <Link href={`${basePath}/profile`} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-900/50 text-[11px] font-bold rounded-lg transition-all">My Profile</Link>
                      )}
                    </>
                  )}
                  
                  <div className="border-t border-[#1c1c1e] my-1.5" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-[#E84E29] hover:text-[#DA431E] hover:bg-slate-900/50 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="hidden md:flex items-center gap-4">
            {isDashboard || isAuthenticated ? (
              /* Authenticated User Profile Dropdown */
              <>
                <a
                  href="/discovery-calls"
                  className="bg-[#E84E29] hover:bg-[#DA431E] text-white font-bold text-xs tracking-wider rounded-full px-5 py-2 transition-all flex items-center gap-1"
                >
                  Get started <span>↗</span>
                </a>
                
              </>
            ) : (
              /* Public Sign In & Get Started actions */
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white font-medium text-xs tracking-wider hover:border-gray-600 rounded-full px-5 py-2 transition-all"
                >
                  Sign in
                </Link>
                <a
                  href="/discovery-calls"
                  className="bg-[#E84E29] hover:bg-[#DA431E] text-white font-bold text-xs tracking-wider rounded-full px-5 py-3 transition-all flex items-center gap-1"
                >
                  Get started <span>↗</span>
                </a>
              </>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 justify-center items-center h-8 w-8 cursor-pointer pl-2"
            aria-label="Toggle Menu"
          >
            <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-[#000312] px-6 py-8 flex flex-col gap-6 overflow-y-auto z-40 animate-fade-in border-t border-[#1C1C1E]">
          <a href="https://www.virtualassistant101.com/" className="text-gray-300 hover:text-white font-bold text-sm tracking-wider">
            Home
          </a>

          {/* Mobile About Dropdown */}
          <div>
            <button
              onClick={() => setMobileSubmenu(mobileSubmenu === "about" ? null : "about")}
              className="text-gray-300 hover:text-white font-bold text-sm tracking-wider flex items-center gap-1 w-full text-left"
            >
              About Us <span>{mobileSubmenu === "about" ? "▲" : "▼"}</span>
            </button>
            {mobileSubmenu === "about" && (
              <div className="flex flex-col gap-3.5 pl-4 mt-3 border-l border-slate-800">
                {aboutItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white text-xs font-semibold"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Services Dropdown */}
          <div>
            <button
              onClick={() => setMobileSubmenu(mobileSubmenu === "services" ? null : "services")}
              className="text-gray-300 hover:text-white font-bold text-sm tracking-wider flex items-center gap-1 w-full text-left"
            >
              Services <span>{mobileSubmenu === "services" ? "▲" : "▼"}</span>
            </button>
            {mobileSubmenu === "services" && (
              <div className="flex flex-col gap-3.5 pl-4 mt-3 border-l border-slate-800">
                {servicesItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white text-xs font-semibold"
                  >
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

          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#1C1C1E]">
            {isDashboard || isAuthenticated ? (
              /* Mobile dashboard actions */
              <>
                {/* Remove Dashboard & Profile links from mobile drawer since they are in profile dropdown */}
                <a
                  href="/discovery-calls"
                  className="w-full text-center bg-[#E84E29] hover:bg-[#DA431E] text-white font-bold text-sm tracking-wider rounded-full py-2.5"
                >
                  Get started ↗
                </a>
              </>
            ) : (
              /* Mobile public actions */
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-gray-300 hover:text-white font-bold text-sm tracking-wider border border-[#1c1c1e] rounded-full py-2.5"
                >
                  Sign in
                </Link>
                <a
                  href="/discovery-calls"
                  className="w-full text-center bg-[#E84E29] hover:bg-[#DA431E] text-white font-bold text-sm tracking-wider rounded-full py-2.5"
                >
                  Get started ↗
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
