"use client";

import React from "react";

interface StatCardProps {
  icon: string | React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  bgColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  color = "text-emerald-900",
  bgColor = "bg-emerald-50 border-emerald-200/60",
}: StatCardProps) {
  return (
    <div
      className={`rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border shadow-inner ${bgColor}`}
      >
        {typeof icon === "string" ? <span>{icon}</span> : icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">{label}</p>
        <p className={`text-2xl sm:text-3xl font-black tracking-tight mt-0.5 ${color}`}>{value}</p>
      </div>
    </div>
  );
}