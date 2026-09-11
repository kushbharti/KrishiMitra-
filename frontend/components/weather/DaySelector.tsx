"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Sun, CalendarClock } from "lucide-react";

export type DayOption = "yesterday" | "today" | "tomorrow";

interface DaySelectorProps {
  selectedDay: DayOption;
  onSelectDay: (day: DayOption) => void;
}

export default function DaySelector({
  selectedDay,
  onSelectDay,
}: DaySelectorProps) {
  const tabs: {
    id: DayOption;
    label: string;
    sub: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "yesterday",
      label: "Yesterday",
      sub: "Past 24h Log",
      icon: <History className="h-5 w-5" />,
    },
    {
      id: "today",
      label: "Today",
      sub: "Live Conditions",
      icon: <Sun className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "tomorrow",
      label: "Tomorrow",
      sub: "Advance Outlook",
      icon: <CalendarClock className="h-5 w-5 text-sky-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 rounded-2xl bg-gray-100/80 p-1.5 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700">
      {tabs.map((tab) => {
        const isActive = selectedDay === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectDay(tab.id)}
            className={`relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl transition-all cursor-pointer ${
              isActive
                ? "text-emerald-950 dark:text-white font-bold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-200/80 dark:border-gray-700"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              {tab.icon}
              <span className="text-sm sm:text-base">{tab.label}</span>
            </div>
            <span
              className={`relative z-10 text-[11px] mt-0.5 ${isActive ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-400"}`}
            >
              {tab.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
