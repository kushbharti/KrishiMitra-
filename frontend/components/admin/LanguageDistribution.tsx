"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LanguageDistribution as LangDist } from "@/types/admin";
import { Globe } from "lucide-react";

interface Props {
  data: LangDist[];
  loading: boolean;
}

export default function LanguageDistribution({ data, loading }: Props) {
  if (loading) {
    return <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse"></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Platform Language Adoption</h2>
          <p className="text-xs text-slate-500 mt-1">Demographic breakdown of language preferences</p>
        </div>
        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center">
          <Globe className="w-4 h-4 text-slate-400" />
        </div>
      </div>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
            />
            <Bar dataKey="value" fill="#49A078" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
