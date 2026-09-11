"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { DiagnosticScan } from "@/types/dashboard";

const RECENT_SCANS: DiagnosticScan[] = [
  {
    id: 1,
    crop: "Tomato",
    disease: "Early Blight",
    confidence: 98.7,
    severity: "Moderate",
    time: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 2,
    crop: "Sugarcane",
    disease: "Red Rot",
    confidence: 94.2,
    severity: "High",
    time: "5 hours ago",
    image:
      "https://images.unsplash.com/photo-1629162618991-37d45761891d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 3,
    crop: "Cotton",
    disease: "Healthy",
    confidence: 99.1,
    severity: "None",
    time: "1 day ago",
    image:
      "https://images.unsplash.com/photo-1583152226297-c75c87ce7111?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 4,
    crop: "Pomegranate",
    disease: "Bacterial Blight",
    confidence: 91.5,
    severity: "High",
    time: "1 day ago",
    image:
      "https://images.unsplash.com/photo-1528659132204-58ec73d9c3bd?auto=format&fit=crop&q=80&w=150",
  },
];

export const RecentScansTable: React.FC = () => {
  return (
    <div className="col-span-1 lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recent AI Pathogen Diagnostics
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Cellular inference logs from your Solapur field scans
          </p>
        </div>
        <Link
          href="/disease"
          className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
        >
          <span>New Upload</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 pl-6">Crop Specimen</th>
              <th className="py-3.5">AI Diagnosis</th>
              <th className="py-3.5">Confidence Score</th>
              <th className="py-3.5">Severity</th>
              <th className="py-3.5 text-right pr-6">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold">
            {RECENT_SCANS.map((scan) => (
              <tr
                key={scan.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                <td className="py-3.5 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                      <img
                        src={scan.image}
                        alt={scan.crop}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      {scan.crop}
                    </span>
                  </div>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-1.5">
                    {scan.disease === "Healthy" ? (
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 shrink-0"
                      />
                    ) : (
                      <AlertTriangle
                        size={16}
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
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5 w-32">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${scan.confidence}%` }}
                      />
                    </div>
                    <span className="font-mono text-slate-700 font-bold">
                      {scan.confidence}%
                    </span>
                  </div>
                </td>
                <td className="py-3.5">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${
                      scan.severity === "High"
                        ? "bg-rose-100 text-rose-700"
                        : scan.severity === "Moderate"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {scan.severity}
                  </span>
                </td>
                <td className="py-3.5 text-right pr-6 text-slate-400 font-medium font-mono">
                  {scan.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
        <Link
          href="/disease"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <span>View Complete Diagnostic Archive</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};
