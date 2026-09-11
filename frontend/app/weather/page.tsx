"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WeatherResult, WeatherInput } from "@/types";
import { analyzeWeather, TrajectoryPoint } from "@/lib/api";
import { Loader2, Sprout, Flame, Droplets, Sun } from "lucide-react";
import LocationBar from "@/components/weather/LocationBar";
import DaySelector, { DayOption } from "@/components/weather/DaySelector";
import WeatherOverview from "@/components/weather/WeatherOverview";
import WeatherCharts from "@/components/weather/WeatherCharts";
import FarmerAdvisoryList from "@/components/weather/FarmerAdvisoryList";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function WeatherPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [location, setLocation] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<DayOption>("today");
  const [result, setResult] = useState<WeatherResult | null>(null);
  const [liveTelemetry, setLiveTelemetry] = useState<WeatherInput>({ temperature: 28, humidity: 70, rainfall: "moderate" });
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Set initial location from profile
  useEffect(() => {
    if (!location && user?.district) {
      setLocation(`${user.district}, ${user.state || ""}`);
    } else if (!location && !authLoading) {
      setLocation("Maharashtra, India");
    }
  }, [user, authLoading, location]);

  const runWeatherAnalysis = useCallback(async (loc: string, day: DayOption) => {
    if (!loc) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeWeather({ location: loc, day });
      if (res.result) setResult(res.result);
      if (res.liveTelemetry) setLiveTelemetry(res.liveTelemetry);
      if (res.trajectory) setTrajectory(res.trajectory);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.weather.syncFailed);
    } finally {
      setLoading(false);
    }
  }, [t.weather.syncFailed]);

  useEffect(() => {
    runWeatherAnalysis(location, selectedDay);
  }, [selectedDay, runWeatherAnalysis, location]);

  const handleLocationChange = (newLoc: string) => {
    setLocation(newLoc);
    runWeatherAnalysis(newLoc, selectedDay);
  };

  const getDayLabel = (day: DayOption) => {
    if (day === "yesterday") return t.weather.yesterday;
    if (day === "tomorrow") return t.weather.tomorrow;
    return t.weather.todayLive;
  };

  const getDynamicGuidance = (telemetry: WeatherInput) => {
    if (telemetry.rainfall === "heavy") {
      return { title: t.weather.protocolHeavyTitle, icon: <Droplets className="h-4 w-4 text-blue-700" />, text: t.weather.protocolHeavyText, border: "border-blue-200", bg: "from-blue-500/10" };
    }
    if (telemetry.temperature >= 35) {
      return { title: t.weather.defenseHeatTitle, icon: <Flame className="h-4 w-4 text-[#BD5532]" />, text: t.weather.defenseHeatText, border: "border-orange-200", bg: "from-orange-500/10" };
    }
    if (telemetry.humidity >= 80) {
      return { title: t.weather.fungalTitle, icon: <Sprout className="h-4 w-4 text-[#49A078]" />, text: t.weather.fungalText, border: "border-emerald-200", bg: "from-emerald-500/10" };
    }
    return { title: t.weather.optimalTitle, icon: <Sun className="h-4 w-4 text-amber-600" />, text: t.weather.optimalText, border: "border-amber-200", bg: "from-amber-500/10" };
  };

  const guidance = getDynamicGuidance(liveTelemetry);

  if (authLoading || (loading && !result)) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6 pb-24 animate-pulse">
        {/* LocationBar Skeleton */}
        <div className="h-32 w-full bg-slate-200 rounded-3xl"></div>
        
        {/* Day Selector Skeleton */}
        <div className="h-10 w-full md:w-1/2 bg-slate-200 rounded-lg"></div>

        {/* Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-7 h-[500px] bg-slate-200 rounded-3xl"></div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-64 bg-slate-200 rounded-3xl"></div>
            <div className="h-48 bg-slate-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-[#2B2118] overflow-x-hidden">
      <LocationBar currentLocation={location || "Loading location..."} onLocationChange={handleLocationChange} />

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#475B63]">
            {t.weather.selectTimeline}
          </span>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs font-black text-[#216869] animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t.weather.syncing}</span>
            </span>
          )}
        </div>
        <DaySelector selectedDay={selectedDay} onSelectDay={(day) => setSelectedDay(day)} />
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <WeatherOverview dayLabel={getDayLabel(selectedDay)} temperature={liveTelemetry.temperature} humidity={liveTelemetry.humidity} rainfall={liveTelemetry.rainfall} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        <div className="lg:col-span-7 space-y-6">
          <FarmerAdvisoryList result={result} loading={loading} />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <WeatherCharts data={trajectory} loading={loading} />
          <div className={`rounded-3xl border bg-gradient-to-br to-transparent p-6 shadow-sm transition-all ${guidance.border} ${guidance.bg}`}>
            <h4 className="font-black text-sm text-[#2B2118] flex items-center gap-2 mb-2">
              {guidance.icon}
              <span>{guidance.title}</span>
            </h4>
            <p className="text-xs leading-relaxed text-[#475B63] font-bold">
              {guidance.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}