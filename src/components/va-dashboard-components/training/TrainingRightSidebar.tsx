"use client";

import React, { useRef, useState } from "react";

interface Course {
  category: string;
}

interface PendingPurchase {
  purchaseId: string;
  courseId: string;
  amount: number;
  title: string;
  instructor: string;
  date: string;
}

interface TrainingRightSidebarProps {
  courses: Course[];
  pendingPurchases?: PendingPurchase[];
}

export default function TrainingRightSidebar({
  courses,
  pendingPurchases = [],
}: TrainingRightSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, purchaseId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(purchaseId);
    
    // In a real implementation, we would upload the file to S3 or similar and get a URL.
    // Here we'll simulate a delay and use a fake URL.
    setTimeout(async () => {
      try {
        const res = await fetch("/api/va/training/receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            purchaseId,
            receiptUrl: "https://example.com/fake-receipt.jpg" // Fake receipt URL
          })
        });

        if (res.ok) {
          alert("Receipt uploaded! Your course will be unlocked once an admin reviews it.");
          window.dispatchEvent(new Event("trainingPurchaseAdded")); // trigger refresh
        } else {
          alert("Failed to upload receipt.");
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading receipt.");
      } finally {
        setUploadingId(null);
      }
    }, 1500);
  };

  const handleCancelPurchase = async (purchaseId: string) => {
    if (!confirm("Are you sure you want to cancel this purchase? You will need to start the purchase process again.")) return;
    
    try {
      const res = await fetch(`/api/va/training/buy?purchaseId=${purchaseId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        window.dispatchEvent(new Event("trainingPurchaseAdded")); // trigger refresh
      } else {
        alert("Failed to cancel purchase.");
      }
    } catch (err) {
      console.error(err);
      alert("Error canceling purchase.");
    }
  };

  return (
    <aside className="lg:col-span-3 h-full overflow-y-auto scrollbar-none space-y-6 pb-6">
      
      {pendingPurchases.length > 0 && (
        <div className="bg-white border border-[#E84E29]/20 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Action Required</h3>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Upload receipts to unlock your courses</p>
          </div>

          <div className="space-y-4">
            {pendingPurchases.map(purchase => (
              <div key={purchase.purchaseId} className="p-4 bg-orange-50 border border-[#E84E29]/20 rounded-2xl relative">
                <p className="text-xs font-bold text-slate-900 leading-tight mb-1">{purchase.title}</p>
                <p className="text-[10px] text-slate-500 font-medium mb-3">Total: <strong className="text-slate-800">${purchase.amount.toFixed(2)}</strong></p>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, purchase.purchaseId)}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingId === purchase.purchaseId}
                    className="flex-1 text-center px-3 py-2 bg-white border border-[#E84E29] text-[#E84E29] hover:bg-[#E84E29] hover:text-white transition-colors text-[10px] font-bold rounded-xl shadow-xs disabled:opacity-60"
                  >
                    {uploadingId === purchase.purchaseId ? "Uploading..." : "Upload Receipt"}
                  </button>
                  <button 
                    onClick={() => handleCancelPurchase(purchase.purchaseId)}
                    disabled={uploadingId === purchase.purchaseId}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-[10px] font-bold rounded-xl disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Courses Highlights</h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Accredited VA101 Catalog</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Total Courses</span>
            <span className="text-sm font-black text-slate-800">{courses.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Core Modules</span>
            <span className="text-sm font-black text-[#E84E29]">{courses.filter(c => c.category === "Core Training").length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-150 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Specializations</span>
            <span className="text-sm font-black text-slate-800">{courses.filter(c => c.category !== "Core Training").length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
