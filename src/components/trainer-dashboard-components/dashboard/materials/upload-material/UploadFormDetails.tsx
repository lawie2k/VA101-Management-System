export const CATEGORIES = [
  "Operations",
  "Sales",
  "Admin",
  "Marketing",
  "Customer Support",
  "Finance",
  "Tech & Software",
  "Design"
];

export default function UploadFormDetails({ formData, handleInputChange }: { formData: any, handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void }) {
  return (
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
          <label htmlFor="price" className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
            Price ($) <span className="text-[#E84E29]">*</span>
          </label>
          <input 
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="e.g. 49.99"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-[#E84E29]/50 transition-all shadow-xs"
          />
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
            className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-[#E84E29]/50 transition-all shadow-xs"
          />
        </div>
      </div>
    </div>
  );
}
