import { useState, useEffect } from "react";
import Link from "next/link";
import { IconCompass, IconPlayerPlay } from "../StudentIcons";
import StudentTrainingPaymentModal from "./StudentTrainingPaymentModal";

export function BrowseTrainingFeed() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [purchaseModalData, setPurchaseModalData] = useState<{courseId: string, price: number} | null>(null);
  const [loadingEnrollId, setLoadingEnrollId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetch("/api/student/trainings");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setTrainings(json.data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const fetchPurchases = async () => {
      try {
        const res = await fetch("/api/student/training/purchases");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setEnrolledCourses(data.map((item: any) => item.courseId));
          }
        }
      } catch (e) {
        console.error("Failed to load purchases:", e);
      }
    };

    fetchTrainings();
    fetchPurchases();
  }, []);

  const enrollInCourse = async (id: string) => {
    setLoadingEnrollId(id);
    try {
      const res = await fetch("/api/student/training/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to enroll in course.");
      }

      const updated = [...enrolledCourses, id];
      setEnrolledCourses(updated);
      
      const progressDb = localStorage.getItem("student_course_progress");
      const currentProgress = progressDb ? JSON.parse(progressDb) : {};
      currentProgress[id] = 0;
      localStorage.setItem("student_course_progress", JSON.stringify(currentProgress));

      window.dispatchEvent(new Event("courseEnrollmentUpdate"));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingEnrollId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs relative">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <IconCompass className="text-slate-700 w-5 h-5" stroke={2} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Browse Courses</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Discover new courses posted by top trainers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm font-medium">Loading courses...</div>
        ) : trainings.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm font-medium">No courses available right now.</div>
        ) : (
          trainings.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const isLoading = loadingEnrollId === course.id;

            return (
              <div key={course.id} className="group rounded-2xl flex flex-col border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="h-32 bg-slate-100 relative">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover mix-blend-multiply" />
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
                        <img src={course.instructor.avatarUrl} alt={course.instructor.name} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                          {course.instructor?.name?.charAt(0) || "I"}
                        </div>
                      )}
                      <span className="text-[10px] font-medium text-slate-500">{course.instructor?.name || "Instructor"}</span>
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
                      <Link href="/student/my-learning" className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer">
                        Go to My Learning
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
        )}
      </div>

      <StudentTrainingPaymentModal 
        isOpen={!!purchaseModalData}
        onClose={() => setPurchaseModalData(null)}
        courseId={purchaseModalData?.courseId || ""}
        price={purchaseModalData?.price || 0}
      />
    </div>
  );
}
