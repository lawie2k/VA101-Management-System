"use client";

import ClientLeftSidebar from "../../../../components/client-dashboard-components/ClientLeftSidebar";
import SettingsMainFeed from "../../../../components/client-dashboard-components/settings/SettingsMainFeed";
import SettingsRightSidebar from "../../../../components/client-dashboard-components/settings/SettingsRightSidebar";

export default function ClientSettingsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        <ClientLeftSidebar />
        <SettingsMainFeed />
        <SettingsRightSidebar />
      </div>
    </div>
  );
}
