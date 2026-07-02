import React from "react";
import { PCard, PCardHeader, Button } from "./ProfileUI";
import { IconMail, IconPhone, IconPencil } from "./ProfileIcons";

interface StudentBasicInfoProps {
  email: string;
  phone: string;
  openModal: () => void;
}

export function StudentBasicInfo({ email, phone, openModal }: StudentBasicInfoProps) {
  return (
    <PCard className="hover:border-slate-350">
      <PCardHeader 
        title="Basic Information" 
        action={
          <Button variant="ghost" size="sm" className="rounded-full p-2" onClick={openModal}>
            <IconPencil className="h-4 w-4 text-slate-500" />
          </Button>
        } 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col justify-between p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl min-h-[120px] transition-all hover:bg-white hover:border-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-orange-50 border border-orange-100 text-[#E84E29]">
              <IconMail className="h-4.5 w-4.5" />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
          </div>
          <div className="mt-3.5">
            <span className="text-sm font-extrabold text-slate-800 break-all">{email || "Not configured"}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl min-h-[120px] transition-all hover:bg-white hover:border-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-orange-50 border border-orange-100 text-[#E84E29]">
              <IconPhone className="h-4.5 w-4.5" />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</span>
          </div>
          <div className="mt-3.5">
            <span className="text-sm font-extrabold text-slate-800 break-words">{phone || "Not configured"}</span>
          </div>
        </div>
      </div>
    </PCard>
  );
}
