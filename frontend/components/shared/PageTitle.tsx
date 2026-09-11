"use client";

import React from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export default function PageTitle({
  title,
  subtitle,
  icon,
  badge,
}: PageTitleProps) {
  return (
    <div className="mb-6 space-y-1.5 animate-fade-in">
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1 border border-emerald-200">
          {badge}
        </span>
      )}
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
        {icon}
        <span>{title}</span>
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
