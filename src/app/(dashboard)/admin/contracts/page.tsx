"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDynamicPagination } from "../../../../hooks/useDynamicPagination";
import Pagination from "../../../../components/shared/Pagination";
import { StatusBadge } from "../../../../components/shared/StatusBadge";

// Simple Search SVG Icon component to avoid external dependencies
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

type Contract = {
  id: string;
  date: string;
  va: string;
  client: string;
  status: string;
  fileUrl: string;
  signedFileUrl: string | null;
};

export default function ContractsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const rowsPerPage = useDynamicPagination(containerRef, 146, 200, 4);
  const itemsPerPage = rowsPerPage * 2; 

  // Debounce search typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/contracts?search=${encodeURIComponent(debouncedSearch)}`);
      const data = await res.json();
      if (data.contracts) {
        setContracts(data.contracts);
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Reset pagination if search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);
  
  const totalPages = Math.ceil(contracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentContracts = contracts.slice(startIndex, startIndex + itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }



  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="mb-6 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Contracts</h1>
        </div>
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
            placeholder="Search VA or Client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Dynamic List Container */}
      <div ref={containerRef} className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 pb-2 relative">
            {loading && contracts.length === 0 ? (
              <div className="col-span-2 absolute inset-0 flex items-center justify-center bg-white/50 z-10 min-h-[200px]">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : currentContracts.length === 0 ? (
              <div className="col-span-2 py-10 text-center text-slate-500 font-medium">No contracts found.</div>
            ) : currentContracts.map((contract) => (
              <div key={contract.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative hover:shadow-md transition-shadow h-[130px] flex flex-col justify-between">
                
                {/* Status Badge */}
                <div className="absolute top-5 right-5">
                  <StatusBadge status={contract.status} />
                </div>

                {/* Info */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 mb-1">{contract.id} - Signed {contract.date}</p>
                  <h3 className="text-base font-black text-slate-900">
                    {contract.va} <span className="text-slate-400 font-normal">↔</span> {contract.client}
                  </h3>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    onClick={() => {
                      if (contract.fileUrl) window.open(contract.fileUrl, '_blank');
                    }}
                    disabled={!contract.fileUrl}
                    className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm">
                    Open
                  </button>
                  <button 
                    onClick={() => {
                      if (contract.signedFileUrl) window.open(contract.signedFileUrl, '_blank');
                    }}
                    disabled={!contract.signedFileUrl}
                    title={!contract.signedFileUrl ? "No signed PDF available" : ""}
                    className="px-3 py-1 bg-transparent hover:bg-slate-100 disabled:opacity-30 text-slate-600 text-xs font-bold rounded-lg transition-colors">
                    Signed PDF
                  </button>
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
