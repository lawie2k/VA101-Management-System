import { useState, useEffect } from "react";
import { IconBook2, IconPlayerPlay } from "../StudentIcons";

export function MyLearningFeed() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const res = await fetch("/api/student/learning");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setCourses(json.data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLearning();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <IconBook2 className="text-slate-700 w-5 h-5" stroke={2} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">My Learning</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Access your enrolled courses and track progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm font-medium">Loading your courses...</div>
        ) : courses.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm font-medium">You haven't enrolled in any courses yet.</div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="h-32 bg-slate-100 relative">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover mix-blend-multiply" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                )}
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="px-2 py-1 bg-emerald-500 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    Enrolled
                  </span>
                </div>
              </div>
              <div className="p-4">
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
                  {course.description || "Continue where you left off."}
                </p>
                <div className="mb-4">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#E84E29] h-full rounded-full transition-all" style={{ width: `${course.progress || 0}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                    <span className="text-[10px] font-bold text-slate-700">{course.progress || 0}%</span>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-[#E84E29] hover:bg-[#DA431E] border border-transparent text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm">
                  <IconPlayerPlay className="w-4 h-4" fill="currentColor" />
                  Continue Course
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
