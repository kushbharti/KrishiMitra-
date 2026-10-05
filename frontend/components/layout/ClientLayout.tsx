"use client";

import React from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/layout/TopBar";

/**
 * ClientLayout — the minimal client boundary for pathname-based routing.
 *
 * Why this exists:
 *   `usePathname` requires a Client Component. Rather than marking the entire
 *   root layout as "use client" (which opted the whole app shell out of Server
 *   Components and metadata export), we isolate the pathname check here.
 *
 *   The root layout.tsx remains a Server Component and can export `metadata`,
 *   improving SEO and First Contentful Paint.
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Public marketing and auth routes render without the workspace TopBar
  const isPublicRoute =
    pathname === "/" || pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isPublicRoute || isAdminRoute) {
    // PUBLIC OR ADMIN ROUTE: Render without Farmer TopBar.
    // Admin routing handles its own layout internally.
    return (
      <main
        className={`min-h-screen w-full font-sans ${
          isPublicRoute ? "bg-[#0A100D] overflow-x-hidden" : ""
        }`}
      >
        {children}
      </main>
    );
  }

  // AUTHENTICATED FARMER ROUTE: Navbar-driven SaaS Workspace Layout
  return (
    <div className="flex flex-col min-h-screen w-full font-sans">
      <TopBar />
      <main className="flex-1 w-full overflow-auto bg-[#ECF0F1]">
        {children}
      </main>
    </div>
  );
}
