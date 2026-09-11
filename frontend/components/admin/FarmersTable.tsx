"use client";

import React, { useState } from "react";
import { FarmerProfile } from "@/types/admin";
import { FileText, MoreHorizontal } from "lucide-react";

interface Props {
  farmers: FarmerProfile[];
  loading: boolean;
}

export default function FarmersTable({ farmers, loading }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.email_or_phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLangBadge = (lang: string) => {
    switch (lang) {
      case "hi": return <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-bold font-mono">HI</span>;
      case "mr": return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-bold font-mono">MR</span>;
      default: return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold font-mono">EN</span>;
    }
  };

  if (loading) {
    return <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse"></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Directory</h2>
        </div>
        <input 
          type="text" 
          placeholder="Filter farmers..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-[#49A078]"
        />
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs font-bold text-slate-500 uppercase bg-white border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Farmer</th>
              <th className="px-5 py-3">Lang</th>
              <th className="px-5 py-3">Scans</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Last Active</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFarmers.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-bold text-slate-900">{f.name}</div>
                  <div className="text-xs text-slate-500">{f.email_or_phone}</div>
                </td>
                <td className="px-5 py-3">{getLangBadge(f.selected_language)}</td>
                <td className="px-5 py-3 font-mono text-slate-600">{f.total_scans}</td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(f.registered_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(f.last_scan_date).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-slate-600">{f.location}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    f.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal className="w-4 h-4 ml-auto" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFarmers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-500 font-medium">
                  No farmers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
