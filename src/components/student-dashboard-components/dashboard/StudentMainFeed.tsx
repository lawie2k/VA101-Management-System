"use client";

import { useEffect, useState } from "react";
import { IconSparkles, IconPlayerPlay, IconChevronRight } from "../StudentIcons";

export default function StudentMainFeed() {
  const [profile, setProfile] = useState<{ fullName: string }>({ fullName: "Student" });

  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("student_profile_data");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    const fetchTrainings = async () => {
      try {
        const res = await fetch("/api/student/trainings");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setTrainings(json.data.slice(0, 2)); // Only show top 2 in featured
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
    <div className="w-full flex flex-col gap-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#E84E29] via-[#E84E29] to-orange-400 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black rounded-full mix-blend-overlay filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white mb-4 border border-white/20 shadow-sm">
            <IconSparkles className="w-3.5 h-3.5" />
            Welcome Back
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Ready to learn, {profile.fullName.split(' ')[0]}?
          </h1>
        </div>
      </div>

      {/* Recommended Trainings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Featured Trainings</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Courses highly recommended for you</p>
          </div>
          <button className="text-[#E84E29] text-xs font-bold flex items-center hover:underline">
            View All <IconChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {loading ? (
            <div className="col-span-2 text-center py-8 text-slate-500 text-sm font-medium">Loading featured courses...</div>
          ) : trainings.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-slate-500 text-sm font-medium">No courses available right now.</div>
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
      
    </div>
  );
}
