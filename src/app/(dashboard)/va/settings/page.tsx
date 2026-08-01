"use client";

import { Suspense } from "react";
import { UserSettingsPanel } from "../../../../components/shared/UserSettingsPanel";

export default function VASettingsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E84E29]"></div>
        </div>
      }>
        <UserSettingsPanel role="va" showPayouts={true} />
      </Suspense>
    </div>
  );
}
