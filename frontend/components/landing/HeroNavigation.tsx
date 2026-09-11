"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface HeroNavigationProps {
  onSelectAuth: (view: "scanner" | "login" | "signup") => void;
  activeView: string;
}

export default function HeroNavigation({
  onSelectAuth,
  activeView,
}: HeroNavigationProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-6 sm:px-12 py-6 flex justify-between items-center text-white">
      <button
        type="button"
        onClick={() => onSelectAuth("scanner")}
        className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
          <Leaf className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xl font-bold tracking-tight leading-none">
            Agro<span className="text-emerald-400">Vision</span>
          </span>
        </div>
      </button>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onSelectAuth("login")}
          className={`text-sm font-bold transition-colors px-3 py-2 cursor-pointer ${activeView === "login" ? "text-emerald-400" : "text-white/90 hover:text-white"}`}
        >
          Sign In
        </button>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <button
            type="button"
            onClick={() => onSelectAuth("signup")}
            className="px-6 py-2.5 bg-white text-slate-950 rounded-full text-sm font-bold shadow-lg hover:bg-emerald-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Sign Up
          </button>
        </motion.div>
      </div>
    </header>
  );
}
