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

  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/client/dashboard-stats");
        if (res.ok) {
          const data = await res.json();
          setJobPosts(data.jobPosts || []);
          setShortlistedCandidates(data.shortlistedCandidates || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-144px)] overflow-hidden">

      {/* Portal 3-Column LinkedIn-Style Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-hidden">
        
        <ClientLeftSidebar />

        <ClientMainFeed
          companyName={companyName}
          jobPosts={jobPosts}
          shortlistedCandidates={shortlistedCandidates}
        />

        <ClientRightSidebar />

      </div>
    </div>
  );
}
