"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "./UploadIcons";
import UploadFormDetails from "./UploadFormDetails";
import UploadFormFiles from "./UploadFormFiles";

export default function UploadMaterialForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Operations",
    price: "",
    description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission process
    setTimeout(() => {
      alert("Material uploaded successfully! It will now be reviewed by our admins.");
      router.push("/trainer/materials/my-materials");
    }, 1000);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4">
    
        
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Upload New Material</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Share your expertise! All new materials are reviewed by admins before being published to the marketplace.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        
        <UploadFormDetails formData={formData} handleInputChange={handleInputChange} />
        <UploadFormFiles />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/trainer/materials/my-materials"
            className="px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#E84E29] hover:bg-[#d03d1c] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-md shadow-orange-500/10 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Uploading..." : "Submit for Review"}
          </button>
        </div>

      </form>
    </>
  );
}
