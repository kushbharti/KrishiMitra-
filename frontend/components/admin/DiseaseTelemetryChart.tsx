"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CropDistribution } from "@/types/admin";
import { Activity } from "lucide-react";

interface Props {
  data: CropDistribution[];
  loading: boolean;
}

const COLORS = ["#216869", "#49A078", "#9CC5A1", "#DCEAB2", "#475B63"];

export default function DiseaseTelemetryChart({ data, loading }: Props) {
  if (loading) {
    return <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse"></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Crop Vulnerability</h2>
          <p className="text-xs text-slate-500 mt-1">Disease distribution across scanned crops</p>
        </div>
        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center">
          <Activity className="w-4 h-4 text-slate-400" />
        </div>
      </div>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
