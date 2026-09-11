"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { TrajectoryPoint } from "@/lib/api";

interface WeatherChartsProps {
  data: TrajectoryPoint[];
  loading?: boolean;
}

export default function WeatherCharts({
  data,
  loading = false,
}: WeatherChartsProps) {
  return (
    <Card className="border-gray-200/80 bg-white dark:bg-gray-900 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            3-Day Climate Trajectory
          </h3>
          <p className="text-xs text-gray-500">
            Live satellite Temperature (°C) & Humidity (%) trend
          </p>
        </div>
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
        )}
      </div>

      <div className="h-56 w-full">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/40 rounded-xl animate-pulse">
            <span className="text-xs font-semibold text-gray-400">
              Syncing satellite trajectory...
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="chartHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 600, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                        <p className="font-bold text-gray-900 dark:text-white text-xs mb-1">
                          {label}
                        </p>
                        {payload[0] && (
                          <p className="text-xs font-semibold text-emerald-600">
                            Temp: {payload[0].value}°C
                          </p>
                        )}
                        {payload[1] && (
                          <p className="text-xs font-semibold text-sky-600">
                            Humidity: {payload[1].value}%
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#chartTemp)"
              />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#0ea5e9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#chartHum)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
