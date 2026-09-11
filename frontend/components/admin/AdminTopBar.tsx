"use client";

import React from "react";
import { Search, Bell, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminTopBar() {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#49A078] transition-colors"
            placeholder="Search telemetry, farmers, or logs... (⌘K)"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-slate-900">{user?.name || "System Admin"}</div>
            <div className="text-xs font-semibold text-[#49A078] flex items-center justify-end gap-1">
              <Shield size={12} />
              Verified Clearance
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </div>
  );
}
