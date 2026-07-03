"use client";

import VALeftSidebar from "../../../../components/va-dashboard-components/VALeftSidebar";
import { SettingsPanel } from "../../../../components/va-dashboard-components/settings/SettingsPanel";

export default function VASettingsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <VALeftSidebar />
          </div>
        </div>

        {/* Main Feed (9 cols) */}
        <div className="md:col-span-9 flex flex-col gap-6">
          <SettingsPanel />
        </div>

      </div>
    </div>
  );
}
