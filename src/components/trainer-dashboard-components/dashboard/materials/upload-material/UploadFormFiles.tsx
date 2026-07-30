import { UploadIcon, ImagePlaceholderIcon } from "./UploadIcons";

export default function UploadFormFiles() {
  return (
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
              </div>
              <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 10MB</p>
              <p className="text-[10px] text-slate-400 mt-1">Recommended size: 1200 x 600px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
