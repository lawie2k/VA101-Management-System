"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TrainerLeftSidebar from "../../../../components/trainer-dashboard-components/TrainerLeftSidebar";
import TrainerMainFeed from "../../../../components/trainer-dashboard-components/dashboard/TrainerMainFeed";
import TrainerRightSidebar from "../../../../components/trainer-dashboard-components/dashboard/TrainerRightSidebar";

export default function TrainerDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkSetup() {
      const savedProfile = localStorage.getItem("trainer_profile_data");
      if (savedProfile) {
        try {
          const data = JSON.parse(savedProfile);
          if (data.status === "draft" || !data.fullName) {
            router.replace("/trainer/profile/setup-profile-form");
            return;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          const res = await fetch("/api/trainer/profile");
          if (res.ok) {
            const data = await res.json();
            if (data && data.status !== "draft" && data.fullName) {
              localStorage.setItem("trainer_profile_data", JSON.stringify(data));
            } else {
              router.replace("/trainer/profile/setup-profile-form");
            }
          } else if (res.status === 404) {
            router.replace("/trainer/profile/setup-profile-form");
          }
        } catch (e) {
          console.error("Failed to fetch trainer profile in dashboard", e);
        }
      }
    }
    checkSetup();
  }, [router]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-144px)] overflow-visible lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-visible lg:overflow-hidden">
        <TrainerLeftSidebar hideOnMobile={true} />
        <TrainerMainFeed />
        <TrainerRightSidebar />
      </div>
    </div>
  );
}
