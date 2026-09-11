"use client";

import React, { useEffect, useState } from "react";
import MetricCardGrid from "@/components/admin/MetricCardGrid";
import FarmersTable from "@/components/admin/FarmersTable";
import DiseaseTelemetryChart from "@/components/admin/DiseaseTelemetryChart";
import LanguageDistribution from "@/components/admin/LanguageDistribution";
import LiveAuditFeed from "@/components/admin/LiveAuditFeed";
import { OverviewMetrics, FarmerProfile, DiseaseTelemetry, AITelemetry } from "@/types/admin";

export default function EnterpriseAdminDashboard() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [diseaseData, setDiseaseData] = useState<DiseaseTelemetry | null>(null);
  const [aiData, setAiData] = useState<AITelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        const [metricsRes, farmersRes, diseaseRes, aiRes] = await Promise.all([
          fetch("/api/admin/overview-metrics"),
          fetch("/api/admin/farmers"),
          fetch("/api/admin/disease-telemetry"),
          fetch("/api/admin/ai-assistant-telemetry")
        ]);

        if (!metricsRes.ok || !farmersRes.ok || !diseaseRes.ok || !aiRes.ok) {
          throw new Error("Failed to fetch enterprise telemetry streams.");
        }

        const metricsJson = await metricsRes.json();
        const farmersJson = await farmersRes.json();
        const diseaseJson = await diseaseRes.json();
        const aiJson = await aiRes.json();

        setMetrics(metricsJson);
        setFarmers(farmersJson);
        setDiseaseData(diseaseJson);
        setAiData(aiJson);
      } catch (err: any) {
        setError(err.message || "An error occurred while loading dashboard telemetry.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 shadow-sm max-w-3xl mx-auto mt-10">
        <h3 className="font-bold text-lg mb-2">Telemetry Failure</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Command Center</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Enterprise Telemetry & Operations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-[#216869] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#1a5354] transition-colors">
            Generate Insights
          </button>
        </div>
      </div>

      <MetricCardGrid metrics={metrics} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FarmersTable farmers={farmers} loading={loading} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex-1 min-h-[300px]">
            <DiseaseTelemetryChart data={diseaseData?.crop_distribution || []} loading={loading} />
          </div>
          <div className="flex-1 min-h-[300px]">
            <LanguageDistribution data={aiData?.language_distribution || []} loading={loading} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <LiveAuditFeed data={aiData} loading={loading} />
      </div>
    </div>
  );
}
