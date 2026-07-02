import { useState, useEffect } from "react";
import { IconCompass, IconPlayerPlay } from "../StudentIcons";

export function BrowseTrainingFeed() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchTrainings();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <IconCompass className="text-slate-700 w-5 h-5" stroke={2} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Browse Training</h1>
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
          trainings.map((course) => (
            <div key={course.id} className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="h-32 bg-slate-100 relative">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover mix-blend-multiply" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                )}
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="px-2 py-1 bg-[#E84E29] rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {course.price === 0 ? "Free" : `$${course.price}`}
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
                  {course.description || "Learn new skills with this comprehensive training course."}
                </p>
                <button className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer">
                  <IconPlayerPlay className="w-4 h-4 text-[#E84E29]" fill="currentColor" />
                  Preview Course
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
