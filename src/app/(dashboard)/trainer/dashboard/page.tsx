"use client";

import TrainerLeftSidebar from "../../../../components/trainer-dashboard-components/dashboard/TrainerLeftSidebar";
import TrainerMainFeed from "../../../../components/trainer-dashboard-components/dashboard/TrainerMainFeed";
import TrainerRightSidebar from "../../../../components/trainer-dashboard-components/dashboard/TrainerRightSidebar";

export default function TrainerDashboardPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        <TrainerLeftSidebar />
        <TrainerMainFeed />
        <TrainerRightSidebar />
      </div>
    </div>
  );
}
