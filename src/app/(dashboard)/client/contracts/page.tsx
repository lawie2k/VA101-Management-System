"use client";

import ClientLeftSidebar from "../../../../components/client-dashboard-components/dashboard/ClientLeftSidebar";
import ContractsMainFeed from "../../../../components/client-dashboard-components/contracts/ContractsMainFeed";
import ContractsRightSidebar from "../../../../components/client-dashboard-components/contracts/ContractsRightSidebar";

export default function ContractsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        <ClientLeftSidebar />
        <ContractsMainFeed />
        <ContractsRightSidebar />
      </div>
    </div>
  );
}
