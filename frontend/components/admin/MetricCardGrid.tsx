"use client";

import React from "react";
import { Users, Activity, BarChart, Database } from "lucide-react";
import { OverviewMetrics } from "@/types/admin";

interface Props {
  metrics: OverviewMetrics | null;
  loading: boolean;
}

export default function MetricCardGrid({ metrics, loading }: Props) {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Farmers</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 font-mono tracking-tight">{metrics.total_farmers}</p>
            <span className="text-xs font-bold text-[#49A078]">{metrics.monthly_growth}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <Users size={24} />
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Scans</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 font-mono tracking-tight">{metrics.total_scans}</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
          <BarChart size={24} />
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Alerts</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-red-600 font-mono tracking-tight">{metrics.active_alerts}</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
          <Activity size={24} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Sys Status</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 tracking-tight">Online</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
          <Database size={24} />
        </div>
      </div>
    </div>
  );
}
