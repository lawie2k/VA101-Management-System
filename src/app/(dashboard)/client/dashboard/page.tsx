"use client";

import { useState, useEffect } from "react";
import ClientLeftSidebar from "../../../../components/client-dashboard-components/dashboard/ClientLeftSidebar";
import ClientMainFeed from "../../../../components/client-dashboard-components/dashboard/ClientMainFeed";
import ClientRightSidebar from "../../../../components/client-dashboard-components/dashboard/ClientRightSidebar";

export default function ClientDashboardPage() {
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("client_profile_data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompanyName(data.companyName || "");
      } catch (e) {
        console.error("Failed to parse client profile:", e);
      }
    }
  }, []);

  // Mock data — will be replaced with live API data in backend phase
  const mockJobPosts: {
    id: string;
    title: string;
    type: string;
    rate: number;
    status: "active" | "draft" | "closed";
    applicants: number;
    postedDate: string;
  }[] = [];

  const mockShortlisted: {
    id: string;
    name: string;
    title: string;
    location: string;
    rating: number;
    skills: string[];
    hourlyRate: number;
    avatar: string | null;
  }[] = [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">

      {/* Portal 3-Column LinkedIn-Style Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        
        <ClientLeftSidebar />

        <ClientMainFeed
          companyName={companyName}
          jobPosts={mockJobPosts}
          shortlistedCandidates={mockShortlisted}
        />

        <ClientRightSidebar />

      </div>
    </div>
  );
}
