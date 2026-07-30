"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientLeftSidebar from "../../../../components/client-dashboard-components/ClientLeftSidebar";
import ClientMainFeed from "../../../../components/client-dashboard-components/dashboard/ClientMainFeed";
import ClientRightSidebar from "../../../../components/client-dashboard-components/dashboard/ClientRightSidebar";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [hasSignedContract, setHasSignedContract] = useState(true); // Default true so it doesn't flash
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState("");

  useEffect(() => {
    async function checkProfile() {
      try {
        const res = await fetch("/api/client/profile");
        if (res.status === 404) {
          router.replace("/client/profile/setup-profile-form");
          return;
        }
        const data = await res.json();
        if (!data.companyName) {
          router.replace("/client/profile/setup-profile-form");
        } else {
          setCompanyName(data.companyName);
          setHasSignedContract(!!data.hasSignedContract);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    checkProfile();
  }, [router]);

  const handleSignContract = async () => {
    if (!signature.trim()) return;
    try {
      setIsSigning(true);
      const res = await fetch("/api/client/sign-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature })
      });
      if (res.ok) {
        setHasSignedContract(true);
        // Force a page refresh to reset the auth session and fully unlock the layout wrapper
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigning(false);
    }
  };

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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-144px)] overflow-visible lg:overflow-hidden">

      {/* Portal 3-Column LinkedIn-Style Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full overflow-visible lg:overflow-hidden">
        
        <ClientLeftSidebar hideOnMobile={true} />

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
