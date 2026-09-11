"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sprout,
  AlertTriangle,
  ShieldAlert,
  AlertOctagon,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import { useTranslation } from "@/context/LanguageContext";

interface FarmerAdvisoryListProps {
  result: WeatherResult | null;
  loading: boolean;
}

export default function FarmerAdvisoryList({
  result,
  loading,
}: FarmerAdvisoryListProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (
    !result ||
    !result.alerts ||
    !Array.isArray(result.alerts) ||
    result.alerts.length === 0
  ) {
    return (
      <EmptyState
        icon="✅"
        title={t.weatherExtra?.favorableTitle || "Conditions Look Favorable!"}
        description={t.weatherExtra?.favorableDesc || "No significant weather risks or crop diseases detected for this timeframe. Continue routine field maintenance and irrigation."}
      />
    );
  }
  // High-contrast style configurations
  const getStyle = (severity: string) => {
    switch (severity) {
      case "Critical":
        return {
          cardBorder:
            "border-gray-200 dark:border-gray-800 border-l-8 border-l-rose-600 dark:border-l-rose-500",
          headerColor: "text-rose-700 dark:text-rose-400",
          iconBg:
            "bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800",
          badge: "destructive" as const,
          icon: <AlertOctagon className="h-6 w-6" />,
          actionBox:
            "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200",
        };
      case "High":
        return {
          cardBorder:
            "border-gray-200 dark:border-gray-800 border-l-8 border-l-orange-500 dark:border-l-orange-400",
          headerColor: "text-orange-700 dark:text-orange-400",
          iconBg:
            "bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800",
          badge: "warning" as const,
          icon: <ShieldAlert className="h-6 w-6" />,
          actionBox:
            "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60 text-orange-950 dark:text-orange-200",
        };
      default:
        return {
          cardBorder:
            "border-gray-200 dark:border-gray-800 border-l-8 border-l-amber-500 dark:border-l-amber-400",
          headerColor: "text-amber-700 dark:text-amber-400",
          iconBg:
            "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
          badge: "warning" as const,
          icon: <AlertTriangle className="h-6 w-6" />,
          actionBox:
            "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          {t.weatherExtra?.cropRiskAlerts || "Crop Risk Alerts & Advisories"} ({result.risk_count})
        </h2>
      </div>

      <div className="space-y-4">
        {result.alerts.map((alert, idx) => {
          const style = getStyle(alert.severity);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* Solid background with thick left color border to prevent blending */}
              <Card
                className={`bg-white dark:bg-gray-900 shadow-md p-5 border ${style.cardBorder}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl flex-shrink-0 ${style.iconBg}`}
                  >
                    {style.icon}
                  </div>

                  <div className="flex-1 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3
                        className={`text-base font-black ${style.headerColor}`}
                      >
                        {alert.risk_name}
                      </h3>
                      <Badge
                        variant={style.badge}
                        className="shadow-2xs uppercase"
                      >
                        {alert.severity} {t.weatherExtra?.riskLabel || "Risk"}
                      </Badge>
                    </div>

                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                      {alert.description}
                    </p>

                    {/* High contrast crop tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mr-1">
                        {t.weatherExtra?.targetCrops || "Target Crops:"}
                      </span>
                      {alert.affected_crops.map((crop) => (
                        <span
                          key={crop}
                          className="rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-bold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                        >
                          🌱 {crop}
                        </span>
                      ))}
                    </div>

                    {/* Actionable Advice Box with high-contrast borders */}
                    <div
                      className={`mt-3 rounded-xl border p-4 shadow-2xs ${style.actionBox}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <ArrowUpRight className="h-5 w-5 font-black mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide opacity-90">
                            {t.weatherExtra?.intervention || "Recommended Field Intervention"}
                          </p>
                          <p className="text-xs font-bold leading-normal mt-1">
                            {alert.recommended_action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
