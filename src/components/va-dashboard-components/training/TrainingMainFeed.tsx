"use client";

import React from "react";
import Link from "next/link";

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface Course {
  id: string;
  category: string;
  title: string;
  instructor: string;
  lessons: number;
  description: string;
  skills: string[];
}

interface TrainingMainFeedProps {
  courses: Course[];
  enrolledCourses: string[];
  loadingEnrollId: string | null;
  enrollInCourse: (id: string) => void;
}

export default function TrainingMainFeed({
  courses,
  enrolledCourses,
  loadingEnrollId,
  enrollInCourse,
}: TrainingMainFeedProps) {
  return (
    <main 
      onScroll={(e) => {
        window.dispatchEvent(new CustomEvent("feedScroll", { detail: { scrollTop: e.currentTarget.scrollTop } }));
      }}
      className="lg:col-span-6 h-full overflow-y-auto scrollbar-none space-y-6 pb-6"
    >
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Course Catalog</h2>
        <p className="text-xs font-semibold text-slate-450 mt-1">Enroll in specialized training modules to unlock certifications and match high-paying client contracts.</p>
      </div>

      <div className="space-y-6">
        {courses.length > 0 ? (
          courses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const isLoading = loadingEnrollId === course.id;

            return (
              <div key={course.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-slate-350 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-orange-650 bg-orange-50 border border-orange-100 rounded-md px-2.5 py-0.5">
                        {course.category}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug mt-3">{course.title}</h3>
                      <p className="text-xs text-slate-450 font-semibold mt-0.5">Instructor: <strong className="text-slate-700">{course.instructor}</strong> • {course.lessons} Lessons</p>
                    </div>
                    <span className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/50 flex items-center justify-center text-xl shrink-0">🎓</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-4">
                    {course.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {course.skills?.map((skill: string) => (
                      <span key={skill} className="px-2.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200/50 rounded-md">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-650 bg-emerald-50 border border-emerald-100 rounded-md px-2.5 py-1">Free Course</span>
                  {isEnrolled ? (
                    <Link href="/va/my-learning" className="inline-flex items-center gap-1.5 px-5.5 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer">
                      Go to My Learning <IconChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button 
                      onClick={() => enrollInCourse(course.id)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-5.5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      {isLoading ? "Enrolling..." : "Enroll in Course"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No Courses Available</p>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              There are no training courses listed in the catalog at the moment. Please check back later!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
