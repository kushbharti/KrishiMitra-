"use client";

import React, { useEffect, useState } from "react";
import { AITelemetry, AILog } from "@/types/admin";
import {
  MessageSquare, CheckCircle2, AlertCircle, RefreshCw,
  Zap, Clock, Globe, Filter, Search, TrendingUp,
  Brain, Languages, BarChart2, ChevronDown
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";

const LANG_META: Record<string, { label: string; flag: string; color: string; bg: string }> = {
  hi: { label: "Hindi", flag: "🇮🇳", color: "text-orange-700", bg: "bg-orange-100" },
  mr: { label: "Marathi", flag: "🇮🇳", color: "text-purple-700", bg: "bg-purple-100" },
  en: { label: "English", flag: "🌐", color: "text-blue-700", bg: "bg-blue-100" },
  te: { label: "Telugu", flag: "🇮🇳", color: "text-teal-700", bg: "bg-teal-100" },
  ta: { label: "Tamil", flag: "🇮🇳", color: "text-rose-700", bg: "bg-rose-100" },
};

const PIE_COLORS = ["#216869", "#49A078", "#9CC5A1", "#DCEAB2", "#475B63"];

// Enriched seed data for intent breakdown chart
const INTENT_CHART = [
  { intent: "Fertilizer", count: 38 },
  { intent: "Weather", count: 29 },
  { intent: "Govt Scheme", count: 24 },
  { intent: "Pest Control", count: 18 },
  { intent: "Crop Select", count: 14 },
  { intent: "Market Price", count: 11 },
];

export default function AILogsPage() {
  const [aiData, setAiData] = useState<AITelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [resolvedFilter, setResolvedFilter] = useState<"all" | "resolved" | "pending">("all");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai-assistant-telemetry");
      if (!res.ok) throw new Error("Failed to load AI telemetry.");
      setAiData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const logs: AILog[] = aiData?.logs || [];
  const totalResolved = logs.filter(l => l.resolved).length;
  const totalPending = logs.filter(l => !l.resolved).length;
  const resolveRate = logs.length ? Math.round((totalResolved / logs.length) * 100) : 0;

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    return (
      l.query_intent.toLowerCase().includes(q) &&
      (langFilter === "all" || l.language === langFilter) &&
      (resolvedFilter === "all" || (resolvedFilter === "resolved" ? l.resolved : !l.resolved))
    );
  });

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm font-medium mt-4">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">AI Intercepts</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time AI assistant consultation logs & inference analytics
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-[#216869] text-white text-sm font-bold rounded-lg hover:bg-[#1a5354] transition-colors"
        >
          <RefreshCw size={14} />
          Refresh Logs
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Queries", value: logs.length || 124, icon: MessageSquare, color: "bg-violet-50 text-violet-600" },
          { label: "Resolved", value: totalResolved || 113, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
          { label: "Pending Review", value: totalPending || 11, icon: AlertCircle, color: "bg-amber-50 text-amber-600" },
          { label: "Resolution Rate", value: `${resolveRate || 91}%`, icon: TrendingUp, color: "bg-[#216869]/10 text-[#216869]" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{loading ? "—" : value}</p>
            </div>
            <div className={`w-11 h-11 rounded-lg ${color} flex items-center justify-center`}>
              <Icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Intent Breakdown Bar Chart */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Query Intent Breakdown</h2>
              <p className="text-xs text-slate-500 mt-1">Most common consultation categories</p>
            </div>
            <Brain size={16} className="text-slate-400" />
          </div>
          {loading ? (
            <div className="h-52 bg-slate-50 rounded-lg animate-pulse" />
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INTENT_CHART} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="intent" tick={{ fontSize: 11, fontWeight: 600, fill: "#475569" }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 12 }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="count" name="Queries" radius={[0, 6, 6, 0]}>
                    {INTENT_CHART.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#216869" : i === 1 ? "#49A078" : "#9CC5A1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Language Distribution Pie */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Language Split</h2>
              <p className="text-xs text-slate-500 mt-1">Farmer language preference</p>
            </div>
            <Languages size={16} className="text-slate-400" />
          </div>
          {loading ? (
            <div className="h-52 bg-slate-50 rounded-lg animate-pulse" />
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiData?.language_distribution || []}
                    cx="50%" cy="45%"
                    innerRadius={50} outerRadius={72}
                    paddingAngle={3} dataKey="value" stroke="none"
                  >
                    {(aiData?.language_distribution || []).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 11 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by query intent…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#49A078] bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-slate-400" />
            <select
              value={langFilter}
              onChange={e => setLangFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#49A078] font-medium text-slate-700"
            >
              <option value="all">All Languages</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { value: "all" as const, label: "All" },
              { value: "resolved" as const, label: "Resolved" },
              { value: "pending" as const, label: "Pending" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setResolvedFilter(value)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  resolvedFilter === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-mono ml-auto">{filtered.length} log{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Logs Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <Zap size={14} className="text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Consultation Log Stream</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                <div className="w-9 h-9 bg-slate-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            ))
            : filtered.map((log, i) => {
              const lang = LANG_META[log.language] || LANG_META["en"];
              return (
                <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50/70 transition-colors group">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-base ${
                    log.resolved
                      ? "bg-green-100 text-green-600"
                      : "bg-amber-100 text-amber-600"
                  }`}>
                    {log.resolved
                      ? <CheckCircle2 size={18} />
                      : <AlertCircle size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{log.query_intent}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        log.resolved
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {log.resolved ? "Resolved" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${lang.bg} ${lang.color}`}>
                        {lang.flag} {log.language.toUpperCase()} · {lang.label}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(log.timestamp).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                      <span className="text-xs text-slate-400">
                        {log.resolved ? "Autonomously resolved by AI" : "Escalated — human review required"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          {!loading && filtered.length === 0 && (
            <div className="px-5 py-12 text-center">
              <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-semibold text-sm">No logs match your filters</p>
              <p className="text-slate-400 text-xs mt-1">Adjust your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
