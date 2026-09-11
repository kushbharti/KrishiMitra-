"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Maximize2,
  CloudSun,
  Droplets,
  Wind,
  Umbrella,
  Target,
} from "lucide-react";

export const WeatherIntelligenceCard: React.FC = () => {
  return (
    <div className="col-span-1 lg:col-span-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border border-slate-800 rounded-3xl text-white relative overflow-hidden flex flex-col p-6 shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/15 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-start relative z-10 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-black uppercase tracking-wider mb-1">
            <MapPin size={12} />
            <span>Solapur District, MH</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Weather Risk Analysis
          </h2>
        </div>
        <Link
          href="/weather"
          title="Open Full Weather Telemetry"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10 text-slate-300 hover:text-white"
        >
          <Maximize2 size={16} />
        </Link>
      </div>

      <div className="flex items-center justify-between relative z-10 mb-6">
        <div>
          <div className="flex items-start">
            <span className="text-5xl font-black font-mono tracking-tighter">
              28
            </span>
            <span className="text-xl font-bold text-slate-400 mt-1">°C</span>
          </div>
          <p className="text-slate-300 font-medium text-xs mt-1">
            Feels like 31°C • Moderate Humidity
          </p>
        </div>
        <CloudSun
          size={56}
          strokeWidth={1.5}
          className="text-sky-300 drop-shadow-[0_0_20px_rgba(125,211,252,0.4)]"
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5 relative z-10 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
          <Droplets size={16} className="text-sky-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Humidity
          </span>
          <span className="text-xs font-black text-white font-mono">72%</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
          <Wind size={16} className="text-sky-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Wind
          </span>
          <span className="text-xs font-black text-white font-mono">
            14 km/h
          </span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
          <Umbrella size={16} className="text-sky-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Rain Prob.
          </span>
          <span className="text-xs font-black text-white font-mono">40%</span>
        </div>
      </div>

      <div className="mt-auto bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 relative z-10 flex items-start gap-3">
        <div className="bg-amber-500 p-1.5 rounded-xl shrink-0 mt-0.5">
          <Target size={14} className="text-white" />
        </div>
        <div>
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block mb-0.5">
            Agronomy Action Protocol
          </span>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Precipitation forecasted tomorrow evening. Postpone top-dressing
            urea fertilizer by 24 hours to prevent nitrogen leaching.
          </p>
        </div>
      </div>
    </div>
  );
};
