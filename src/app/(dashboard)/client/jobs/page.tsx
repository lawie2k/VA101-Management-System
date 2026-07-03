"use client";

import ClientLeftSidebar from "../../../../components/client-dashboard-components/ClientLeftSidebar";
import JobsMainFeed from "../../../../components/client-dashboard-components/jobs/JobsMainFeed";
import JobsRightSidebar from "../../../../components/client-dashboard-components/jobs/JobsRightSidebar";

export default function ClientJobsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        <ClientLeftSidebar />
        <JobsMainFeed />
        <JobsRightSidebar />
      </div>
    </div>
  );
}
