"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Droplet,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  RefreshCw,
} from "lucide-react";
import { DiseasePredictionResponse } from "@/types";

interface DiseaseResultCardProps {
  result: DiseasePredictionResponse;
  onSwitchCrop?: (newCrop: string) => void;
}

type TabId = "overview" | "treatment" | "prevention" | "recovery";

const SEVERITY_STYLES: Record<
  string,
  { badge: string; border: string; text: string }
> = {
  Critical: {
    badge: "bg-red-500 text-white animate-pulse",
    border: "border-red-200 bg-red-50/50",
    text: "text-red-700",
  },
  High: {
    badge: "bg-orange-500 text-white",
    border: "border-orange-200 bg-orange-50/50",
    text: "text-orange-700",
  },
  Medium: {
    badge: "bg-amber-500 text-white",
    border: "border-amber-200 bg-amber-50/50",
    text: "text-amber-700",
  },
  Low: {
    badge: "bg-emerald-500 text-white",
    border: "border-emerald-200 bg-emerald-50/50",
    text: "text-emerald-700",
  },
};

export default function DiseaseResultCard({
  result,
  onSwitchCrop,
}: DiseaseResultCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedPredIndex, setSelectedPredIndex] = useState<number>(0);
  const router = useRouter();

  const {
    predictions,
    low_confidence,
    message,
    selected_crop,
    detected_crop,
    crop_match,
  } = result;

  const activePred = predictions[selectedPredIndex] || predictions[0];
  const sevStyle =
    SEVERITY_STYLES[activePred.severity] || SEVERITY_STYLES.Medium;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Intelligent Crop Mismatch Warning Banner */}
      {!crop_match && (
        <div className="rounded-3xl border-2 border-red-400 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 p-5 shadow-lg animate-shake">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="rounded-full bg-red-500 p-2.5 text-white shadow-md flex-shrink-0 mt-0.5">
                <AlertTriangle size={22} />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-200/80 text-red-900 font-extrabold text-[10px] uppercase tracking-wider mb-1">
                  Crop Mismatch Detected
                </span>
                <h4 className="font-black text-gray-900 text-base">
                  The uploaded image appears to belong to a different crop than
                  the one you selected.
                </h4>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  You selected{" "}
                  <span className="font-bold underline">{selected_crop}</span>,
                  but our AI is{" "}
                  <span className="font-black text-red-700">
                    {result.confidence}% confident
                  </span>{" "}
                  that this image belongs to{" "}
                  <span className="font-black text-emerald-800 underline">
                    {detected_crop}
                  </span>
                  .
                </p>
              </div>
            </div>

            {onSwitchCrop && (
              <button
                type="button"
                onClick={() => onSwitchCrop(detected_crop)}
                className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <RefreshCw size={14} /> Select {detected_crop} & Re-analyze
              </button>
            )}
          </div>
        </div>
      )}

      {/* Low Confidence Warning Banner */}
      {low_confidence && crop_match && (
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-amber-500 p-2 text-white shadow-md flex-shrink-0 mt-0.5">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">
                Low Prediction Confidence
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Diagnosis Hero Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/50 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-purple-500/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              {crop_match ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
                  <CheckCircle2 size={13} className="text-emerald-600" /> ✓ Crop
                  Verified: Matches {selected_crop}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-sm">
                  ⚠️ Showing Results for {activePred.crop}
                </span>
              )}
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${sevStyle.badge}`}
              >
                {activePred.severity} Severity
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 pt-1">
              {activePred.healthy ? "🌱" : "🦠"} {activePred.disease}
            </h2>
            <p className="text-sm font-medium text-gray-500">
              Detected Botanical Crop:{" "}
              <span className="text-gray-800 font-bold">{activePred.crop}</span>{" "}
              (Viewing Card #{selectedPredIndex + 1} of 4)
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end bg-gray-50 p-3.5 rounded-2xl border border-gray-200/60 min-w-[150px]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Confidence Score
            </span>
            <span
              className={`text-3xl font-black ${
                activePred.confidence >= 80
                  ? "text-emerald-600"
                  : activePred.confidence >= 60
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {activePred.confidence}%
            </span>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  activePred.confidence >= 80
                    ? "bg-emerald-500"
                    : activePred.confidence >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${activePred.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* CLICKABLE Top 4 Prediction Distribution Cards */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Eye size={14} className="text-emerald-600" /> Top 4 Model
              Predictions — Click any card to view its agronomic details:
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {predictions.map((pred, idx) => {
              const isSelected = selectedPredIndex === idx;
              const isNA = pred.disease === "N/A";
              const isSelectedCropCard = pred.crop === selected_crop;

              return (
                <div
                  key={idx}
                  onClick={() => !isNA && setSelectedPredIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-all duration-200 ${
                    isNA
                      ? "bg-gray-100/60 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                      : isSelected
                        ? "bg-emerald-50 border-2 border-emerald-500 font-bold text-emerald-950 shadow-md shadow-emerald-500/10 scale-[1.01] cursor-pointer"
                        : "bg-gray-50/80 border-gray-200/80 text-gray-700 hover:bg-gray-100/80 hover:border-gray-300 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-500"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                            isSelectedCropCard
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          [{pred.crop}]
                        </span>
                        <p className="truncate text-sm font-semibold">
                          {pred.disease}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 font-normal mt-0.5">
                        {pred.healthy
                          ? "No pathogen pressure"
                          : isNA
                            ? "Empty slot"
                            : "Pathogen detected"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="font-mono font-bold text-sm">
                      {pred.confidence}%
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation for Selected Prediction */}
        <div className="mt-6 flex border-b border-gray-200 gap-2 overflow-x-auto pb-1">
          {[
            { id: "overview", label: "Overview & Causes", icon: HeartPulse },
            { id: "treatment", label: "Treatment Plan", icon: Droplet },
            { id: "prevention", label: "Prevention", icon: ShieldCheck },
            { id: "recovery", label: "Recovery Tips", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Content Display */}
        <div className="pt-5 min-h-[180px] bg-gray-50/40 p-4 rounded-b-2xl border-x border-b border-gray-100">
          {activeTab === "overview" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Observed Symptoms for {activePred.crop} — {activePred.disease}
                </h5>
                <ul className="space-y-2">
                  {activePred.symptoms.map((symptom, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-gray-200/60">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Root Cause & Environmental Factors
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {activePred.causes}
                </p>
              </div>
            </div>
          )}

          {activeTab === "treatment" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Actionable Step-by-Step Treatment
                </h5>
                <ol className="space-y-2.5">
                  {activePred.treatment.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mt-0.5 shadow-sm">
                        {i + 1}
                      </span>
                      <span className="mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {activePred.fungicide && (
                <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4 mt-3 shadow-sm">
                  <h6 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplet size={14} className="text-purple-600" />{" "}
                    Recommended Chemical Spray / Fungicide
                  </h6>
                  <p className="text-sm font-bold text-purple-950 mt-1">
                    {activePred.fungicide}
                  </p>
                  <p className="text-[11px] text-purple-700 mt-1.5">
                    * Always wear protective PPE and follow local agricultural
                    extension dosing guidelines before chemical application.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "prevention" && (
            <div className="space-y-3 animate-fade-in">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Long-Term Prevention Strategies
              </h5>
              <ul className="space-y-2.5">
                {activePred.prevention.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-gray-700"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 flex-shrink-0 mt-0.5"
                    />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "recovery" && (
            <div className="space-y-3 animate-fade-in">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Post-Treatment Recovery Tips
              </h5>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 p-4 shadow-sm">
                <p className="text-sm text-emerald-950 leading-relaxed font-medium">
                  {activePred.recovery_tips ||
                    "Maintain balanced irrigation and avoid excessive nitrogen fertilizer while the plant recovers from stress."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Integration Footer */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-gray-800">
              Need custom dosing advice for {activePred.disease}?
            </p>
            <p className="text-[11px] text-gray-500">
              Ask our AI Agronomy Assistant about field preparation and weather
              timing.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              router.push(
                `/assistant?q=${encodeURIComponent(
                  `I detected ${activePred.disease} on my ${activePred.crop} crop with ${activePred.confidence}% confidence. What is the best treatment plan?`,
                )}`,
              )
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles size={14} /> Ask AI About {activePred.disease}{" "}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
