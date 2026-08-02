"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function RoleGuard({ roles }: { roles: string[] }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;
    
    // Skip if not a protected route
    const isProtected = pathname.startsWith("/va") || 
                        pathname.startsWith("/client") || 
                        pathname.startsWith("/admin") || 
                        pathname.startsWith("/trainer") || 
                        pathname.startsWith("/finance");
                        
    if (!isProtected) return;
    
    let isAuthorized = false;
    if (pathname.startsWith("/va") && roles.includes("va")) isAuthorized = true;
    else if (pathname.startsWith("/client") && roles.includes("client")) isAuthorized = true;
    else if (pathname.startsWith("/admin") && (roles.includes("admin") || roles.includes("finance") || roles.includes("employee"))) isAuthorized = true;
    else if (pathname.startsWith("/trainer") && roles.includes("trainer")) isAuthorized = true;
    else if (pathname.startsWith("/finance") && roles.includes("finance")) isAuthorized = true;

    if (!isAuthorized) {
      // Force a full page reload to bust the Next.js client-side router cache
      // and let the server middleware properly redirect them.
      window.location.replace("/login");
    }
  }, [pathname, roles]);

  useEffect(() => {
    // 1. Force the Next.js router cache to refresh the server components for this route
    // This prevents showing stale data when switching accounts and pressing back
    router.refresh();

    // 2. Prevent BFCache from showing stale snapshot on back button
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  return null;
}
