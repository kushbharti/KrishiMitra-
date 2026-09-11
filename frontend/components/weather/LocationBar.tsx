"use client";

import React, { useState } from "react";
import { MapPin, Search, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/context/LanguageContext";

interface LocationBarProps {
  currentLocation: string;
  onLocationChange: (newLocation: string) => void;
}

const POPULAR_VILLAGES = [
  "Saravali, MH",
  "Nashik, MH",
  "Ludhiāna, PB",
  "Karnal, HR",
  "Guntur, AP",
];

export default function LocationBar({
  currentLocation,
  onLocationChange,
}: LocationBarProps) {
  const [inputVal, setInputVal] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onLocationChange(inputVal.trim());
      setInputVal("");
    }
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-none shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Active Location Display */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-emerald-400">
            <MapPin className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              {t.weatherExtra?.activeFieldLocation || "Active Field Location"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
              {currentLocation}
            </h1>
          </div>
        </div>

        {/* Location Search Form */}
        <div className="w-full md:w-auto flex-1 max-w-md">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t.weatherExtra?.searchPlaceholder || "Enter village, city, or district..."}
              className="w-full rounded-xl bg-white/10 py-3 pl-10 pr-24 text-sm font-medium text-white placeholder-gray-300 backdrop-blur-md border border-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="absolute right-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-40 transition-colors"
            >
              {t.weatherExtra?.update || "Update"}
            </button>
          </form>

          {/* Quick Village Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[11px] text-gray-300 font-medium mr-1">
              {t.weatherExtra?.quickSelect || "Quick Select:"}
            </span>
            {POPULAR_VILLAGES.map((loc) => {
              const isSelected = currentLocation
                .toLowerCase()
                .includes(loc.split(",")[0].toLowerCase());
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onLocationChange(loc)}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all ${
                    isSelected
                      ? "bg-emerald-500 text-white font-bold"
                      : "bg-white/10 text-gray-200 hover:bg-white/20"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                  {loc}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
