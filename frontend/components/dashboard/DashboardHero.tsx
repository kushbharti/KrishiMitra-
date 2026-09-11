"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, MapPin, Scan, Bot, Sun, Zap } from "lucide-react";

const CURRENT_DATE = "Monday, July 27, 2026";
const LOCATION = "Solapur, Maharashtra, India";

export const DashboardHero: React.FC = () => {
  return (
    <div className="col-span-1 md:col-span-12 relative overflow-hidden bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl mt-4 border border-slate-800">
      {/* Cinematic Background Gradients */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-900/95 to-transparent pointer-events-none" />
      <div className="absolute -right-40 -top-40 w-[500px] h-[500px] bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center gap-2 text-emerald-300 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
              <Clock size={12} className="shrink-0" /> {CURRENT_DATE}
            </div>
            <div className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full flex items-center gap-2 text-white/80 text-xs font-bold tracking-wide backdrop-blur-md">
              <MapPin size={12} className="shrink-0" /> {LOCATION}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Good Morning, Kisan. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Ready to optimize your harvest?
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mb-8 font-medium">
            Monitor real-time crop telemetry, execute neural pathogen
            diagnostics, receive automated Solapur APMC mandi alerts, and
            discover eligible government subsidies from one command center.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/disease"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-98"
            >
              <Scan size={18} />
              <span>Run AI Disease Diagnostic</span>
            </Link>
            <Link
              href="/assistant"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-98"
            >
              <Bot size={18} className="text-emerald-400" />
              <span>Ask Agronomy Assistant</span>
            </Link>
          </div>
        </div>

        {/* Live Weather Micro-Snippet */}
        <div className="hidden lg:flex flex-col items-end shrink-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/15 p-6 rounded-3xl w-72 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/15 blur-2xl rounded-full pointer-events-none" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">
                  Solapur Microclimate
                </span>
                <div className="text-3xl font-black text-white font-mono tracking-tight mt-0.5">
                  28°C
                </div>
              </div>
              <Sun size={32} className="text-amber-400 animate-spin-slow" />
            </div>
            <div className="text-slate-300 font-bold text-xs mb-3 relative z-10">
              Partly Cloudy • High 32° / Low 22°
            </div>
            <div className="bg-black/30 rounded-2xl p-3 border border-white/10 relative z-10">
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed flex items-start gap-2">
                <Zap size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Optimal conditions for foliar nutrient spraying today. Wind
                  speeds at 14 km/h.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
