"use client";

import React, { useEffect, useState } from "react";
import { DiseaseTelemetry, AITelemetry, DiseaseLog } from "@/types/admin";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, AreaChart, Area
} from "recharts";
import {
  Activity, Scan, AlertTriangle, TrendingUp, RefreshCw,
  Zap, Shield, Clock, Target, ChevronRight, Leaf
} from "lucide-react";

const PIE_COLORS = ["#216869", "#49A078", "#9CC5A1", "#DCEAB2", "#475B63", "#6B8F71"];
const SEVERITY_META: Record<string, { color: string; bg: string; dot: string }> = {
  Critical: { color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
  High: { color: "text-orange-700", bg: "bg-orange-100", dot: "bg-orange-500" },
  Medium: { color: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-400" },
  Low: { color: "text-blue-700", bg: "bg-blue-100", dot: "bg-blue-400" },
};

// Mock weekly scan trend data
const SCAN_TREND = [
  { day: "Mon", scans: 34, alerts: 8 },
  { day: "Tue", scans: 51, alerts: 12 },
  { day: "Wed", scans: 42, alerts: 5 },
  { day: "Thu", scans: 67, alerts: 15 },
  { day: "Fri", scans: 89, alerts: 22 },
  { day: "Sat", scans: 54, alerts: 9 },
  { day: "Sun", scans: 38, alerts: 4 },
];

export default function TelemetryPage() {
  const [diseaseData, setDiseaseData] = useState<DiseaseTelemetry | null>(null);
  const [aiData, setAiData] = useState<AITelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"disease" | "ai">("disease");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dRes, aRes] = await Promise.all([
        fetch("/api/admin/disease-telemetry"),
        fetch("/api/admin/ai-assistant-telemetry"),
      ]);
      if (!dRes.ok || !aRes.ok) throw new Error("Failed to load telemetry streams.");
      setDiseaseData(await dRes.json());
      setAiData(await aRes.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const allLogs: DiseaseLog[] = diseaseData?.logs || [];
  const criticalLogs = allLogs.filter(l => l.severity === "Critical" || l.severity === "High");
  const resolvedAI = aiData?.logs.filter(l => l.resolved).length || 0;
  const totalAI = aiData?.logs.length || 0;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm font-medium mt-4">{error}</div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Telemetry & Scans</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time disease detection signals & AI inference metrics</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-[#216869] text-white text-sm font-bold rounded-lg hover:bg-[#1a5354] transition-colors"
        >
          <RefreshCw size={14} />
          Refresh Streams
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Scans", value: allLogs.length || 845, icon: Scan, color: "bg-blue-50 text-blue-600", sub: "Lifetime detections" },
          { label: "Critical Alerts", value: criticalLogs.length || 18, icon: AlertTriangle, color: "bg-red-50 text-red-600", sub: "Requires intervention" },
          { label: "AI Queries", value: totalAI || 124, icon: Zap, color: "bg-violet-50 text-violet-600", sub: "Consultations" },
          { label: "Resolution Rate", value: totalAI ? `${Math.round((resolvedAI / totalAI) * 100)}%` : "91%", icon: Target, color: "bg-green-50 text-green-600", sub: "Autonomously resolved" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <TrendingUp size={14} className="text-[#49A078]" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{loading ? "—" : value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { id: "disease" as const, label: "Disease Detection", icon: Shield },
          { id: "ai" as const, label: "AI Inference", icon: Zap },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "disease" && (
        <>
          {/* Weekly Scan Trend */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Weekly Scan Volume</h2>
                <p className="text-xs text-slate-500 mt-1">Disease detection scans vs critical alerts</p>
              </div>
              <span className="text-xs text-[#49A078] font-bold bg-[#216869]/10 px-2.5 py-1 rounded-full">Live</span>
            </div>
            <div className="h-64">
              {loading ? (
                <div className="h-full bg-slate-50 rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SCAN_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#49A078" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#49A078" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="scans" stroke="#49A078" strokeWidth={2.5} fill="url(#scanGrad)" name="Total Scans" />
                    <Area type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} fill="url(#alertGrad)" name="Alerts" strokeDasharray="4 2" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Bottom row: crop distribution + recent logs */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Crop Pie */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">Crop Vulnerability</h2>
              <p className="text-xs text-slate-500 mb-4">Disease distribution across crop types</p>
              {loading ? (
                <div className="h-56 bg-slate-50 rounded-lg animate-pulse" />
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diseaseData?.crop_distribution || []}
                        cx="50%" cy="50%"
                        innerRadius={55} outerRadius={80}
                        paddingAngle={3} dataKey="value" stroke="none"
                      >
                        {(diseaseData?.crop_distribution || []).map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 600 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Recent Disease Logs */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <Shield size={14} className="text-slate-500" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Disease Events</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-5 py-3.5 flex gap-3 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-slate-200 mt-2 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                  : allLogs.map((log, i) => {
                    const sev = SEVERITY_META[log.severity] || SEVERITY_META.Low;
                    return (
                      <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors group">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${sev.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{log.pathogen}</span>
                            <span className="text-slate-400 text-xs">on</span>
                            <span className="font-semibold text-slate-700 text-xs flex items-center gap-1">
                              <Leaf size={10} className="text-[#49A078]" />
                              {log.crop}
                            </span>
                            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-bold ${sev.bg} ${sev.color}`}>
                              {log.severity}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 font-mono">Conf: {log.confidence}%</span>
                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#49A078]" style={{ width: `${log.confidence}%` }} />
                            </div>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={10} />
                              {new Date(log.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 shrink-0 group-hover:text-slate-400 transition-colors mt-1" />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "ai" && (
        <>
          {/* Language bar chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">Language Distribution</h2>
            <p className="text-xs text-slate-500 mb-6">AI query volume broken down by farmer preferred language</p>
            {loading ? (
              <div className="h-64 bg-slate-50 rounded-lg animate-pulse" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aiData?.language_distribution || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                    <Bar dataKey="value" name="Queries" radius={[6, 6, 0, 0]}>
                      {(aiData?.language_distribution || []).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* AI Logs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Zap size={14} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">AI Consultation Logs</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 animate-pulse flex gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-100 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                    </div>
                  </div>
                ))
                : (aiData?.logs || []).map((log, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                      log.resolved ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      {log.resolved ? "✓" : "!"}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">{log.query_intent}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase">{log.language}</span>
                        <span className="text-xs text-slate-400">{log.resolved ? "Resolved autonomously" : "Requires human review"}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
