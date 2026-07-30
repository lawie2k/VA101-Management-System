"use client";

import StudentLeftSidebar from "../../../../components/student-dashboard-components/StudentLeftSidebar";
import { MyLearningFeed } from "../../../../components/student-dashboard-components/my-learning/MyLearningFeed";
import { MyLearningRightSidebar } from "../../../../components/student-dashboard-components/my-learning/MyLearningRightSidebar";

export default function MyLearningPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <StudentLeftSidebar hideOnMobile={true} />
          </div>
        </div>

        {/* Main Feed (6 cols) */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <MyLearningFeed />
        </div>

        {/* Right Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <MyLearningRightSidebar />
          </div>
        </div>

      </div>
    </div>
  );
}
