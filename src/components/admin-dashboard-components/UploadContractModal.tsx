import React, { useState } from "react";

type UploadContractModalProps = {
  isOpen: boolean;
  contractId: string | null;
  onClose: () => void;
  onSubmit: (contractId: string, fileUrl: string) => Promise<void>;
};

export default function UploadContractModal({
  isOpen,
  contractId,
  onClose,
  onSubmit,
}: UploadContractModalProps) {
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !contractId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl.trim()) return;

    setLoading(true);
    try {
      await onSubmit(contractId, fileUrl.trim());
      setFileUrl("");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to upload contract.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">Upload Contract</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Provide the link to the final contract document for {contractId}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Document URL
            </label>
            <input
              type="url"
              required
              placeholder="e.g., https://docs.google.com/..."
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29] focus:border-[#E84E29]"
            />
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              Paste a link to a Google Doc, Dropbox PDF, or any cloud-hosted document that the Client and VA can access.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !fileUrl.trim()}
              className="px-6 py-2 bg-[#E84E29] hover:bg-[#DA431E] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Link"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
