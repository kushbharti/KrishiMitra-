"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

const DATA = [
  { name: "Mon", profit: 32000 },
  { name: "Tue", profit: 34000 },
  { name: "Wed", profit: 31000 },
  { name: "Thu", profit: 36000 },
  { name: "Fri", profit: 38000 },
  { name: "Sat", profit: 41000 },
  { name: "Sun", profit: 45000 },
];

export const FinancialAnalyticsChart: React.FC = () => {
  return (
    <div className="col-span-1 lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Financial Profit Trajectory
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Estimated cumulative returns across Kharif & Rabi seasons
          </p>
        </div>
        <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button className="px-3 py-1 bg-white text-emerald-700 text-xs font-bold rounded-lg shadow-2xs">
            Profit (INR)
          </button>
          <button className="px-3 py-1 text-slate-500 hover:text-slate-900 text-xs font-bold rounded-lg">
            Yield (Quintals)
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DATA}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `₹${val / 1000}k`}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs shadow-2xl border border-slate-800">
                      <p className="font-bold text-slate-400 mb-1">
                        {label} Estimation
                      </p>
                      <p className="text-sm font-black text-emerald-400 font-mono">
                        ₹{payload[0].value?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#profitGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
