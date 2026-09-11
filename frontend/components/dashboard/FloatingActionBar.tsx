"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scan, Bot, CloudSun, Landmark, CalendarDays } from "lucide-react";

export const FloatingActionBar: React.FC = () => {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 24 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-2xl border border-white/15 p-2 rounded-2xl shadow-2xl flex items-center gap-1"
    >
      <Link
        href="/disease"
        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95"
      >
        <Scan size={16} />
        <span>Scan Crop</span>
      </Link>

      <div className="w-px h-6 bg-white/15 mx-1" />

      {[
        { icon: Bot, label: "Ask AI", href: "/assistant" },
        { icon: CloudSun, label: "Weather", href: "/weather" },
        { icon: Landmark, label: "Schemes", href: "/schemes" },
        { icon: CalendarDays, label: "Calendar", href: "/calendar" },
      ].map((action, i) => (
        <Link
          key={i}
          href={action.href}
          title={action.label}
          className="p-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all relative group flex items-center justify-center hover:scale-110 active:scale-95"
        >
          <action.icon size={18} />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] font-extrabold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none border border-white/10">
            {action.label}
          </span>
        </Link>
      ))}
    </motion.div>
  );
};
