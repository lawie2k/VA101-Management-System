"use client";

import ClientLeftSidebar from "../../../../components/client-dashboard-components/ClientLeftSidebar";
import InterviewsMainFeed from "../../../../components/client-dashboard-components/interviews/InterviewsMainFeed";
import InterviewsRightSidebar from "../../../../components/client-dashboard-components/interviews/InterviewsRightSidebar";

export default function InterviewsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-144px)] overflow-visible lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-visible lg:overflow-hidden">
        <ClientLeftSidebar hideOnMobile={true} />
        <InterviewsMainFeed />
        <InterviewsRightSidebar />
      </div>
    </div>
  );
}
