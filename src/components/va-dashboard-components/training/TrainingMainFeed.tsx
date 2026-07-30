"use client";

import React, { useState } from "react";
import Link from "next/link";
import VATrainingPaymentModal from "./VATrainingPaymentModal";

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
  price: number;
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
  const [purchaseModalData, setPurchaseModalData] = useState<{courseId: string, price: number} | null>(null);
  return (
    <main 
      onScroll={(e) => {
        window.dispatchEvent(new CustomEvent("feedScroll", { detail: { scrollTop: e.currentTarget.scrollTop } }));
      }}
      className="lg:col-span-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-none space-y-6 pb-6"
    >
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Course Catalog</h2>
        <p className="text-xs font-semibold text-slate-450 mt-1">Enroll in specialized training modules to unlock certifications and match high-paying client contracts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.length > 0 ? (
          courses.map((course: any) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const isLoading = loadingEnrollId === course.id;

            return (
              <div key={course.id} className="group flex flex-col rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 bg-white">
                <div className="h-32 bg-slate-100 relative">
                  {course.thumbnailUrl || course.thumbnail_url ? (
                    <img src={course.thumbnailUrl || course.thumbnail_url} alt={course.title} className="w-full h-full object-cover mix-blend-multiply" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  )}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="px-2 py-1 bg-[#E84E29] rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {!course.price || course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {course.instructor?.avatarUrl ? (
                        <img src={course.instructor.avatarUrl} alt={course.instructor?.name || "Instructor"} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                          {course.instructor?.name?.charAt(0) || (typeof course.instructor === 'string' ? course.instructor.charAt(0) : "I")}
                        </div>
                      )}
                      <span className="text-[10px] font-medium text-slate-500">{course.instructor?.name || (typeof course.instructor === 'string' ? course.instructor : "Instructor")}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-[#E84E29] transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                      {course.description || "Learn new skills with this comprehensive training course."}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    {isEnrolled ? (
                      <Link href="/va/my-learning" className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer">
                        Go to My Learning <IconChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : course.price > 0 ? (
                      <button 
                        onClick={() => setPurchaseModalData({ courseId: course.id, price: course.price })}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all cursor-pointer shadow-xs disabled:opacity-60"
                      >
                        Buy Course
                      </button>
                    ) : (
                      <button 
                        onClick={() => enrollInCourse(course.id)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E84E29] hover:bg-[#DA431E] transition-all cursor-pointer shadow-xs disabled:opacity-60"
                      >
                        {isLoading ? "Enrolling..." : "Enroll for Free"}
                      </button>
                    )}
                  </div>
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

      <VATrainingPaymentModal 
        isOpen={!!purchaseModalData}
        onClose={() => setPurchaseModalData(null)}
        courseId={purchaseModalData?.courseId || ""}
        price={purchaseModalData?.price || 0}
      />
    </main>
  );
}
