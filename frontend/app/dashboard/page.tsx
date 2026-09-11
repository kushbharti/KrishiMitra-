"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, animate } from "framer-motion";
import {
  Leaf,
  Bot,
  TrendingUp,
  Building2,
  CalendarDays,
  ArrowRight,
  Clock,
  MapPin,
  Scan,
  Sun,
  Zap,
  Target,
  Activity,
  Umbrella,
  ArrowUpRight,
  ArrowDownRight,
  CloudSun,
  Droplets,
  Wind,
  Maximize2,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  Send,
  Sparkles,
  ExternalLink,
  History,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import PageTitle from "@/components/shared/PageTitle";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

/* ==========================================================================
   CONSTANTS & STATIC TELEMETRY DATA
   ========================================================================== */

const PIE_DATA = [
  { name: "Healthy", value: 85, color: "#10b981" },
  { name: "Observation", value: 10, color: "#f59e0b" },
  { name: "Critical", value: 5, color: "#f43f5e" },
];

const RECENT_SCANS = [
  {
    id: 1,
    crop: "Tomato",
    disease: "Early Blight",
    confidence: 98.7,
    severity: "Moderate",
    time: "2h ago",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 2,
    crop: "Sugarcane",
    disease: "Red Rot",
    confidence: 94.2,
    severity: "High",
    time: "5h ago",
    image:
      "https://images.unsplash.com/photo-1629162618991-37d45761891d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 3,
    crop: "Cotton",
    disease: "Healthy",
    confidence: 99.1,
    severity: "None",
    time: "1d ago",
    image:
      "https://images.unsplash.com/photo-1583152226297-c75c87ce7111?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 4,
    crop: "Pomegranate",
    disease: "Bacterial Blight",
    confidence: 91.5,
    severity: "High",
    time: "1d ago",
    image:
      "https://images.unsplash.com/photo-1528659132204-58ec73d9c3bd?auto=format&fit=crop&q=80&w=150",
  },
];

const RECENT_ACTIVITY_TIMELINE = [
  {
    id: 1,
    title: "Pathogen Diagnostic Completed",
    desc: "Tomato specimen analyzed. Early Blight lesion recognized with 98.7% confidence score.",
    time: "10:30 AM",
    icon: Scan,
    color: "bg-rose-500 text-white border-rose-600",
  },
  {
    id: 2,
    title: "AI Remediation Protocol Generated",
    desc: "Consulted AI copilot regarding fungicide rotation and canopy management.",
    time: "10:45 AM",
    icon: Bot,
    color: "bg-emerald-600 text-white border-emerald-700",
  },
  {
    id: 3,
    title: "Microclimate Alert Triggered",
    desc: "Precipitation warning issued for Solapur APMC district. Urea spraying delayed.",
    time: "01:15 PM",
    icon: CloudSun,
    color: "bg-sky-500 text-white border-sky-600",
  },
  {
    id: 4,
    title: "Subsidy Eligibility Verified",
    desc: "Matched kisan profile with PMFBY crop insurance coverage guidelines.",
    time: "03:00 PM",
    icon: Landmark,
    color: "bg-amber-500 text-white border-amber-600",
  },
];

const SCHEMES = [
  {
    id: 1,
    title: "PM-KISAN",
    tag: "Income Support",
    benefit: "₹6,000/year direct financial assistance via DBT transfer.",
    status: "Active",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: 2,
    title: "PMFBY",
    tag: "Insurance",
    benefit:
      "Comprehensive crop insurance coverage against natural calamities.",
    status: "Eligible",
    statusColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: 3,
    title: "Soil Health Card",
    tag: "Testing",
    benefit: "Free soil testing & customized NPK nutrient recommendations.",
    status: "Action Needed",
    statusColor: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    id: 4,
    title: "eNAM Portal",
    tag: "Market",
    benefit: "Unified national agricultural market access for grain selling.",
    status: "Registered",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

/* ==========================================================================
   HELPER COMPONENTS
   ========================================================================== */

const AnimatedCounter = ({
  value,
  isCurrency,
}: {
  value: number;
  isCurrency?: boolean;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) {
          const formatted = Math.floor(v).toLocaleString("en-IN");
          ref.current.textContent = isCurrency ? `₹${formatted}` : formatted;
        }
      },
    });
    return () => controls.stop();
  }, [value, isCurrency]);
  return <span ref={ref} className="font-mono" />;
};

/* ==========================================================================
   MAIN DASHBOARD PAGE
   ========================================================================== */

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading } = useAuth();
  const currentMonth = new Date().getMonth();
  const [chatInput, setChatInput] = useState("");
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    // Generate dynamic time respecting user locale/timezone
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setTimeStr(formatter.format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine dynamic location
  const locationStr = user?.district 
    ? `${user.district}, ${user.state || ""}` 
    : "Location not specified";

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      router.push(`/assistant?prompt=${encodeURIComponent(chatInput.trim())}`);
    } else {
      router.push("/assistant");
    }
  };

  // Localized Quick Actions mapping directly to your dictionary
  const quickActions = [
    {
      label: t.nav?.disease || "Disease Detection",
      href: "/disease",
      icon: <Leaf className="w-4 h-4 text-white" />,
      color: "bg-[#216869] hover:bg-[#1a5354]",
    },
    {
      label: t.nav?.assistant || "AI Assistant",
      href: "/assistant",
      icon: <Bot className="w-4 h-4 text-white" />,
      color: "bg-[#49A078] hover:bg-[#3d8664]",
    },
    {
      label: t.nav?.income || "Income Advisor",
      href: "/income",
      icon: <TrendingUp className="w-4 h-4 text-white" />,
      color: "bg-[#BD5532] hover:bg-[#9e4629]",
    },
    {
      label: t.nav?.schemes || "Govt Schemes",
      href: "/schemes",
      icon: <Building2 className="w-4 h-4 text-white" />,
      color: "bg-[#475B63] hover:bg-[#38484e]",
    },
  ];

  const currentSeasonCrops = [
    { name: "Wheat", color: "bg-slate-100 text-slate-800 border-slate-200/80" },
    {
      name: "Mustard",
      color: "bg-slate-100 text-slate-800 border-slate-200/80",
    },
    {
      name: "Potato",
      color: "bg-slate-100 text-slate-800 border-slate-200/80",
    },
    {
      name: "Chickpea",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold",
    },
    { name: "Onion", color: "bg-slate-100 text-slate-800 border-slate-200/80" },
    {
      name: "Spinach",
      color: "bg-slate-100 text-slate-800 border-slate-200/80",
    },
  ];

  // Multilingual KPI Cards (Sharp industry-level borders, zero puffiness)
  const statsMetrics = [
    {
      label: t.dashboard?.stats?.crops || "Crops Monitored",
      value: 25,
      trend: 8,
      icon: Target,
      color: "text-[#216869]",
      bg: "bg-[#216869]/10",
    },
    {
      label: t.dashboard?.stats?.diseases || "Diseases Detected",
      value: 15,
      trend: -12,
      icon: Activity,
      color: "text-[#BD5532]",
      bg: "bg-[#BD5532]/10",
    },
    {
      label: t.dashboard?.stats?.schemes || "Eligible Schemes",
      value: 10,
      trend: 2,
      icon: Landmark,
      color: "text-[#49A078]",
      bg: "bg-[#49A078]/10",
    },
    {
      label: t.nav?.weather || "Weather Alerts",
      value: 2,
      trend: 0,
      icon: Umbrella,
      color: "text-sky-600",
      bg: "bg-sky-500/10",
    },
    {
      label: t.nav?.assistant || "AI Consultations",
      value: 341,
      trend: 24,
      icon: Bot,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      label: t.nav?.income || "Est. Profit",
      value: 245000,
      trend: 18,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      isCurrency: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="h-12 w-64 bg-slate-200 rounded-lg"></div>
          
          {/* Hero Skeleton */}
          <div className="h-64 w-full bg-slate-200 rounded-2xl"></div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-96 bg-slate-200 rounded-2xl"></div>
            <div className="lg:col-span-4 h-96 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Page Title with Multilingual Context */}
        <PageTitle
          title={t.dashboard?.title || "Farmer Command Center"}
          subtitle={
            t.dashboard?.subtitle ||
            "Real-time AI telemetry and agronomic operations"
          }
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Row 1: Contextual Welcome Hero */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 md:col-span-12 relative overflow-hidden bg-slate-950 rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-800/80"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                  <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-1.5 text-slate-300 text-xs font-semibold font-mono">
                    <Clock size={12} className="text-emerald-400 shrink-0" />{" "}
                    {timeStr || "Loading time..."}
                  </div>
                  <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-1.5 text-slate-300 text-xs font-semibold font-mono">
                    <MapPin size={12} className="text-emerald-400 shrink-0" />{" "}
                    {locationStr}
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">
                  {t.dashboard?.title || "Good Morning, Kisan."} <br />
                  <span className="text-emerald-400 font-semibold">
                    {t.dashboard?.subtitle || "Ready to optimize your harvest?"}
                  </span>
                </h1>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mb-6 font-normal">
                  {t.dashboard?.rabiNotice ||
                    "Manage your crops, monitor farm health, execute sub-second AI disease diagnostics, and discover eligible government subsidies from one command center."}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/disease"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    <Scan size={16} />
                    <span>{t.nav?.disease || "Run AI Disease Diagnostic"}</span>
                  </Link>
                  <Link
                    href="/assistant"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
                  >
                    <Bot size={16} className="text-emerald-400" />
                    <span>{t.nav?.assistant || "Ask Agronomy Copilot"}</span>
                  </Link>
                </div>
              </div>

              {/* Solapur Weather Micro-Snippet (Clean SaaS Box) */}
              <div className="hidden lg:flex flex-col items-end shrink-0">
                <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl w-72 shadow-xs relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2.5 relative z-10">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                        {t.dashboardExtra?.solapurMicroclimate || "Solapur Microclimate"}
                      </span>
                      <div className="text-2xl font-black text-white font-mono tracking-tight mt-0.5">
                        28°C
                      </div>
                    </div>
                    <Sun size={28} className="text-amber-400" />
                  </div>
                  <div className="text-slate-300 font-semibold text-xs mb-3 relative z-10">
                    {t.dashboardExtra?.partlyCloudy || "Partly Cloudy • High 32° / Low 22°"}
                  </div>
                  <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800/80 relative z-10">
                    <p className="text-[11px] text-slate-300 font-normal leading-relaxed flex items-start gap-2">
                      <Zap
                        size={14}
                        className="text-amber-400 shrink-0 mt-0.5"
                      />
                      <span>
                        {t.dashboard?.weatherTipTitle ||
                          "Optimal conditions for foliar nutrient spraying today."}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Row 2: Localized Quick Actions Rail (Sharp 1px border, refined SaaS cards) */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 md:col-span-12 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.dashboard?.quickActions || "Quick Operational Actions"}
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                ⌘K to search
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`${action.color} text-white rounded-xl p-3.5 flex items-center justify-between text-xs font-bold transition-all shadow-2xs group`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="p-1.5 rounded-lg bg-black/15 shrink-0">
                      {action.icon}
                    </div>
                    <span className="truncate">{action.label}</span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1"
                  />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Row 3: 6-Card KPI Telemetry Grid (Crisp SaaS cards, monospaced numbers) */}
          {statsMetrics.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs transition-all duration-150 group cursor-default"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className={`p-2 rounded-xl ${stat.bg} shrink-0`}>
                  <stat.icon size={16} className={stat.color} />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${
                    stat.trend >= 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-rose-50 text-rose-700 border border-rose-200/60"
                  }`}
                >
                  {stat.trend >= 0 ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-0.5 truncate">
                  {stat.label}
                </h3>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                  <AnimatedCounter
                    value={stat.value}
                    isCurrency={stat.isCurrency}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Row 4: Weather Intelligence & Localized Season Preview */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 md:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left: Weather Risk Analysis Card with Localized Tip */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-2xl text-white relative overflow-hidden flex flex-col p-6 shadow-xs justify-between">
              <div>
                <div className="flex justify-between items-start relative z-10 mb-5">
                  <div>
                    <div className="flex items-center gap-1.5 text-sky-400 text-[10px] font-bold font-mono uppercase tracking-wider mb-1">
                      <MapPin size={12} />
                      <span>{t.dashboardExtra?.solapurMicroclimate || "Solapur District, MH"}</span>
                    </div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {t.nav?.weather || "Weather Risk Analysis"}
                    </h2>
                  </div>
                  <Link
                    href="/weather"
                    title="Open Full Weather Telemetry"
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800 text-slate-400 hover:text-white"
                  >
                    <Maximize2 size={14} />
                  </Link>
                </div>

                <div className="flex items-center justify-between relative z-10 mb-6">
                  <div>
                    <div className="flex items-start">
                      <span className="text-4xl font-extrabold font-mono tracking-tighter">
                        28
                      </span>
                      <span className="text-lg font-bold text-slate-400 mt-1">
                        °C
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium text-xs mt-1">
                      {t.dashboardExtra?.partlyCloudy || "Feels like 31°C • Moderate Humidity"}
                    </p>
                  </div>
                  <CloudSun
                    size={48}
                    strokeWidth={1.5}
                    className="text-sky-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 relative z-10 mb-5">
                  <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1">
                    <Droplets size={14} className="text-sky-400" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {t.dashboardExtra?.humidity || "Humidity"}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      72%
                    </span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1">
                    <Wind size={14} className="text-sky-400" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {t.dashboardExtra?.wind || "Wind"}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      14 km/h
                    </span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1">
                    <Umbrella size={14} className="text-sky-400" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {t.dashboardExtra?.rainProb || "Rain Prob."}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      40%
                    </span>
                  </div>
                </div>
              </div>

              {/* Localized Weather Advisory Tip */}
              <div className="mt-auto bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative z-10 flex items-start gap-3 text-slate-200">
                <span className="text-base mt-0.5 bg-slate-800 p-1.5 rounded-lg border border-slate-700/80 shrink-0">
                  ⚠️
                </span>
                <div>
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wider block mb-0.5 text-emerald-400">
                    {t.dashboard?.weatherTipTitle || "Agronomy Advisory Tip"}
                  </span>
                  <p className="text-xs font-normal leading-relaxed text-slate-300">
                    {t.dashboard?.weatherTipText ||
                      "Precipitation forecasted tomorrow evening. Postpone top-dressing urea fertilizer by 24 hours."}{" "}
                    <Link
                      href="/weather"
                      className="underline font-bold text-emerald-400 inline-flex items-center mt-0.5"
                    >
                      <span>{t.dashboard?.checkRisks || "Check Risks"}</span> →
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Localized Season Crop Preview & Health Distribution Pie Chart */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h2 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                    <span>
                      {t.dashboard?.seasonPreview || "Season Preview"} —{" "}
                      {t.common?.months?.[currentMonth] || "July"}
                    </span>
                  </h2>
                  <Link
                    href="/calendar"
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>{t.dashboard?.fullCalendar || "Full Calendar"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Seasonal Crop Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1 mb-6">
                  {currentSeasonCrops.map((crop) => (
                    <span
                      key={crop.name}
                      className={`${crop.color} px-3 py-1 rounded-lg text-xs font-semibold border shadow-2xs`}
                    >
                      {crop.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Crop Health Recharts Distribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                <div className="relative h-40 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-xl border border-slate-800 font-mono">
                                <p>
                                  {data.name}:{" "}
                                  <span className="text-emerald-400 font-bold">
                                    {data.value}%
                                  </span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                      85<span className="text-xs">%</span>
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-0.5 font-mono">
                      <ShieldCheck size={10} /> {t.dashboardExtra?.healthyCrops || "Healthy"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      label: t.dashboardExtra?.healthyCrops || "Healthy Crops",
                      count: 120,
                      total: 142,
                      color: "bg-emerald-500",
                    },
                    {
                      label: t.dashboardExtra?.observation || "Observation",
                      count: 15,
                      total: 142,
                      color: "bg-amber-500",
                    },
                    {
                      label: t.dashboardExtra?.criticalRisk || "Critical Risk",
                      count: 7,
                      total: 142,
                      color: "bg-rose-500",
                    },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="text-slate-900 font-mono">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{
                            width: `${(item.count / item.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 font-normal">
                ℹ️{" "}
                {t.dashboard?.rabiNotice ||
                  "Rabi season soil preparation begins next month. Ensure soil testing is completed."}
              </p>
            </div>
          </motion.div>

          {/* Row 5: Diagnostic Scan Logs Table (7 cols) + AI Assistant Chat Copilot Widget (5 cols) */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 md:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Recent AI Diagnostic Scans Table */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    {t.dashboardExtra?.recentDiagnostics || t.nav?.disease || "Recent AI Pathogen Diagnostics"}
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    {t.dashboardExtra?.diagnosticLogs || "Cellular inference logs from your Solapur field scans"}
                  </p>
                </div>
                <Link
                  href="/disease"
                  className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>{t.dashboardExtra?.newUpload || "New Upload"}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead className="bg-slate-50/80 border-b border-slate-100 font-mono">
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 pl-5">{t.dashboardExtra?.cropSpecimen || "Crop Specimen"}</th>
                      <th className="py-3">{t.dashboardExtra?.aiDiagnosis || "AI Diagnosis"}</th>
                      <th className="py-3">{t.dashboardExtra?.confidence || "Confidence"}</th>
                      <th className="py-3 text-right pr-5">{t.dashboardExtra?.severity || "Severity"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    {RECENT_SCANS.map((scan) => (
                      <tr
                        key={scan.id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        <td className="py-2.5 pl-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                              <img
                                src={scan.image}
                                alt={scan.crop}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-bold text-slate-900 text-xs">
                              {scan.crop}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            {scan.disease === "Healthy" ? (
                              <CheckCircle2
                                size={14}
                                className="text-emerald-500 shrink-0"
                              />
                            ) : (
                              <AlertTriangle
                                size={14}
                                className="text-rose-500 shrink-0"
                              />
                            )}
                            <span
                              className={
                                scan.disease === "Healthy"
                                  ? "text-emerald-700 font-bold"
                                  : "text-slate-900 font-bold"
                              }
                            >
                              {scan.disease}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2 w-24">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${scan.confidence}%` }}
                              />
                            </div>
                            <span className="font-mono text-slate-700 font-bold text-[11px]">
                              {scan.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 text-right pr-5">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded-md uppercase tracking-wider ${
                              scan.severity === "High"
                                ? "bg-rose-100 text-rose-700 border border-rose-200/60"
                                : scan.severity === "Moderate"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200/60"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200/60"
                            }`}
                          >
                            {scan.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <Link
                  href="/disease"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>{t.dashboardExtra?.viewArchive || "View Complete Diagnostic Archive"}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* AI Assistant Chat Copilot Widget (Replaces the Financial Profit Graph) */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
                      <Bot size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                        <span>{t.dashboardExtra?.aiCopilot || t.nav?.assistant || "AI Agronomy Copilot"}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </h2>
                      <p className="text-[11px] text-slate-500 font-normal">
                        {t.dashboardExtra?.llmContext || "Specialized agricultural LLM • Solapur Context"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/assistant"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors"
                    title="Open Full AI Workspace"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>

                {/* Simulated Diagnostic Remediation Response Card */}
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                    <span>{t.dashboardExtra?.inferenceAdvisory || "Inference: Solapur Kharif Advisory"}</span>
                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                      98.7% Conf
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {t.dashboardExtra?.remediationDesc || "Based on your recent Tomato Early Blight scan, immediately initiate a foliar application of Mancozeb 75% WP at 2.5g/liter of water. Avoid overhead sprinkler irrigation."}
                  </p>
                </div>

                {/* Interactive Suggested Prompt Chips */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    {t.dashboardExtra?.suggestedPrompts || "Suggested Prompts"}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      "🌾 What are optimal Rabi sowing dates for wheat?",
                      "🧪 Calculate urea fertilizer dosage for 5 acres",
                      "🏛 How do I apply for PM-KISAN subsidy transfer?",
                    ].map((prompt, idx) => (
                      <Link
                        key={idx}
                        href={`/assistant?prompt=${encodeURIComponent(prompt)}`}
                        className="text-left text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 px-3 py-2 rounded-lg transition-all truncate block shadow-2xs"
                      >
                        {prompt}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Functional Input Bar Routing directly to /assistant */}
              <form
                onSubmit={handleChatSubmit}
                className="relative mt-auto pt-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t.dashboardExtra?.askPlaceholder || "Ask anything about crops, pathology, or schemes..."}
                  className="w-full bg-slate-100/80 border border-slate-200/80 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 mt-1 p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
                  aria-label="Send to AI Assistant"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Row 6: Recent System Activity Timeline (4 cols) + Government Schemes Matrix (8 cols) */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 md:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left: System Telemetry & Recent Activity Timeline */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                      <History className="w-4 h-4 text-emerald-600" />
                      <span>{t.dashboardExtra?.systemActivity || "System Activity & Audit Trail"}</span>
                    </h2>
                    <p className="text-[11px] text-slate-500 font-normal">
                      {t.dashboardExtra?.realtimeTelemetry || "Real-time telemetry across Solapur operations"}
                    </p>
                  </div>
                </div>

                {/* Vertical SaaS Timeline Rail */}
                <div className="relative pl-6 space-y-4 my-2">
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200/80" />

                  {RECENT_ACTIVITY_TIMELINE.map((item) => (
                    <div key={item.id} className="relative group">
                      <div
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center border shadow-2xs ${item.color}`}
                      >
                        <item.icon size={9} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-slate-900">
                            {item.title}
                          </h3>
                          <span className="text-[9px] font-mono font-semibold text-slate-400 shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 mt-4 border-t border-slate-100 flex justify-end">
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                >
                  <span>{t.dashboardExtra?.viewTelemetryLog || "View Complete Telemetry Audit Log"}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: Government Schemes Matrix (8 cols, 4 cards rendered in a 2x2 grid) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-3.5 border-b border-slate-100 gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                      <Landmark className="text-amber-500" size={18} />
                      <span>
                        {t.dashboardExtra?.eligibleSchemes || t.nav?.schemes || "Eligible Government Subsidy Schemes"}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      {t.dashboardExtra?.aidMatched || "Central & Maharashtra agricultural aid matched to your Kisan ID"}
                    </p>
                  </div>
                  <Link
                    href="/schemes"
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs shrink-0 text-center"
                  >
                    {t.dashboardExtra?.exploreSchemes || "Explore All Schemes →"}
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {SCHEMES.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all duration-150 flex flex-col justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2.5">
                          <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                            {scheme.tag}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider rounded border ${scheme.statusColor}`}
                          >
                            {scheme.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">
                          {scheme.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          {scheme.benefit}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between w-full">
                        <Link
                          href="/schemes"
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          {t.dashboardExtra?.viewGuidelines || "View Guidelines"}
                        </Link>
                        <Link
                          href="/schemes"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span>{t.dashboardExtra?.apply || "Apply"}</span>
                          <ArrowUpRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{t.dashboardExtra?.dbtVerified || "Direct Benefit Transfer (DBT) Verified"}</span>
                <span>{t.dashboardExtra?.lastSynced || "Last Synced: Today, 02:15 AM IST"}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fixed Bottom Quick-Command Dock (Tactile developer dock) */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 280, damping: 24 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1"
      >
        <Link
          href="/disease"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:scale-105 active:scale-95 shrink-0"
        >
          <Scan size={14} />
          <span>{t.nav?.disease || "Scan Crop"}</span>
        </Link>

        <div className="w-px h-5 bg-slate-800 mx-1 shrink-0" />

        {[
          {
            icon: Bot,
            label: t.nav?.assistant || "Ask AI",
            href: "/assistant",
          },
          {
            icon: CloudSun,
            label: t.nav?.weather || "Weather",
            href: "/weather",
          },
          {
            icon: Landmark,
            label: t.nav?.schemes || "Schemes",
            href: "/schemes",
          },
          {
            icon: CalendarDays,
            label: t.nav?.calendar || "Calendar",
            href: "/calendar",
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
  );
}
