"use client";

import { useState, useRef, useEffect } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { StatusBadge } from "../../../../components/shared/StatusBadge";

type Shortlist = {
  id: string;
  name: string;
  job: string;
  niche: string;
  match: string;
  status: string;
};

export default function ShortlistsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Card height is approx 120px + 16px gap = 136px per row
  // Because it's a 2-column grid, we multiply the vertical rows that fit by 2 to get itemsPerPage
  // Offset ~160px for header/pagination.
  const rowsPerPage = useDynamicPagination(containerRef, 136, 160, 4);
  const itemsPerPage = rowsPerPage * 2; 
  
  const fetchShortlists = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/shortlists");
      const data = await res.json();
      if (data.shortlists) {
        setShortlists(data.shortlists);
      }
    } catch (err) {
      console.error("Error fetching shortlists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlists();
  }, []);

  const totalPages = Math.ceil(shortlists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentShortlists = shortlists.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }


  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shortlists</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">VAs forwarded to clients after passing initial interview.</p>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 pb-2 relative">
            {loading && shortlists.length === 0 ? (
              <div className="col-span-2 absolute inset-0 flex items-center justify-center bg-white/50 z-10 min-h-[200px]">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : currentShortlists.length === 0 ? (
              <div className="col-span-2 py-10 text-center text-slate-500 font-medium">No shortlists found.</div>
            ) : currentShortlists.map((app) => (
              <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative hover:shadow-md transition-shadow h-[120px] flex flex-col justify-center">
                
                {/* Status Badge */}
                <div className="absolute top-5 right-5">
                  <StatusBadge status={app.status} />
                </div>

                {/* Info */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 mb-1">{app.id}</p>
                  <h3 className="text-base font-black text-slate-900">{app.name}</h3>
                  <p className="text-xs font-medium text-slate-600 mt-1.5">
                    {app.job} · {app.niche} · <span className="font-bold text-slate-800">{app.match} match</span>
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Pagination Container */}
        <div className="flex-shrink-0 pt-4 pb-2">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
      
    </div>
  );
}
