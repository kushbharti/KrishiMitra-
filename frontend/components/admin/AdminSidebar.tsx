"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  MessageSquare, 
  Settings,
  LogOut,
  Leaf
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: "Command Center", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Farmers Directory", href: "/admin/farmers", icon: Users },
    { name: "Telemetry & Scans", href: "/admin/telemetry", icon: Activity },
    { name: "AI Intercepts", href: "/admin/ai-logs", icon: MessageSquare },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-black tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#216869] to-[#49A078] flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="text-xl">Krishi<span className="text-[#49A078]">Mitra</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
        <div className="px-3 pb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          Enterprise Admin
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive 
                  ? "bg-[#216869]/20 text-[#49A078]" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} className={isActive ? "text-[#49A078]" : "text-slate-500"} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={18} className="text-slate-500" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
