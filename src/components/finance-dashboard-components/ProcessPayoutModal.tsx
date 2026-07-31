import { useState } from "react";
import { useToast, Toast } from "../shared/useToast";

type ProcessPayoutModalProps = {
  isOpen: boolean;
  payoutId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ProcessPayoutModal({ isOpen, payoutId, onClose, onSuccess }: ProcessPayoutModalProps) {
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [payslipUrl, setPayslipUrl] = useState("");

  if (!isOpen || !payoutId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/finance/payouts/${payoutId}`, {
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
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Receipt / Payslip URL (Optional)</label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E84E29]/20 focus:border-[#E84E29] transition-all"
              value={payslipUrl}
              onChange={e => setPayslipUrl(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-2 font-medium">Link to a cloud storage proof of payment (Dropbox, GDrive, etc.)</p>
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
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#DA431E] hover:bg-[#DA431E] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
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
