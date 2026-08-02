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
                <a 
                  href={`/secure-viewer?url=${encodeURIComponent(course.materialUrl || "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKER1bW15IFBERikKLUNyZWF0b3IgKER1bW15KQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs0IDAgUl0KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMCA1IDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA1OTUuMjc2IDg0MS44OV0KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQzCj4+CnN0cmVhbQpCVAovRjAgMjQgVGYKMTAwIDcwMCBUZAooU2FtcGxlIFBERiBDb3VudGVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAwOSAwMDAwMCBuCjAwMDAwMDAwNzQgMDAwMDAgbgowMDAwMDAwMTIzIDAwMDAwIG4KMDAwMDAwMDE3OSAwMDAwMCBuCjAwMDAwMDAyOTYgMDAwMDAgbgowMDAwMDAwMzg0IDAwMDAwIG4KdHJhaWxlcgo8PAovU2l6ZSA3Ci9Sb290IDIgMCBSCj4+CnN0YXJ0eHJlZgo0NzcKJSVFT0YK")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#E84E29] hover:bg-[#DA431E] border border-transparent text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Read Course Material
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
