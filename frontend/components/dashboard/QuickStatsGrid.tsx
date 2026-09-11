"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Activity,
  Umbrella,
  Landmark,
  Bot,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { StatMetric } from "@/types/dashboard";
import { AnimatedCounter } from "./AnimatedCounter";

const STATS: StatMetric[] = [
  {
    label: "Crops Monitored",
    value: 142,
    trend: 8,
    icon: Target,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Diseases Detected",
    value: 26,
    trend: -12,
    icon: Activity,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    label: "Weather Alerts",
    value: 2,
    trend: 0,
    icon: Umbrella,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    label: "Eligible Schemes",
    value: 12,
    trend: 2,
    icon: Landmark,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "AI Consultations",
    value: 341,
    trend: 24,
    icon: Bot,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Est. Seasonal Profit",
    value: 245000,
    trend: 18,
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    isCurrency: true,
  },
];

export const QuickStatsGrid: React.FC = () => {
  return (
    <>
      {STATS.map((stat, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4, scale: 1.01 }}
          className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 group cursor-default"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon size={20} className={stat.color} />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${
                stat.trend >= 0
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-rose-50 text-rose-700 border border-rose-200/60"
              }`}
            >
              {stat.trend >= 0 ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              <span>{Math.abs(stat.trend)}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-wider mb-1">
              {stat.label}
            </h3>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              <AnimatedCounter
                value={stat.value}
                isCurrency={stat.isCurrency}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};
