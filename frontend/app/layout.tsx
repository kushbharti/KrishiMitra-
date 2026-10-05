import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "@/components/layout/ClientLayout";

// Enterprise developer font stack with crisp geometric tracking
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "KrishiMitra – AI-Powered Smart Farming Platform",
  description:
    "Detect crop diseases, forecast microclimates, discover government subsidies, and maximize mandi profits from one unified platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
