"use client";

import { useState, useEffect } from "react";
import { CalendarCrop } from "@/types";
import { getCalendarCrops } from "@/lib/api";
import EmptyState from "@/components/shared/EmptyState";
import PageTitle from "@/components/shared/PageTitle";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { useTranslation } from "@/context/LanguageContext";

const CATEGORY_COLORS: Record<string, string> = {
  cereal: "bg-blue-500",
  vegetable: "bg-orange-500",
  fruit: "bg-purple-500",
  cash_crop: "bg-[#49A078]",
};

const CATEGORY_LABEL_COLORS: Record<string, string> = {
  cereal: "text-blue-500",
  vegetable: "text-orange-500",
  fruit: "text-purple-500",
  cash_crop: "text-[#49A078]",
};

const CalendarTableSkeleton = ({
  months,
  currentMonth,
}: {
  months: string[];
  currentMonth: number;
}) => (
  <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm animate-pulse">
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-4 min-w-[160px]">
              <div className="h-3 w-20 bg-slate-200 rounded-full"></div>
            </th>
            {months.map((m, idx) => (
              <th
                key={m}
                className={`px-2 py-4 min-w-[60px] text-center ${idx === currentMonth ? "bg-[#49A078]/5" : ""}`}
              >
                <div className="h-3 w-8 bg-slate-200 rounded-full mx-auto"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3, 4, 5].map((row) => (
            <tr key={row}>
              <td className="px-6 py-4">
                <div className="h-4 w-24 bg-slate-200 rounded-full mb-2"></div>
                <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
              </td>
              {months.map((_, idx) => (
                <td
                  key={idx}
                  className={`px-1 py-4 ${idx === currentMonth ? "bg-[#49A078]/[0.02]" : ""}`}
                >
                  {/* Simulate random growing periods for skeleton realism */}
                  {(
                    row % 2 === 0 ? idx > 2 && idx < 7 : idx > 6 && idx < 11
                  ) ? (
                    <div className="h-7 w-full bg-slate-100 rounded-md"></div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function CalendarPage() {
  const { t } = useTranslation();
  const [crops, setCrops] = useState<CalendarCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season, setSeason] = useState("All");
  const [category, setCategory] = useState("All");
  const [selectedCrop, setSelectedCrop] = useState<CalendarCrop | null>(null);

  useEffect(() => {
    async function fetchCrops() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCalendarCrops(
          season,
          category === "All" ? "All" : category.toLowerCase().replace(" ", "_"),
        );
        setCrops(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : t.common.error);
      } finally {
        setLoading(false);
      }
    }
    fetchCrops();
  }, [season, category, t.common.error]);

  const getGrowingCells = (crop: CalendarCrop) => {
    const sow = crop.sow_month - 1;
    const harvest = crop.harvest_month - 1;
    const cells: boolean[] = Array(12).fill(false);
    if (harvest >= sow) {
      for (let m = sow; m <= harvest; m++) cells[m] = true;
    } else {
      for (let m = sow; m < 12; m++) cells[m] = true;
      for (let m = 0; m <= harvest; m++) cells[m] = true;
    }
    return cells;
  };

  const currentMonth = new Date().getMonth();

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto pb-24 lg:pb-12 space-y-8">
      <PageTitle title={t.calendar.title} subtitle={t.calendar.subtitle} />

      {/* Premium Filter Control Panel */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 flex flex-col md:flex-row flex-wrap gap-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex-1 min-w-[280px]">
          <label className="text-[11px] font-bold text-[#475B63] uppercase tracking-widest block mb-3">
            {t.calendar.seasonLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {t.common.seasons.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                className={`px-4 py-2 text-xs rounded-xl font-bold transition-all duration-200 ${
                  season === s
                    ? "bg-[#49A078] text-white shadow-md shadow-[#49A078]/20 ring-2 ring-[#49A078]/20"
                    : "bg-slate-50 text-[#475B63] border border-slate-200 hover:bg-slate-100 hover:text-[#2B2118]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[280px]">
          <label className="text-[11px] font-bold text-[#475B63] uppercase tracking-widest block mb-3">
            {t.calendar.categoryLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {t.common.categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 text-xs rounded-xl font-bold transition-all duration-200 ${
                  category === c
                    ? "bg-[#216869] text-white shadow-md shadow-[#216869]/20 ring-2 ring-[#216869]/20"
                    : "bg-slate-50 text-[#475B63] border border-slate-200 hover:bg-slate-100 hover:text-[#2B2118]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Refined Category Legend */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-2">
        {Object.entries(CATEGORY_LABEL_COLORS).map(([key, cls]) => (
          <span
            key={key}
            className="flex items-center gap-2 text-[11px] font-bold text-[#475B63] tracking-widest uppercase"
          >
            <span className={`text-xs ${cls}`}>●</span>
            {key.replace("_", " ")}
          </span>
        ))}
      </div>

      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      {/* Main Calendar View / Loading / Empty States */}
      <div className="relative">
        {loading ? (
          <CalendarTableSkeleton
            months={t.common.months}
            currentMonth={currentMonth}
          />
        ) : crops.length === 0 ? (
          <EmptyState
            icon="📅"
            title={t.calendar.noCrops}
            description={t.calendar.noCropsSub}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <table className="w-full min-w-max text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-6 py-4 text-[11px] font-bold text-[#475B63] uppercase tracking-widest min-w-[160px] sticky left-0 bg-slate-50/80 backdrop-blur-sm z-10">
                      {t.calendar.tableCrop}
                    </th>
                    {t.common.months.map((m, idx) => {
                      const isCurrent = idx === currentMonth;
                      return (
                        <th
                          key={m}
                          className={`px-2 py-4 text-center text-[11px] font-bold tracking-widest uppercase min-w-[60px] ${
                            isCurrent
                              ? "bg-[#49A078]/5 text-[#49A078]"
                              : "text-[#475B63]"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {m}
                            {isCurrent && (
                              <div className="w-1.5 h-1.5 bg-[#49A078] rounded-full" />
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {crops.map((crop) => {
                    const cells = getGrowingCells(crop);
                    const colorClass =
                      CATEGORY_COLORS[crop.category] || "bg-gray-400";
                    const isSelected = selectedCrop?.id === crop.id;

                    return (
                      <tr
                        key={crop.id}
                        onClick={() =>
                          setSelectedCrop(isSelected ? null : crop)
                        }
                        className={`cursor-pointer transition-all duration-200 group ${
                          isSelected
                            ? "bg-[#9CC5A1]/10 border-l-4 border-[#49A078]"
                            : "hover:bg-slate-50/80 border-l-4 border-transparent"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 z-10 bg-inherit backdrop-blur-sm">
                          <div
                            className={`font-bold transition-colors ${isSelected ? "text-[#216869]" : "text-[#2B2118]"}`}
                          >
                            {crop.name}
                          </div>
                          <div className="text-[11px] text-[#475B63] font-medium mt-1">
                            {crop.season}
                          </div>
                        </td>
                        {cells.map((active, idx) => (
                          <td
                            key={idx}
                            className={`px-1 py-4 ${idx === currentMonth ? "bg-[#49A078]/[0.02]" : ""}`}
                          >
                            {active && (
                              <div
                                className={`h-7 w-full rounded-md opacity-90 shadow-sm transition-transform duration-200 ${colorClass} ${
                                  isSelected
                                    ? "scale-y-110 opacity-100 shadow-md"
                                    : "group-hover:opacity-100"
                                }`}
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Premium Selected Crop Insights Panel */}
      {selectedCrop && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(73,160,120,0.15)] ring-1 ring-[#49A078]/10 animate-fade-in relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#9CC5A1]/10 to-transparent rounded-bl-full pointer-events-none -z-10" />

          <div className="flex items-start justify-between mb-6 pb-5 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-[#2B2118] text-2xl tracking-tight">
                {selectedCrop.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-[#475B63]">
                  {selectedCrop.season}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-[#475B63]">
                  {selectedCrop.duration_days} {t.calendar.days}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 text-xs font-bold text-blue-800">
                  💧 {selectedCrop.water_need} {t.calendar.water}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCrop(null)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors w-10 h-10 rounded-full flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-[#49A078]/30"
              aria-label="Close details"
            >
              ×
            </button>
          </div>

          <h4 className="text-[11px] font-bold text-[#475B63] uppercase tracking-widest mb-4">
            {t.calendar.milestones}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCrop.activity_milestones.map((m, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#9CC5A1]/50 transition-all"
              >
                <span className="inline-block w-fit bg-[#9CC5A1]/20 text-[#216869] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg">
                  {t.calendar.week} {m.week}
                </span>
                <span className="text-[#2B2118] font-semibold text-sm">
                  {m.activity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
