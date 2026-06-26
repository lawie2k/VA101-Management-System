"use client";

import { useState } from "react";
import Link from "next/link";
import FormHeader from "../../../components/layout/FormHeader";

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#FAF6F0] min-h-screen flex flex-col items-center">
      <div className="w-screen h-130 bg-[#000312] bg-[linear-gradient(93deg,#000312_55%,#021959_100%)] flex flex-col items-center  px-6 md:px-0">
        {/*header*/}
          <FormHeader />
        <div className="w-full max-w-5xl  flex flex-col justify-center">
          <div className="mt-20 ">
            <h1 className="text-white text-5xl font-semibold py-2">Start your journey as a Virtual <br/> Assistant</h1>
            <p className="text-gray-400 mt-2">
                Work remotely, choose your niche, complete a guided onboarding, <br/> and get matched with clients around the world.
            </p>
              <div className="flex items-center gap-4 mt-8">
                  <Link href="/apply-va/onboarding" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-md cursor-pointer">
                    Start Application
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <Link href="/login" className="border border-white/20 hover:border-white/40 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/5 transition-all cursor-pointer">
                    Login
                  </Link>
              </div>
          </div>
        </div>
      </div>

      {/* Why apply as a VA? Section */}
      <div className="w-full max-w-5xl my-20 px-6 md:px-0">
        <h2 className="text-3xl font-bold text-gray-900">Why apply as a VA?</h2>
        <p className="text-gray-500 mt-2 text-base">
          Build a flexible career with the support of an established VA agency.
        </p>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50/70 flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Work remotely</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Set your own schedule from anywhere in the world.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50/70 flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Real clients</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Get matched with vetted clients that fit your niche.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50/70 flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Grow your skills</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Free training resources and a supportive VA community.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50/70 flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Steady income</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Earn competitive pay with reliable, on-time payouts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VA Niches We Support Section */}
        <div className="bg-[#FAF9F5] w-screen justify-center items-center flex border-2 border-gray-200">
      <div className="w-full max-w-5xl my-20 px-6 md:px-0">
        <h2 className="text-3xl font-bold text-gray-900">VA niches we support</h2>
        <p className="text-gray-500 mt-2 text-base">
          Choose the niche that fits your strengths. You can add more later.
        </p>

        {/* Niches Pills */}
        <div className="flex flex-wrap gap-3 mt-8">
          {[
            "General Admin VA",
            "Executive Assistant",
            "Customer Support",
            "Social Media Manager",
            "Content Writer",
            "Graphic Design",
            "Video Editing",
            "Bookkeeping",
            "Real Estate VA",
            "E-commerce / Shopify",
            "Lead Generation",
            "SEO & Marketing"
          ].map((niche) => (
            <span
              key={niche}
              className="bg-white border border-gray-200/80 text-gray-800 px-5 py-2.5 rounded-full text-sm font-medium shadow-2xs transition-all hover:border-orange-300 hover:text-orange-950 cursor-default"
            >
              {niche}
            </span>
          ))}
        </div>
      </div>
        </div>

      {/* How Onboarding Works Section */}
      <div className="w-full max-w-5xl my-20 px-6 md:px-0">
        <h2 className="text-3xl font-bold text-gray-900">How onboarding works</h2>
        <p className="text-gray-500 mt-2 text-base">
          A guided 6-step flow. Save progress and finish whenever you're ready.
        </p>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { step: 1, title: "Signup", desc: "Create your VA101 account in seconds." },
            { step: 2, title: "Choose niche", desc: "Pick the role and skills that match you." },
            { step: 3, title: "Assessment", desc: "Take a short test so we can showcase your skills." },
            { step: 4, title: "Requirements", desc: "Upload your IDs, NBI clearance, and resume." },
            { step: 5, title: "Interview", desc: "Meet with our team for a quick interview." },
            { step: 6, title: "Get approved", desc: "Activate your profile and start getting matched." }
          ].map((item) => (
            <div key={item.step} className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#000829] flex items-center justify-center text-white text-xs font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* What you'll need Section */}
        <div className="bg-[#FAF9F5] w-screen justify-center items-center flex border-2 border-gray-200">
      <div className="w-full  max-w-5xl my-20 px-6 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">What you&#39;ll need</h2>
            <p className="text-gray-500 mt-2 text-base">
              Have these ready before you start to finish onboarding faster.
            </p>

            <div className="bg-white border border-orange-200/60 rounded-3xl p-5 flex items-start gap-3 mt-8 shadow-xs max-w-md">
              <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-600 leading-relaxed">
                You can upload documents during onboarding or come back later.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-3">
            {[
              "Government-issued ID",
              "NBI / Police Clearance",
              "Updated resume / CV",
              "Proof of address",
              "Working laptop & stable internet",
              "Active email & phone number"
            ].map((req) => (
              <div
                key={req}
                className="bg-white border border-gray-200/80 rounded-2xl py-4 px-5 flex items-center gap-3.5 shadow-2xs"
              >
                <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-800">{req}</span>
              </div>
            ))}
          </div>
        </div>
            </div>
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="w-full max-w-5xl my-20 px-6 md:px-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Frequently asked questions</h2>
          <p className="text-gray-500 mt-2 text-base">
            Everything you need to know before applying.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200/80 border-t border-b border-gray-200/80">
          {[
            {
              id: 1,
              q: "Is there a fee to apply?",
              a: "No, applying to VA101 is completely free. We will never ask you for any fees during the application, assessment, or matching process."
            },
            {
              id: 2,
              q: "How long does onboarding take?",
              a: "The onboarding process can be completed at your own pace. If you have all your documents ready, the initial steps (signup, choosing a niche, and assessment) take less than an hour. The review and matching typically take a few days."
            },
            {
              id: 3,
              q: "Can I apply if I have no experience?",
              a: "Yes! While prior VA experience is a plus, we support entry-level applicants. We look for strong communication skills, eagerness to learn, and professionalism. We also provide free training resources to help you grow."
            },
            {
              id: 4,
              q: "How do I get paid?",
              a: "Payments are processed securely and on-time. You will receive payouts directly to your preferred payment method (such as Wise, PayPal, or local bank transfer) based on your contract terms."
            },
            {
              id: 5,
              q: "What happens after I submit?",
              a: "Our talent team will review your application and assessment results. If there's a match with our client requirements, we'll reach out to schedule a quick interview to get you approved."
            }
          ].map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left font-semibold text-gray-800 hover:text-orange-600 transition-colors py-2 cursor-pointer font-sans"
                >
                  <span className="text-base font-semibold">{faq.q}</span>
                  <svg
                    className={`w-4.5 h-4.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-orange-500" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-sm text-gray-500 leading-relaxed pb-2">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ready to Start CTA Section */}
      <div className="w-screen bg-[#000312] bg-[linear-gradient(93deg,#000312_55%,#021959_100%)] flex flex-col items-center justify-center py-20 px-6 text-center border-t border-white/5">
        <svg className="w-12 h-12 text-orange-500 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>

        <h2 className="text-3xl font-bold text-white tracking-tight">Ready to start?</h2>
        <p className="text-gray-400 mt-3 text-sm max-w-md leading-relaxed">
          Create your VA101 account and finish onboarding at your own pace. Most VAs are approved within a week.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link href="/apply-va/onboarding" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-md cursor-pointer">
            Start Application
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <Link href="/login" className="border border-white/20 hover:border-white/40 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/5 transition-all cursor-pointer">
            I already have an account
          </Link>
        </div>

        <a
          href="https://www.virtualassistant101.com/"
          className="text-xs text-gray-500 hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer mt-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </a>
      </div>
    </div>
  );
}
