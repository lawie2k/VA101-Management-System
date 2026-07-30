"use client";

import React from "react";

const IconCheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const COURSE_INFOS = {
  "c-1": { title: "VA101 Professional Ethics & Standards", category: "Core Training", lessons: ["Professional Communication", "Client Privacy & NDAs", "Reporting Activity Logs", "Managing Boundaries"], invoice: "INV-1029", amount: 0, paymentDate: "2026-06-10", classStartDate: "2026-06-15" },
  "c-2": { title: "Advanced Client Lead Generation Strategies", category: "Marketing & Sales", lessons: ["Lead Profile Target Research", "Cold Email Outbox Setup", "Scripting High Conversion Mail", "Outreach Analytics tracking"], invoice: "INV-1035", amount: 49.99, paymentDate: "2026-07-01", classStartDate: "2026-07-05" },
  "c-3": { title: "CRM Administration & Contact Matrix Handling", category: "Operations", lessons: ["CRM Dashboard Basics", "Lead Pipeline Management", "Properties and Tagging", "Automation Triggers"], invoice: "INV-1040", amount: 29.99, paymentDate: "2026-07-15", classStartDate: "2026-07-20" },
  "c-4": { title: "Shopify Store Support & Inventory Handling", category: "E-commerce Support", lessons: ["Shopify Dashboard Overview", "Fulfillment Operations", "Return & Refund Policy", "Zendesk Integration"], invoice: "INV-1042", amount: 39.99, paymentDate: "2026-07-18", classStartDate: "2026-07-25" }
};

interface LearningMainFeedProps {
  courses?: any[];
  enrolledCourses: string[];
  courseProgress: Record<string, number>;
  setActiveCourseId: (id: string | null) => void;
  setActiveLessonIndex: (index: number) => void;
}

export default function LearningMainFeed({
  courses = [],
  enrolledCourses,
  courseProgress,
  setActiveCourseId,
  setActiveLessonIndex,
}: LearningMainFeedProps) {
  return (
    <main 
      onScroll={(e) => {
        window.dispatchEvent(new CustomEvent("feedScroll", { detail: { scrollTop: e.currentTarget.scrollTop } }));
      }}
      className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6"
    >
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">My Learning Portal</h2>
        <p className="text-xs font-semibold text-slate-450 mt-1">Review active courses, complete lessons to build rating strength, and download certification tokens.</p>
      </div>

      <div className="space-y-4">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((id) => {
            let info = null;
            const dynamicCourse = courses.find(c => c.id === id);
            if (dynamicCourse) {
              info = {
                title: dynamicCourse.title,
                category: dynamicCourse.category || "General",
                lessons: ["Course Material Overview", "Full Video Lecture"],
                invoice: `INV-${id.substring(0, 4)}`,
                amount: dynamicCourse.price === 0 ? 0 : dynamicCourse.price || 0,
                paymentDate: dynamicCourse.createdAt || new Date().toISOString(),
                classStartDate: dynamicCourse.createdAt || new Date().toISOString()
              };
            } else {
              const key = !id.startsWith("c-") ? `c-${id}` : id;
              info = COURSE_INFOS[key as keyof typeof COURSE_INFOS];
            }
            if (!info) return null;
            
            const progress = courseProgress[id] || 0;
            const isCompleted = progress >= 100;

            return (
              <div key={id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-teal-650 bg-teal-50 border border-teal-100 rounded px-2.5 py-0.5">
                      {info.category}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight mt-2.5">{info.title}</h3>
                  </div>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                      <IconCheckCircle className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">In Progress</span>
                  )}
                </div>

                {/* Course Details (Invoice, Amount, Date) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-slate-100 my-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Invoice No.</span>
                    <span className="text-slate-700 font-extrabold">{info.invoice}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Amount Paid</span>
                    <span className="text-[#E84E29] font-extrabold">${info.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Payment Date</span>
                    <span className="text-slate-700 font-extrabold">{new Date(info.paymentDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Class Start Date</span>
                    <span className="text-slate-700 font-extrabold">{new Date(info.classStartDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Course Progress</span>
                    <span className="text-slate-700">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold">
                    {Math.round((progress / 100) * info.lessons.length)} of {info.lessons.length} lessons finished
                  </span>
                  <button 
                    onClick={() => {
                      // Calculate active lesson index based on progress
                      const total = info.lessons.length;
                      const finishedCount = Math.floor((progress / 100) * total);
                      const activeIndex = finishedCount >= total ? total - 1 : finishedCount;
                      
                      setActiveCourseId(id);
                      setActiveLessonIndex(activeIndex);
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                  >
                    {isCompleted ? "Review Material" : "Continue Learning"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No Enrolled Courses</p>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              You are not currently enrolled in any courses. Explore the Training tab to join modular study tracks!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
