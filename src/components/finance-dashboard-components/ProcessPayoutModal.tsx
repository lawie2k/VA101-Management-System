import { useState } from "react";
import { useToast, Toast } from "../shared/useToast";

type ProcessPayoutModalProps = {
  isOpen: boolean;
  payout: any | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ProcessPayoutModal({ isOpen, payout, onClose, onSuccess }: ProcessPayoutModalProps) {
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [payslipUrl, setPayslipUrl] = useState("");
  const [fileName, setFileName] = useState("");

  if (!isOpen || !payout) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/finance/payouts/${payout.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", payslip_url: payslipUrl })
      });
      
      if (res.ok) {
        onSuccess();
        onClose();
        setPayslipUrl("");
      } else {
        const err = await res.json();
        showToast("Failed: " + (err.error || "Unknown error"), "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating payout.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/finance/upload-receipt", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        setPayslipUrl(data.url);
        showToast("Receipt uploaded successfully", "success");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to upload receipt", "error");
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Process Payout</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {payout.payoutMethod ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">Payout Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Method:</span>
                  <span className="font-black text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200">{payout.payoutMethod.method_type}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Account Name:</span>
                  <span className="font-bold text-slate-900">{payout.payoutMethod.account_name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Account Number:</span>
                  <span className="font-mono font-bold text-slate-900 bg-amber-50 text-amber-900 px-2 py-1 rounded-md border border-amber-200">{payout.payoutMethod.masked_details}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-2">
              <p className="text-sm font-bold text-red-800 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                No Payout Method Set
              </p>
              <p className="text-xs text-red-600 mt-1 font-medium">This staff member hasn't configured their payout details yet.</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Upload Transfer Receipt <span className="text-red-500">*</span></label>
            
            {!payslipUrl ? (
              <label htmlFor="receipt-upload" className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'bg-slate-50 border-slate-300' : 'bg-slate-50 border-slate-300 hover:border-[#E84E29] hover:bg-orange-50/50'}`}>
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-[#E84E29]/30 border-t-[#E84E29] rounded-full animate-spin mb-2"></div>
                    <span className="text-sm font-semibold text-slate-600">Uploading {fileName}...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <span className="text-sm font-semibold text-slate-700">Click to upload receipt image</span>
                    <span className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 5MB</span>
                  </div>
                )}
                <input id="receipt-upload" type="file" className="sr-only" onChange={handleFileUpload} disabled={uploading} accept="image/*,application/pdf" />
              </label>
            ) : (
              <div className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Receipt Uploaded</p>
                    <p className="text-xs text-emerald-600 font-medium truncate max-w-[200px]">{fileName}</p>
                  </div>
                </div>
                <button type="button" onClick={() => { setPayslipUrl(""); setFileName(""); }} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors">
                  Replace
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || !payslipUrl}
              className="flex-1 px-4 py-3 bg-[#DA431E] hover:bg-[#DA431E] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              Mark as Paid
            </button>
          </div>
        </form>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
