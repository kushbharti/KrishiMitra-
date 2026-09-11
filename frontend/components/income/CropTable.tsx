"use client";

import { useState } from "react";
import { CropRecommendation } from "@/types";
import { formatINR } from "@/lib/api";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  recommendations: CropRecommendation[];
}

type SortKey = keyof CropRecommendation;

const RISK_COLORS: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

const WATER_COLORS: Record<string, string> = {
  Low: "bg-sky-100 text-sky-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-indigo-100 text-indigo-700",
};

export default function CropTable({ recommendations }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("total_profit");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...recommendations].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp size={14} className="text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp size={14} className="text-green-600" />
    ) : (
      <ChevronDown size={14} className="text-green-600" />
    );
  };

  const Th = ({ label, col }: { label: string; col: SortKey }) => (
    <th
      onClick={() => handleSort(col)}
      className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon col={col} />
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Crop
            </th>
            <Th label="Revenue" col="total_revenue" />
            <Th label="Cost" col="total_cost" />
            <Th label="Net Profit" col="total_profit" />
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Water
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Risk
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Season
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Data Source
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map((crop) => (
            <tr
              key={crop.id}
              className={`hover:bg-gray-50 transition-colors ${
                crop.recommended ? "bg-green-50/50 font-medium" : ""
              }`}
            >
              <td className="px-3 py-3 text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  {crop.recommended && (
                    <span className="text-amber-500 text-xs">🏆</span>
                  )}
                  {crop.name}
                </div>
              </td>
              <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{formatINR(crop.total_revenue)}</td>
              <td className="px-3 py-3 text-red-600 whitespace-nowrap">{formatINR(crop.total_cost)}</td>
              <td className="px-3 py-3 text-green-700 font-semibold whitespace-nowrap">{formatINR(crop.total_profit)}</td>
              <td className="px-3 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${WATER_COLORS[crop.water_need] || "bg-gray-100 text-gray-600"}`}>
                  {crop.water_need}
                </span>
              </td>
              <td className="px-3 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${RISK_COLORS[crop.risk_level] || "bg-gray-100 text-gray-600"}`}>
                  {crop.risk_level}
                </span>
              </td>
              <td className="px-3 py-3 text-gray-600 text-xs">{crop.season}</td>
              <td className="px-3 py-3 text-xs">
                <div className="flex flex-col">
                  <span className={`font-semibold ${crop.isVerified ? 'text-slate-700' : 'text-amber-600'}`}>
                    {crop.source}
                  </span>
                  <span className="text-slate-400 text-[10px] uppercase">
                    {crop.sourceYear} • {crop.geography}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}