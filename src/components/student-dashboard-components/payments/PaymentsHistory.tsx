import { useState, useEffect } from "react";
import { IconCreditCard, IconReceipt } from "../StudentIcons";

export function PaymentsHistory() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/student/payments");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setPayments(json.data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Format date helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <IconCreditCard className="text-slate-700 w-5 h-5" stroke={2} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Payments</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            View your training purchase history
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm font-medium">Loading your payment history...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm font-medium">You have no payment history yet.</div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                  <IconReceipt className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-1">{payment.courseTitle}</h3>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                    <span>{formatDate(payment.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Ref: {payment.referenceNumber}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                <div className="text-left sm:text-right">
                  <div className="text-sm font-black text-slate-900">
                    ${payment.amountPaid.toFixed(2)} <span className="text-[10px] text-slate-500 font-bold ml-0.5">{payment.currency}</span>
                  </div>
                  <div className={`text-[10px] font-extrabold uppercase tracking-wide mt-0.5 ${payment.status === 'completed' || payment.status === 'active' || payment.status === 'unlocked' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {payment.status === 'unlocked' ? 'Completed' : payment.status}
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                  Invoice
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
