"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ==========================================
// ICONS
// ==========================================
const UploadIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);
const ImagePlaceholderIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CATEGORIES = [
  "Operations",
  "Sales",
  "Admin",
  "Marketing",
  "Customer Support",
  "Finance",
  "Tech & Software",
  "Design"
];

export default function UploadMaterialForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFree, setIsFree] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/trainer/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          price: isFree ? 0 : parseFloat(formData.price),
          description: formData.description
        })
      });

      if (res.ok) {
        alert("Material uploaded successfully! It will now be reviewed by our admins.");
        router.push("/trainer/materials/my-materials");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to upload material"}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while uploading.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title.trim() !== "" && formData.category.trim() !== "" && (isFree || String(formData.price).trim() !== "") && formData.description.trim() !== "";

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
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        
        {/* Main Info Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                Material Title <span className="text-[#E84E29]">*</span>
              </label>
              <input 
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Masterclass: Real Estate Lead Generation"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-[#E84E29]/50 transition-all shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                Category <span className="text-[#E84E29]">*</span>
              </label>
              <select 
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-[#E84E29]/50 transition-all shadow-xs"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <label htmlFor="price" className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Price ($) {!isFree && <span className="text-[#E84E29]">*</span>}
                </label>
                <input 
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required={!isFree}
                  disabled={isFree}
                  placeholder={isFree ? "Free Course" : "e.g. 49.99"}
                  value={isFree ? "" : formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-[#E84E29]/50 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input 
                    type="checkbox" 
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E84E29] focus:ring-[#E84E29] border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">Make this course free</span>
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                Description <span className="text-[#E84E29]">*</span>
              </label>
              <textarea 
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Describe what your material covers and who it's for..."
                value={formData.description}
                onChange={handleInputChange}
                className="resize-none w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-[#E84E29]/50 transition-all shadow-xs"
              />
            </div>
          </div>

        </div>

        {/* Upload Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* File Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                Course File (PDF, MP4) <span className="text-[#E84E29]">*</span>
              </label>
              <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 hover:border-[#E84E29] hover:bg-orange-50/50 transition-colors cursor-pointer group">
                <div className="text-center">
                  <UploadIcon className="mx-auto h-10 w-10 text-slate-400 group-hover:text-[#E84E29] transition-colors" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-[#E84E29] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#E84E29] focus-within:ring-offset-2 hover:text-orange-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" required />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">MP4, PDF, ZIP up to 500MB</p>
                </div>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                Cover Thumbnail <span className="text-[#E84E29]">*</span>
              </label>
              <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 hover:border-[#E84E29] hover:bg-orange-50/50 transition-colors cursor-pointer group">
                <div className="text-center">
                  <ImagePlaceholderIcon className="mx-auto h-10 w-10 text-slate-400 group-hover:text-[#E84E29] transition-colors" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600">
                    <label
                      htmlFor="thumbnail-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-[#E84E29] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#E84E29] focus-within:ring-offset-2 hover:text-orange-500"
                    >
                      <span>Upload an image</span>
                      <input id="thumbnail-upload" name="thumbnail-upload" type="file" className="sr-only" accept="image/*" required />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 10MB</p>
                  <p className="text-[10px] text-slate-400 mt-1">Recommended size: 1200 x 600px</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

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
            disabled={isSubmitting || !isFormValid}
            className={`px-8 py-3 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${
              isSubmitting || !isFormValid 
                ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                : "bg-[#E84E29] hover:bg-[#d03d1c] text-white shadow-md shadow-orange-500/10 active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? "Uploading..." : "Submit for Review"}
          </button>
        </div>

      </form>
    </>
  );
}
