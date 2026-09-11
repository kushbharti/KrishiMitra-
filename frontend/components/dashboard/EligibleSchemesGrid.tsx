"use client";

import React from "react";
import Link from "next/link";
import { Landmark, ArrowUpRight } from "lucide-react";
import { GovernmentScheme } from "@/types/dashboard";

const SCHEMES: GovernmentScheme[] = [
  {
    id: 1,
    title: "PM-KISAN",
    tag: "Income Support",
    benefit: "₹6,000/year direct financial assistance via DBT transfer.",
    status: "Active",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    title: "PMFBY",
    tag: "Insurance",
    benefit:
      "Comprehensive crop insurance coverage against natural calamities.",
    status: "Eligible",
    statusColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 3,
    title: "Soil Health Card",
    tag: "Testing",
    benefit: "Free soil testing & customized NPK nutrient recommendations.",
    status: "Action Needed",
    statusColor: "bg-rose-100 text-rose-700",
  },
  {
    id: 4,
    title: "eNAM Portal",
    tag: "Market",
    benefit: "Unified national agricultural market access for grain selling.",
    status: "Registered",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
];

export const EligibleSchemesGrid: React.FC = () => {
  return (
    <div className="col-span-1 md:col-span-12 bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="text-amber-500" size={20} />
            <span>Eligible Government Subsidy Schemes</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Central & Maharashtra agricultural aid automatically matched to your
            Kisan ID
          </p>
        </div>
        <Link
          href="/schemes"
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 text-center"
        >
          Explore All 12 Schemes →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SCHEMES.map((scheme) => (
          <div
            key={scheme.id}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {scheme.tag}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${scheme.statusColor}`}
                >
                  {scheme.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                {scheme.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {scheme.benefit}
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between w-full">
              <Link
                href="/schemes"
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                View Guidelines
              </Link>
              <Link
                href="/schemes"
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Apply</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
