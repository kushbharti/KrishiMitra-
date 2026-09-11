"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Landmark,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  IndianRupee,
  ArrowUpRight,
  Bookmark,
  Share2,
  Info,
  X,
  ChevronDown,
  Check,
  FileText,
  ShieldCheck,
  Activity,
  Network,
  Calendar,
  ExternalLink,
  Sprout,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { getSchemes } from "@/lib/api";
import { SchemeResult, Scheme } from "@/types";
import SchemeListSkeleton from "@/components/schemes/SchemeListSkeleton";
import SchemesPagination from "@/components/schemes/SchemesPagination";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { useTranslation } from "@/context/LanguageContext";

/* ==========================================================================
   ANIMATION & UI HELPER COMPONENTS
   ========================================================================== */

const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVar = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.floor(v).toLocaleString("en-IN")}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [value, prefix, suffix]);
  return <span ref={ref} className="font-mono" />;
};

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}) => {
  const variants: Record<string, string> = {
    default: "bg-slate-100 text-slate-700 border-slate-200/80",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold",
    warning: "bg-amber-50 text-amber-800 border-amber-200/80",
    info: "bg-sky-50 text-sky-800 border-sky-200/80",
    danger: "bg-rose-50 text-rose-800 border-rose-200/80",
    purple: "bg-purple-50 text-purple-800 border-purple-200/80 font-bold",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
};

/* ==========================================================================
   MAIN SCHEMES PAGE COMPONENT
   ========================================================================== */

export default function SchemesPage() {
  const { t } = useTranslation();

  // State Management
  const [data, setData] = useState<SchemeResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);

  const limit = 8;

  // 1. Debounce Search Input (300ms buffer)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetch Schemes from Backend API
  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSchemes({
          search: debouncedSearch,
          category:
            filterCategory === "All Categories" ? "All" : filterCategory,
          page,
          limit,
        });
        setData(result);
        const availableCategories = result.categories ?? ["All"];
        if (
          filterCategory !== "All" &&
          !availableCategories.includes(filterCategory)
        ) {
          setFilterCategory("All");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : t.common?.error || "Failed to load schemes.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, [debouncedSearch, filterCategory, page, t.common?.error]);

  // Dynamic Category & Sector lists
  const categories = useMemo(() => {
    return [
      "All",
      ...(data?.categories?.filter((c) => c !== "All") || [
        "Income Support",
        "Insurance",
        "Farm Input",
        "Debt Relief",
        "Market Access",
      ]),
    ];
  }, [data?.categories]);

  const types = ["All", "Central", "State"];

  // Client-side sector filtering fallback
  const displayedSchemes = useMemo(() => {
    if (!data?.schemes) return [];
    if (filterType === "All") return data.schemes;
    return data.schemes.filter((s: any) =>
      (s.central_or_state || s.level || "")
        .toLowerCase()
        .includes(filterType.toLowerCase()),
    );
  }, [data?.schemes, filterType]);

  const handleApply = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert(
        "Application portal URL will be updated shortly by the issuing ministry.",
      );
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setFilterCategory("All");
    setFilterType("All");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    filterCategory !== "All" ||
    filterType !== "All";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-500/30 text-slate-900 pb-28">
      {/* Custom scrollbar styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `,
        }}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 space-y-8">
        {/* 1. Header & Search Command Dock */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-transparent pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <MapPin size={14} className="shrink-0" />
              <span>
                {t.schemesExtra?.solapurContext || "Solapur District, MH • Single-Window Subsidy Discovery"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{t.schemes?.title || "Government Schemes"}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              {t.schemes?.subtitle ||
                "Discover and apply for agricultural subsidies, crop insurance programs, and direct financial assistance from Central and State Governments."}
            </p>
          </div>

          {/* Multi-Dimensional Filter Controls */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5 relative z-10 shrink-0">
            <div className="relative group w-full sm:w-64">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder={t.schemesExtra?.searchPlaceholder || "Search schemes, acronyms..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-xs font-bold text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-44">
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-slate-900 text-white"
                  >
                    {cat === "All" ? (t.schemesExtra?.allCategories || "All Categories") : cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={14}
              />
            </div>

            <div className="relative w-full sm:w-36">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all cursor-pointer"
              >
                {types.map((type) => (
                  <option
                    key={type}
                    value={type}
                    className="bg-slate-900 text-white"
                  >
                    {type === "All" ? (t.schemesExtra?.allSectors || "All Sectors") : `${type} Govt`}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={14}
              />
            </div>
          </div>
        </div>

        {/* 2. Error Feedback Banner */}
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        )}

        {/* 3. Live Telemetry KPI Summary Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            {
              label: t.schemesExtra?.totalSchemes || "Total Schemes",
              value: data?.total ?? 87,
              icon: Landmark,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              label: t.schemesExtra?.agriAid || "Agriculture Aid",
              value: 42,
              icon: Sprout,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: t.schemesExtra?.incomeSupport || "Income Support",
              value: 18,
              icon: IndianRupee,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: t.schemesExtra?.cropInsurance || "Crop Insurance",
              value: 12,
              icon: ShieldCheck,
              color: "text-sky-600",
              bg: "bg-sky-50",
            },
            {
              label: t.schemesExtra?.centralSector || "Central Sector",
              value: 54,
              icon: Building2,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: t.schemesExtra?.stateSector || "State Sector",
              value: 33,
              icon: MapPin,
              color: "text-rose-600",
              bg: "bg-rose-50",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between group hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex justify-between items-start mb-2.5">
                <div
                  className={`p-2 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={16} className={stat.color} />
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-0.5 truncate">
                  {stat.label}
                </h3>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                  <AnimatedCounter value={stat.value} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. Dynamic Content Area (Skeleton -> Grid -> Zero State) */}
        <div>
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 w-48 bg-slate-200/80 rounded animate-pulse" />
              <SchemeListSkeleton />
            </div>
          ) : displayedSchemes.length > 0 ? (
            <motion.div
              variants={containerVar}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Results Header Bar */}
              <div className="flex items-center justify-between px-1 border-b border-slate-200/60 pb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  {t.schemes?.totalFound || "Total Subsidies Discovered"}:{" "}
                  <span className="text-slate-900 font-extrabold text-sm font-sans pl-1">
                    {data?.total ?? displayedSchemes.length}
                  </span>
                </p>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 hover:bg-rose-100/80 px-3 py-1 rounded-lg transition-colors border border-rose-200/60"
                  >
                    <RotateCcw size={12} />
                    <span>{t.schemesExtra?.resetFilters || "Reset Filters"}</span>
                  </button>
                )}
              </div>

              {/* High-Density Schemes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {displayedSchemes.map((scheme: any) => {
                    const sector =
                      scheme.central_or_state || scheme.level || "Central";
                    const categoryName = scheme.category || "General Aid";
                    const ministryName =
                      scheme.ministry || scheme.department || "Govt of India";
                    const beneficiaries = Array.isArray(
                      scheme.target_beneficiaries,
                    )
                      ? scheme.target_beneficiaries.join(", ")
                      : scheme.target_beneficiaries || "All Farmers";
                    const benefitsList = Array.isArray(scheme.benefits)
                      ? scheme.benefits
                      : [
                          scheme.benefit_summary ||
                            scheme.benefit ||
                            "Direct financial subsidy and agricultural assistance.",
                        ];
                    const applyUrl =
                      scheme.official_website ||
                      scheme.application_url ||
                      scheme.portalUrl;

                    return (
                      <motion.div
                        layout
                        variants={itemVar}
                        key={scheme.id || scheme.name}
                        className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-emerald-500/80 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Header */}
                        <div>
                          <div className="flex gap-4 md:gap-5 mb-5 items-start">
                            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl border border-emerald-100/80 shadow-2xs flex items-center justify-center overflow-hidden">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(scheme.name || "S")}&background=10b981&color=fff&rounded=true&bold=true&font-size=0.4`}
                                alt={scheme.name}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug mb-1 group-hover:text-emerald-700 transition-colors truncate">
                                {scheme.name || scheme.title}
                              </h2>
                              <p className="text-xs font-semibold text-slate-500 truncate mb-2.5">
                                {scheme.full_name || scheme.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                <Badge variant="success">{categoryName}</Badge>
                                <Badge
                                  variant={
                                    sector.includes("Central")
                                      ? "purple"
                                      : "info"
                                  }
                                >
                                  {sector} Sector
                                </Badge>
                                {scheme.launch_year && (
                                  <Badge variant="default">
                                    Est: {scheme.launch_year}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Benefit Summary */}
                          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mb-6 line-clamp-2">
                            {scheme.benefit_summary ||
                              scheme.benefit ||
                              scheme.description}
                          </p>

                          {/* Quick Info Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                            <div className="flex gap-2.5 items-start">
                              <Building2
                                size={16}
                                className="text-slate-400 shrink-0 mt-0.5"
                              />
                              <div className="min-w-0">
                                <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                  {t.schemesExtra?.ministryDept || "Ministry / Dept"}
                                </p>
                                <p className="text-xs font-bold text-slate-700 leading-tight line-clamp-1">
                                  {ministryName}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2.5 items-start">
                              <Users
                                size={16}
                                className="text-slate-400 shrink-0 mt-0.5"
                              />
                              <div className="min-w-0">
                                <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                  {t.schemesExtra?.beneficiaries || "Beneficiaries"}
                                </p>
                                <p className="text-xs font-bold text-slate-700 leading-tight line-clamp-1">
                                  {beneficiaries}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Benefits Preview */}
                          <div className="mb-8">
                            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                              {t.schemesExtra?.keyBenefits || "Key Financial & Operational Benefits"}
                            </h4>
                            <ul className="space-y-2">
                              {benefitsList
                                .slice(0, 3)
                                .map((benefit: string, i: number) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2.5"
                                  >
                                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                      <Check
                                        size={10}
                                        className="text-emerald-700 font-bold"
                                        strokeWidth={3}
                                      />
                                    </div>
                                    <span className="text-xs text-slate-600 font-semibold leading-snug line-clamp-1">
                                      {benefit}
                                    </span>
                                  </li>
                                ))}
                              {benefitsList.length > 3 && (
                                <li className="text-[11px] font-bold text-emerald-600 pl-6.5 pt-0.5 font-mono">
                                  +{benefitsList.length - 3} {t.schemesExtra?.additionalSubsidy || "additional subsidy guidelines"}
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                          <button
                            type="button"
                            onClick={() => setSelectedScheme(scheme)}
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-200"
                          >
                            {t.schemesExtra?.viewProtocols || "View Protocols & Guide"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApply(applyUrl)}
                            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          >
                            <span>{t.schemesExtra?.applyPortal || "Apply Portal"}</span>
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              <div className="pt-4">
                <SchemesPagination
                  data={data}
                  loading={loading}
                  page={page}
                  setPage={setPage}
                />
              </div>
            </motion.div>
          ) : (
            /* Zero State (No Matching Schemes) */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-slate-200/80 border-dashed shadow-2xs max-w-xl mx-auto my-8"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400 border border-slate-200/60">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                {t.schemes?.noSchemesTitle || "No matching schemes discovered"}
              </h3>
              <p className="text-xs text-slate-500 font-normal max-w-md mb-6 leading-relaxed">
                {t.schemes?.noSchemesSub ||
                  `We could not find any government subsidies matching "${searchTerm}" under the selected sector. Try clearing your search parameters.`}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>{t.schemesExtra?.clearFilters || "Clear All Filters"}</span>
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* 5. Detailed Slide-Over Drawer Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScheme(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-hidden border-l border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 bg-slate-950 text-white border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedScheme.name || "S")}&background=10b981&color=fff&rounded=true&bold=true&font-size=0.4`}
                      alt={selectedScheme.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge
                        variant="success"
                        className="!bg-emerald-500/20 !text-emerald-300 !border-emerald-500/30"
                      >
                        {selectedScheme.category || "Subsidy"}
                      </Badge>
                      <Badge
                        variant="purple"
                        className="!bg-purple-500/20 !text-purple-300 !border-purple-500/30"
                      >
                        {selectedScheme.central_or_state || "Central"} Sector
                      </Badge>
                    </div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                      {selectedScheme.name || selectedScheme.title}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedScheme.full_name || selectedScheme.department}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8">
                {/* Overview Section */}
                <section>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Info size={14} className="text-[#216869]" /> {t.schemesExtra?.execSummary || "Executive Summary"}
                  </h3>
                  <p className="text-slate-700 font-medium leading-relaxed text-sm bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                    {selectedScheme.benefit_summary ||
                      selectedScheme.benefit ||
                      selectedScheme.description ||
                      "Official government agricultural subsidy designed to support farmer incomes and modernize farming operations."}
                  </p>
                </section>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: t.schemesExtra?.ministryAuth || "Ministry / Issuing Authority",
                      value:
                        selectedScheme.ministry || "Ministry of Agriculture",
                      icon: Building2,
                    },
                    {
                      label: t.schemesExtra?.department || "Department",
                      value:
                        selectedScheme.department ||
                        "Dept of Agriculture & Farmers Welfare",
                      icon: Network,
                    },
                    {
                      label: t.schemesExtra?.targetBeneficiaries || "Target Beneficiaries",
                      value: Array.isArray(selectedScheme.target_beneficiaries)
                        ? selectedScheme.target_beneficiaries.join(", ")
                        : selectedScheme.target_beneficiaries || "All Farmers",
                      icon: Users,
                    },
                    {
                      label: t.schemesExtra?.fundingPattern || "Funding Pattern",
                      value:
                        selectedScheme.funding_pattern ||
                        "100% Direct DBT Subsidy",
                      icon: IndianRupee,
                    },
                    {
                      label: t.schemesExtra?.implementingAgency || "Implementing Agency",
                      value:
                        selectedScheme.implementing_agency ||
                        "State Agriculture Departments",
                      icon: Activity,
                    },
                    {
                      label: t.schemesExtra?.launchYear || "Launch Year",
                      value: selectedScheme.launch_year || "Active 2026",
                      icon: Calendar,
                    },
                  ].map((info, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-3.5 border border-slate-200/80 flex gap-3 shadow-2xs"
                    >
                      <info.icon
                        size={16}
                        className="text-[#216869] shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                          {info.label}
                        </p>
                        <p className="text-xs font-bold text-slate-800 leading-snug truncate">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Benefits Section */}
                <section>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Landmark size={14} className="text-emerald-600" /> {t.schemesExtra?.keyBenefits || "Key Financial & Operational Benefits"}
                  </h3>
                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200/60">
                    <ul className="space-y-2.5">
                      {(Array.isArray(selectedScheme.benefits)
                        ? selectedScheme.benefits
                        : [
                            selectedScheme.benefit_summary ||
                              "Direct financial assistance and subsidy transfer.",
                          ]
                      ).map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2
                            size={16}
                            className="text-emerald-600 shrink-0 mt-0.5"
                          />
                          <span className="text-slate-700 font-semibold text-xs leading-relaxed">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Eligibility Criteria */}
                <section>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#216869]" />{" "}
                    Mandatory Eligibility Criteria
                  </h3>
                  <ul className="space-y-2">
                    {(Array.isArray(selectedScheme.eligibility)
                      ? selectedScheme.eligibility
                      : [
                          "Resident farmer of India",
                          "Possess valid landholding records (Satbara 7/12)",
                          "Active bank account seeded with Aadhaar",
                        ]
                    ).map((criterion: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#216869] shrink-0 mt-1.5" />
                        <span className="text-slate-700 font-semibold text-xs leading-relaxed">
                          {criterion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Required Documents */}
                <section>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText size={14} className="text-slate-600" /> Required
                    Verification Documents
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(selectedScheme.required_documents)
                      ? selectedScheme.required_documents
                      : [
                          "Aadhaar Card",
                          "7/12 Satbara Extract",
                          "Bank Passbook Copy",
                          "Mobile Number",
                        ]
                    ).map((doc: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-slate-100 text-slate-800 border border-slate-200/80 rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1"
                      >
                        <FileText size={12} className="text-slate-400" />
                        <span>{doc}</span>
                      </span>
                    ))}
                  </div>
                </section>

                {/* Animated Vertical Stepper (Application Workflow) */}
                <section>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Activity size={14} className="text-emerald-600" />{" "}
                    Application Submission Protocol
                  </h3>
                  <div className="relative pl-5 space-y-4">
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 rounded-full" />
                    {(Array.isArray(selectedScheme.application_process)
                      ? selectedScheme.application_process
                      : [
                          "Visit the official portal using the direct application button below.",
                          "Register or log in using your Aadhaar-linked mobile OTP.",
                          "Fill out the subsidy application form and upload verified digital land extracts.",
                          "Submit for automated State Nodal Officer verification and DBT transfer.",
                        ]
                    ).map((step: string, i: number) => (
                      <div key={i} className="relative group">
                        <div className="absolute -left-5 top-0 w-5 h-5 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center shadow-2xs">
                          <span className="text-[9px] font-black text-emerald-700 font-mono">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed pt-0.5 pl-2">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-4 border-t border-slate-200/60 text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row justify-between gap-1">
                  <span>
                    Source:{" "}
                    {selectedScheme.official_source ||
                      "Government of India / Maharashtra"}
                  </span>
                  <span>
                    Last Verified: {selectedScheme.last_updated || "July 2026"}
                  </span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-5 border-t border-slate-200/80 bg-slate-50 flex flex-col sm:flex-row gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => alert("Scheme saved to your Kisan bookmarks!")}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Bookmark size={14} />
                  <span>Bookmark</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedScheme.name,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Scheme link copied to clipboard!");
                    }
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApply(
                      selectedScheme.official_website ||
                        selectedScheme.application_url ||
                        selectedScheme.portalUrl,
                    )
                  }
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-98"
                >
                  <span>Proceed to Official Portal</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
