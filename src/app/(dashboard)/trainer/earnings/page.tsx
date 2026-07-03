"use client";

import TrainerLeftSidebar from "../../../../components/trainer-dashboard-components/TrainerLeftSidebar";
import { TrainerEarningsPanel } from "../../../../components/trainer-dashboard-components/earnings/TrainerEarningsPanel";

export default function TrainerEarningsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <TrainerLeftSidebar />
          </div>
        </div>

        {/* Main Feed (9 cols) */}
        <div className="md:col-span-9 flex flex-col gap-6">
          <TrainerEarningsPanel />
        </div>

      </div>
    </div>
  );
}
