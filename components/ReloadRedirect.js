"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ReloadRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we're already on the landing page, do nothing
    if (pathname === "/") return;

    // Check if the current page load was triggered by a refresh
    const navEntries = window.performance?.getEntriesByType("navigation");
    let isReload = false;
    
    if (navEntries && navEntries.length > 0) {
      isReload = navEntries[0].type === "reload";
    } else if (window.performance?.navigation?.type === 1) {
      // Fallback for older browser APIs
      isReload = true;
    }

    if (isReload) {
      router.push("/");
    }
  }, [pathname, router]);

  return null;
}
