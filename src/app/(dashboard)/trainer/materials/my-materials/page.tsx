"use client";

import TrainerMaterialsList from "../../../../../components/trainer-dashboard-components/my-materials/TrainerMaterialsList";

export default function TrainerMaterialsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-144px)] overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-none pb-12 space-y-6">
        <TrainerMaterialsList />
      </div>
    </div>
  );
}
