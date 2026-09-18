"use client";

import React, { useEffect, useState } from "react";
import { FarmerProfile } from "@/types/admin";
import {
  Users, Search, Filter, Download, RefreshCw, MapPin,
  Scan, Globe, ArrowUpDown, ChevronDown, ChevronUp,
  Activity, Calendar, MoreHorizontal, CheckCircle2, XCircle
} from "lucide-react";

type SortField = "name" | "total_scans" | "registered_at" | "last_scan_date";
type SortDir = "asc" | "desc";

const LANG_META: Record<string, { label: string; color: string; bg: string }> = {
  hi: { label: "Hindi", color: "text-orange-700", bg: "bg-orange-100" },
  mr: { label: "Marathi", color: "text-purple-700", bg: "bg-purple-100" },
  en: { label: "English", color: "text-blue-700", bg: "bg-blue-100" },
  te: { label: "Telugu", color: "text-teal-700", bg: "bg-teal-100" },
  ta: { label: "Tamil", color: "text-rose-700", bg: "bg-rose-100" },
};

export default function FarmersDirectoryPage() {
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("registered_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchFarmers = async (lang = "all") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/farmers?language=${lang}`);
      if (!res.ok) throw new Error("Failed to load farmers directory.");
      setFarmers(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFarmers(langFilter); }, [langFilter]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const filtered = farmers
    .filter(f => {
      const q = search.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.email_or_phone.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q)
      ) && (statusFilter === "all" || f.status === statusFilter);
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "total_scans") return (a.total_scans - b.total_scans) * dir;
      return String(a[sortField]).localeCompare(String(b[sortField])) * dir;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total: farmers.length,
    active: farmers.filter(f => f.status === "Active").length,
    inactive: farmers.filter(f => f.status === "Inactive").length,
    totalScans: farmers.reduce((s, f) => s + f.total_scans, 0),
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    sortField === field
      ? (sortDir === "asc" ? <ChevronUp size={12} className="text-[#49A078]" /> : <ChevronDown size={12} className="text-[#49A078]" />)
      : <ArrowUpDown size={12} className="text-slate-400 opacity-50" />
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Farmers Directory</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Comprehensive registry of registered agricultural operators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchFarmers(langFilter)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#216869] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#1a5354] transition-colors">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Farmers", value: stats.total, icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "Active", value: stats.active, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
          { label: "Inactive", value: stats.inactive, icon: XCircle, color: "bg-slate-100 text-slate-500" },
          { label: "Total Scans", value: stats.totalScans, icon: Scan, color: "bg-[#216869]/10 text-[#216869]" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-3xl font-black text-slate-900 font-mono tracking-tight">{loading ? "—" : value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
              <Icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, contact, or location…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#49A078] bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          {/* Lang Filter */}
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-slate-400" />
            <select
              value={langFilter}
              onChange={e => { setLangFilter(e.target.value); setPage(1); }}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#49A078] font-medium text-slate-700"
            >
              <option value="all">All Languages</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="en">English</option>
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#49A078] font-medium text-slate-700"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="text-xs text-slate-400 font-mono ml-auto">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm font-medium">{error}</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                      Farmer <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-5 py-3">Language</th>
                  <th className="px-5 py-3">
                    <button onClick={() => toggleSort("total_scans")} className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                      Scans <SortIcon field="total_scans" />
                    </button>
                  </th>
                  <th className="px-5 py-3">
                    <button onClick={() => toggleSort("registered_at")} className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                      Joined <SortIcon field="registered_at" />
                    </button>
                  </th>
                  <th className="px-5 py-3">
                    <button onClick={() => toggleSort("last_scan_date")} className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                      Last Active <SortIcon field="last_scan_date" />
                    </button>
                  </th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-slate-100 rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                  : paginated.map((f) => {
                    const lang = LANG_META[f.selected_language] || LANG_META["en"];
                    return (
                      <tr key={f.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#216869] to-[#49A078] flex items-center justify-center text-white font-bold text-xs shrink-0">
                              {f.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{f.name}</div>
                              <div className="text-xs text-slate-500">{f.email_or_phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${lang.bg} ${lang.color}`}>
                            {f.selected_language.toUpperCase()}
                            <span className="font-normal ml-1 opacity-70">· {lang.label}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-[#49A078] rounded-full"
                                style={{ width: `${Math.min(100, (f.total_scans / 30) * 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-slate-700 font-semibold text-xs">{f.total_scans}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                            <Calendar size={11} className="text-slate-400" />
                            {new Date(f.registered_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                            <Activity size={11} className="text-slate-400" />
                            {new Date(f.last_scan_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                            <MapPin size={11} className="text-slate-400" />
                            {f.location}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            f.status === "Active"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${f.status === "Active" ? "bg-green-500" : "bg-slate-400"}`} />
                            {f.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button className="text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <Users size={32} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500 font-semibold text-sm">No farmers match your filters</p>
                      <p className="text-slate-400 text-xs mt-1">Try adjusting search or filter criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <p className="text-xs text-slate-500 font-medium">
                Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                      p === page
                        ? "bg-[#216869] text-white"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
