"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  Bot,
  CloudSun,
  Landmark,
  Calendar,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

const EASE_APPLE = [0.16, 1, 0.3, 1] as const;

const HIGHLIGHTS_DATA = [
  {
    id: "disease",
    title: "Disease Detection",
    desc: "AI-powered leaf pathology analysis",
    icon: Leaf,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    href: "/disease",
  },
  {
    id: "ai",
    title: "AI Assistant",
    desc: "24/7 smart farming advisory",
    icon: Bot,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "/assistant",
  },
  {
    id: "weather",
    title: "Weather Intelligence",
    desc: "Real-time microclimate insights",
    icon: CloudSun,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    href: "/weather",
  },
  {
    id: "govt",
    title: "Government Schemes",
    desc: "Find eligible agricultural subsidies",
    icon: Landmark,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    href: "/schemes",
  },
  {
    id: "calendar",
    title: "Crop Calendar",
    desc: "Plan every seasonal activity",
    icon: Calendar,
    color: "text-green-500",
    bg: "bg-green-500/10",
    href: "/calendar",
  },
  {
    id: "profit",
    title: "Profit Estimator",
    desc: "Calculate market ROI instantly",
    icon: TrendingUp,
    color: "text-lime-500",
    bg: "bg-lime-500/10",
    href: "/income",
  },
];

export default function LeftSection() {
  return (
    <section className="relative h-full flex flex-col justify-center px-8 sm:px-12 lg:px-16 pt-28 lg:pt-0 z-10">
      <div className="max-w-xl relative z-20 mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_APPLE }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6"
        >
          Grow Smarter.
          <br />
          Farm Better.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-200">
            With Precision AI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE_APPLE }}
          className="text-base sm:text-lg text-white/80 font-normal leading-relaxed mb-8 max-w-md drop-shadow-sm"
        >
          Detect crop pathology in sub-seconds, forecast microclimates, discover
          government subsidies, and maximize mandi profits from one unified
          platform.
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 w-full max-w-xl">
          {HIGHLIGHTS_DATA.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + i * 0.08,
                  ease: EASE_APPLE,
                }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Link
                  href={item.href}
                  className="bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-md border border-white/10 hover:border-white/25 p-3.5 rounded-2xl transition-all flex flex-col items-start gap-2.5 shadow-lg h-full"
                >
                  <div
                    className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}
                  >
                    <Icon
                      className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <h2 className="text-white font-bold text-xs sm:text-[13px] leading-tight tracking-tight truncate w-full group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-white/60 text-[10px] sm:text-[11px] font-normal leading-snug line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: EASE_APPLE }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group relative inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-bold text-base overflow-hidden transition-all shadow-[0_10px_30px_rgba(5,150,105,0.3)] hover:shadow-[0_15px_35px_rgba(5,150,105,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="relative z-10">Explore All Features</span>
            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </div>
    </section>
  );
}
