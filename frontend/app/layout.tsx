"use client";

import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

// Enterprise developer font stack with crisp geometric tracking
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Public marketing and auth routes render without the workspace TopBar
  const isPublicRoute =
    pathname === "/" || pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={plusJakarta.variable}
    >
      <body
        className={`${plusJakarta.className} bg-[#ECF0F1] min-h-screen text-[#2B2118] antialiased tracking-tight font-sans selection:bg-[#9CC5A1]/40 selection:text-[#216869]`}
      >
        <LanguageProvider>
          <AuthProvider>
          {isPublicRoute || isAdminRoute ? (
            /* PUBLIC OR ADMIN ROUTE: Render without Farmer TopBar. 
               Admin routing handles its own layout internally. */
            <main className={`min-h-screen w-full font-sans ${isPublicRoute ? "bg-[#0A100D] overflow-x-hidden" : ""}`}>
              {children}
            </main>
          ) : (
            /* AUTHENTICATED FARMER ROUTE: Navbar-driven SaaS Workspace Layout */
            <div className="flex flex-col min-h-screen w-full font-sans">
              <TopBar />
              <main className="flex-1 w-full overflow-auto bg-[#ECF0F1]">
                {children}
              </main>
            </div>
          )}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
