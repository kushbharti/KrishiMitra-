"use client";

import React, { useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BackgroundCarousel from "@/components/landing/BackgroundCarousel";
import HeroNavigation from "@/components/landing/HeroNavigation";
import LeftSection from "@/components/landing/LeftSection";
import RightSection from "@/components/landing/RightSection";

export default function LandingPage() {
  const searchParams = useSearchParams();
  // Master state tracking the active view inside the Right Glass Panel
  const [authView, setAuthView] = useState<"scanner" | "login" | "signup">(
    "scanner",
  );
useEffect(() => {
    if (searchParams.get("auth") === "login") {
      setAuthView("login");
    }
  }, [searchParams]);

  const handleExploreClick = () => {
    // If you want the explore button to trigger auth instead of scrolling
    setAuthView("signup");
  };

  return (
    <div className="min-h-screen w-full bg-[#0A100D] font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      {/* 1. Cinematic Background Layer */}
      <BackgroundCarousel />

      {/* 2. Top Navigation (Passes state setters) */}
      <HeroNavigation
        onSelectAuth={(view) => setAuthView(view)}
        activeView={authView}
      />

      {/* 3. Primary Two-Column Hero Grid */}
      <div className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 pt-20 lg:pt-0">
        {/* Left Column: Typography & Features */}
        <div className="lg:col-span-7 h-full flex flex-col justify-center">
          <LeftSection />
        </div>

        {/* Right Column: AI Scanner / Authentication Panel */}
        <div className="lg:col-span-5 h-full flex items-center justify-center relative">
          <RightSection
            authView={authView}
            onSwitchAuth={(view) => setAuthView(view)}
          />
        </div>
      </div>
    </div>
  );
}
