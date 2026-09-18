"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutDashboard, Users, Activity, FileText } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-[#216869]/20 selection:text-[#216869]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 pb-32">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Fixed Bottom Quick-Command Dock (Tactile developer dock) */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 280, damping: 24 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1"
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-[#216869] hover:bg-[#1a5354] text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:scale-105 active:scale-95 shrink-0"
          >
            <LayoutDashboard size={14} />
            <span>Command Center</span>
          </Link>

          <div className="w-px h-5 bg-slate-800 mx-1 shrink-0" />

          {[
            {
              icon: Users,
              label: "Farmers Directory",
              href: "/admin/farmers",
            },
            {
              icon: Activity,
              label: "Telemetry",
              href: "/admin/telemetry",
            },
            {
              icon: FileText,
              label: "AI Logs",
              href: "/admin/ai-logs",
            },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              title={action.label}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all relative group flex items-center justify-center hover:scale-110 active:scale-95 shrink-0"
            >
              <action.icon size={16} />
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-mono font-bold rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                {action.label}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
