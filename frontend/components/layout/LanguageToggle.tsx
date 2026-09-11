"use client";

import React from "react";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation, Language } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const languages: { code: Language; short: string; full: string }[] = [
    { code: "en", short: "EN", full: "ENGLISH" },
    { code: "hi", short: "हि", full: "हिन्दी" },
    { code: "mr", short: "मरा", full: "मराठी" },
  ];

  return (
    <div
      role="group"
      aria-label="Select Interface Language"
      className="relative inline-flex items-center select-none"
    >
      <div className="flex items-center gap-1 bg-[#ECF0F1] border border-[#9CC5A1]/40 rounded-2xl p-1 shadow-inner backdrop-blur-md transition-colors duration-200">
        {/* Responsive Branding:
            • Desktop (≥ lg): Shows Globe + "LANGUAGE" label
            • Tablet (md to lg): Shows Globe icon only
            • Mobile (< md): Hidden completely to save touch space */}
        <div className="hidden md:flex items-center gap-1.5 pl-2.5 pr-1 text-[#216869] pointer-events-none">
          <Globe
            className="w-3.5 h-3.5 animate-pulse shrink-0"
            aria-hidden="true"
          />
          <span className="hidden lg:inline text-[13px] font-black uppercase tracking-wider">
            A文
          </span>
        </div>

        {/* Segmented Control Rail with Anchored Width to Prevent Layout Shifts */}
        <div className="flex items-center justify-between gap-0.5 min-w-[168px] sm:min-w-[176px]">
          {languages.map((lang) => {
            const isActive = language === lang.code;
            return (
              <motion.button
                key={lang.code}
                type="button"
                layout
                onClick={() => setLanguage(lang.code)}
                aria-label={`Switch language to ${lang.full}`}
                aria-pressed={isActive}
                whileTap={{ scale: 0.96 }}
                whileHover={!isActive ? { scale: 1.02 } : undefined}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  mass: 1,
                }}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-black transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#216869] focus-visible:ring-offset-1 flex items-center justify-center ${
                  isActive
                    ? "bg-[#49A078] text-white shadow-md shadow-[#49A078]/25 scale-[1.02] z-10"
                    : "text-[#475B63] hover:text-[#2B2118] hover:bg-white/70"
                }`}
              >
                {/* layout="position" prevents text squishing during width expansion */}
                <motion.span
                  layout="position"
                  className="whitespace-nowrap inline-block leading-none"
                >
                  {isActive ? lang.full : lang.short}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
