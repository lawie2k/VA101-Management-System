"use client";

import StudentLeftSidebar from "../../../../components/student-dashboard-components/dashboard/StudentLeftSidebar";
import { BrowseTrainingFeed } from "../../../../components/student-dashboard-components/training/BrowseTrainingFeed";
import { BrowseTrainingRightSidebar } from "../../../../components/student-dashboard-components/training/BrowseTrainingRightSidebar";

export default function BrowseTrainingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <StudentLeftSidebar />
          </div>
        </div>

        {/* Main Feed (6 cols) */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <BrowseTrainingFeed />
        </div>

        {/* Right Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <BrowseTrainingRightSidebar />
          </div>
        </div>

      </div>
    </div>
  );
}
