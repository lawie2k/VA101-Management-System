import React from "react";
import Image from "next/image";

export default function PaymentQRPageContent({ method = "Payment" }: { method?: string }) {
  let qrImageSrc = "";
  let brandColor = "";
  let accountDetails = "";

  switch (method) {
    case "GCash":
      qrImageSrc = "/QR/gcash.webp";
      brandColor = "bg-blue-600";
      accountDetails = "+63 966 288 5243";
      break;
    case "Maya":
      qrImageSrc = "/QR/Maya.webp";
      brandColor = "bg-green-600";
      accountDetails = "+63 966 288 5243";
      break;
    case "Coins.ph":
      qrImageSrc = "/QR/coins.webp";
      brandColor = "bg-orange-600";
      accountDetails = "+63 966 288 5243";
      break;
    default:
      qrImageSrc = "";
      brandColor = "bg-slate-600";
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-center relative">
        <div className={`p-8 ${brandColor} text-white`}>
          <h1 className="text-2xl font-black mb-1">{method} Payment</h1>
          <p className="text-xs font-medium opacity-80">Scan the QR code below to pay.</p>
        </div>

        <div className="p-10 space-y-6">
          <div className="w-56 h-56 mx-auto bg-slate-100 rounded-2xl border-2 border-slate-200 flex items-center justify-center relative overflow-hidden">
            {qrImageSrc ? (
              <Image 
                src={qrImageSrc} 
                alt={`${method} QR Code`} 
                fill 
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 224px"
              />
            ) : (
              <span className="text-sm font-bold text-slate-400">QR Code Not Found</span>
            )}
          </div>

          {accountDetails && (
            <div className="bg-slate-100 px-4 py-3 rounded-xl border border-slate-200 inline-block">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Account Number</p>
              <p className="text-sm font-extrabold text-slate-800 tracking-wide">{accountDetails}</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500">After successfully scanning and paying, please screenshot your receipt and upload it back in the dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
