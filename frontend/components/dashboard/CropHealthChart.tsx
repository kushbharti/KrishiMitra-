"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { ShieldCheck, ChevronRight } from "lucide-react";

const DATA = [
  { name: "Healthy", value: 85, color: "#10b981" },
  { name: "Under Observation", value: 10, color: "#f59e0b" },
  { name: "Critical Risk", value: 5, color: "#f43f5e" },
];

export const CropHealthChart: React.FC = () => {
  return (
    <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Crop Health Distribution
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time status across 142 monitored acres
          </p>
        </div>
        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 transition-colors">
          <span>Details</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-800">
                      <p className="font-bold">
                        {data.name}:{" "}
                        <span className="font-mono text-emerald-400">
                          {data.value}%
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            85<span className="text-sm">%</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5 flex items-center gap-1">
            <ShieldCheck size={12} /> Healthy
          </span>
        </div>
      </div>

      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        {[
          {
            label: "Healthy Crops",
            count: 120,
            total: 142,
            color: "bg-emerald-500",
          },
          {
            label: "Under Observation",
            count: 15,
            total: 142,
            color: "bg-amber-500",
          },
          {
            label: "Critical / Diseased",
            count: 7,
            total: 142,
            color: "bg-rose-500",
          },
        ].map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">{item.label}</span>
              <span className="text-slate-900 font-mono">{item.count}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${(item.count / item.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
