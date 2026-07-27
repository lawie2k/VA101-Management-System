"use client";

import { SettingsPanel } from "../../../../components/shared/SettingsPanel";

export default function AdminSettingsPage() {
  return (
    <div className="h-full flex flex-col">
      <SettingsPanel role="admin" />
    </div>
  );
}
