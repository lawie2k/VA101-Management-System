"use client";

export default function Footer() {
  return (
    <footer className="bg-[#000312] bg-[linear-gradient(93deg,#000312_55%,#021959_100%)] text-[#9B9BA1] font-sans text-xs w-full pt-12 md:pt-16 px-6 md:px-20 border-t border-[#1C1C1E]">
      <div className="max-w-6xl mx-auto">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Column 1: Logo & Tagline */}
          <div className="flex flex-col gap-3">
            <img 
              src="/logo/VA101%20logo2%20bg%20remove.svg"
              className="w-40 h-auto"
              alt="VA101 Logo" 
            />

          </div>

          {/* Column 2: ABOUT VA101 */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">ABOUT VA101</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="https://www.virtualassistant101.com/p/about-us.html" className="hover:text-white transition-colors">Leadership</a></li>
              <li><a href="https://www.virtualassistant101.com/p/company-registration.html" className="hover:text-white transition-colors">Company Registration</a></li>
              <li><a href="https://www.virtualassistant101.com/p/standard-operating-procedure.html" className="hover:text-white transition-colors">Standard Ops Procedures</a></li>
              <li><a href="https://www.virtualassistant101.com/p/data-processing-agreement.html" className="hover:text-white transition-colors">Data Processing Agreement</a></li>
              <li><a href="https://www.virtualassistant101.com/p/non-disclosure-agreement.html" className="hover:text-white transition-colors">Non-Disclosure Agreement</a></li>
            </ul>
          </div>

          {/* Column 3: SERVICES */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">SERVICES</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="https://www.virtualassistant101.com/p/free-va-101-training.html" className="hover:text-white transition-colors">VA101 Trainings</a></li>
              <li><a href="https://www.virtualassistant101.com/p/services.html" className="hover:text-white transition-colors">VA101 Workshops</a></li>
              <li><a href="https://www.reddit.com/r/VA101Community/" className="hover:text-white transition-colors">VA101 Community</a></li>
              <li><a href="https://www.virtualassistant101.com/p/services.html" className="hover:text-white transition-colors">VA101 Staffing</a></li>
            </ul>
          </div>

          {/* Column 4: RESOURCES */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">RESOURCES</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="https://www.virtualassistant101.com/p/resume-checker-tool.html" className="hover:text-white transition-colors">Check My Resume</a></li>
              <li><a href="https://www.virtualassistant101.com/p/virtual-assistant-101-career-profiler.html" className="hover:text-white transition-colors">VA Niche Guide</a></li>
              <li><a href="https://www.virtualassistant101.com/p/do-you-need-virtual-assistant-take-free.html" className="hover:text-white transition-colors">Find my Ideal VA</a></li>
            </ul>
          </div>

          {/* Column 5: SOCIAL MEDIA */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">SOCIAL MEDIA</h4>
            <div className="grid grid-cols-3 gap-2 w-full max-w-[124px]">
              
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/va101globalsolutions/"
                className="w-9 h-9 border border-[#27272A] rounded-full flex items-center justify-center text-[#9B9BA1] hover:text-white hover:border-[#4B4B52] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/profile.php?id=61562922176485"
                className="w-9 h-9 border border-[#27272A] rounded-full flex items-center justify-center text-[#9B9BA1] hover:text-white hover:border-[#4B4B52] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a 
                href="https://www.pinterest.com/virtualassistant101community/"
                className="w-9 h-9 border border-[#27272A] rounded-full flex items-center justify-center text-[#9B9BA1] hover:text-white hover:border-[#4B4B52] transition-colors"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.162 0 7.397 2.967 7.397 6.93 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@virtualassistant_101"
                className="w-9 h-9 border border-[#27272A] rounded-full flex items-center justify-center text-[#9B9BA1] hover:text-white hover:border-[#4B4B52] transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.01c1.306-.022 2.616-.01 3.921-.018.06 1.485.49 2.926 1.3 4.168.91 1.394 2.29 2.412 3.89 2.862v3.9c-1.517-.066-2.99-.6-4.22-1.51-.55-.41-.99-.9-1.35-1.47v6.6c.036 1.945-.486 3.893-1.524 5.507-1.16 1.802-3.03 3.062-5.13 3.492-2.31.478-4.75.143-6.84-1-2.288-1.247-3.95-3.522-4.51-6.082-.56-2.56-.09-5.26 1.3-7.5 1.5-2.43 4.01-3.9 6.89-3.91 1.05-.004 2.1.18 3.09.55V4.6c-1.12-.41-2.32-.58-3.51-.49-1.89.14-3.69.96-5 2.29-1.45 1.48-2.27 3.5-2.27 5.6 0 2.21.9 4.3 2.5 5.8 1.6 1.5 3.8 2.3 6 2.3 2.09-.03 4.1-.9 5.5-2.4 1.48-1.6 2.23-3.8 2.1-6V.01z" />
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://www.youtube.com/channel/UC485tBvH6Wnvy7OMlO8Cpfg"
                className="w-9 h-9 border border-[#27272A] rounded-full flex items-center justify-center text-[#9B9BA1] hover:text-white hover:border-[#4B4B52] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.525 3.545 12 3.545 12 3.545s-7.525 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.026 0 12 0 12s0 3.974.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.863.508 9.388.508 9.388.508s7.525 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.974 24 12 24 12s0-3.974-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* X */}
              <a 
                href="https://x.com/VA101Official"
                className="w-9 h-9 border border-[#27272A] rounded-full flex items-center justify-center text-[#9B9BA1] hover:text-white hover:border-[#4B4B52] transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

            </div>
          </div>

        </div>

        {/* Separator */}
        <hr className="border-[#1C1C1E] my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-[#6B6B72] text-[11px]">
            © 2026 Virtual Assistants 101. All Rights reserved
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-[#6B6B72]">
            <a href="#" className="hover:text-gray-300 transition-colors">Opt-In/Opt-Out</a>
            <span className="text-[#27272A]">|</span>
            <a 
              href="https://www.virtualassistant101.com/p/privacy-policy.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-[#27272A]">|</span>
            <a href="https://www.virtualassistant101.com/p/cookie-policy.html" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
            <span className="text-[#27272A]">|</span>
            <a href="https://www.virtualassistant101.com/p/terms-and-conditions.html" className="hover:text-gray-300 transition-colors">Terms and Conditions</a>
            <span className="text-[#27272A]">|</span>
            <a href="https://www.virtualassistant101.com/p/brand-guidelines.html" className="hover:text-gray-300 transition-colors">Virtual Assistant 101 Brand Guidelines</a>
            <span className="text-[#27272A]">|</span>
            <a href="https://www.virtualassistant101.com/p/earnings-disclaimer.html" className="hover:text-gray-300 transition-colors">Earnings Disclaimer</a>
            <span className="text-[#27272A]">|</span>
            <a href="https://www.virtualassistant101.com/p/sitemap.html" className="hover:text-gray-300 transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
