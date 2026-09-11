"use client";

import React from "react";
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Eye,
  Compass,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { WeatherInput } from "@/types";
import { useTranslation } from "@/context/LanguageContext";

interface WeatherOverviewProps {
  dayLabel: string;
  temperature: number;
  humidity: number;
  rainfall: WeatherInput["rainfall"];
}

export default function WeatherOverview({
  dayLabel,
  temperature,
  humidity,
  rainfall,
}: WeatherOverviewProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Temperature Card */}
      <Card className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-gray-900 border-rose-100 dark:border-rose-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            {dayLabel} {t.weatherExtra?.temperatureLabel || "Temperature"}
          </span>
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
            <Thermometer className="h-5 w-5" />
          </div>
        </div>
        <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {temperature}°C
        </div>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
          {temperature > 30
            ? (t.weatherExtra?.highHeat || "High heat — ensure adequate irrigation")
            : (t.weatherExtra?.optimalTemp || "Optimal growing temperature")}
        </p>
      </Card>

      {/* Humidity Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t.weatherExtra?.relHumidity || "Relative Humidity"}
          </span>
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
            <Droplets className="h-5 w-5" />
          </div>
        </div>
        <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {humidity}%
        </div>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
          {humidity > 75
            ? (t.weatherExtra?.highMoisture || "High moisture — monitor for fungal blight")
            : (t.weatherExtra?.comfortMoisture || "Comfortable atmospheric moisture")}
        </p>
      </Card>

      {/* Rainfall Card */}
      <Card className="bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-gray-900 border-sky-100 dark:border-sky-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            {t.weatherExtra?.precipitation || "Precipitation"}
          </span>
          <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-300">
            <CloudRain className="h-5 w-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-gray-900 dark:text-white capitalize tracking-tight mt-1">
          {rainfall}
        </div>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
          {rainfall === "heavy" || rainfall === "moderate"
            ? (t.weatherExtra?.avoidSpraying || "Avoid chemical spraying today")
            : (t.weatherExtra?.safeSpraying || "Safe for field operations and spraying")}
        </p>
      </Card>
    </div>
  );
}
