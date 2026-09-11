"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { IncomeRequest, IncomeResult } from "@/types";
import { calculateIncome, formatINR } from "@/lib/api";
import CropProfitChart from "@/components/income/CropProfitChart";
import CropTable from "@/components/income/CropTable";
import PageTitle from "@/components/shared/PageTitle";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { useTranslation } from "@/context/LanguageContext";

const CROP_LIST = [
  "wheat", "rice", "cotton", "potato", "onion", "tomato", "sugarcane",
  "soybean", "maize", "mustard", "chickpea", "lentil", "groundnut",
  "sunflower", "bajra", "jowar", "turmeric", "ginger", "garlic",
  "cauliflower", "cabbage", "spinach", "mango", "banana", "grapes"
];

export default function IncomePage() {
  const { t } = useTranslation();
  const [landSize, setLandSize] = useState<string>("5");
  const [season, setSeason] = useState<string>("All");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [result, setResult] = useState<IncomeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    const acres = parseFloat(landSize);
    if (isNaN(acres) || acres <= 0) {
      setError(t.income.errorLandSize);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const request: IncomeRequest = { land_size_acres: acres, season, selected_crop: selectedCrop || null };
      const res = await calculateIncome(request);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const bestCrop = result?.recommendations.find((r) => r.recommended);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-24 lg:pb-8 space-y-6">
      <PageTitle title={t.income.title} subtitle={t.income.subtitle} />

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="font-black text-[#2B2118] text-base">{t.income.farmDetails}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black text-[#475B63] uppercase tracking-wider mb-2">{t.income.landSize}</label>
            <input
              type="number"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              min={0.1}
              max={1000}
              step={0.5}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#49A078] bg-slate-50/50 text-[#2B2118] font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-[#475B63] uppercase tracking-wider mb-2">{t.income.season}</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#49A078] bg-slate-50/50 text-[#2B2118] font-bold"
            >
              {t.common.seasons.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-[#475B63] uppercase tracking-wider mb-2">{t.income.prefCrop}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#49A078] bg-slate-50/50 text-[#2B2118] font-bold"
            >
              <option value="">{t.income.anyCrop}</option>
              {CROP_LIST.map((c) => (<option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>))}
            </select>
          </div>
        </div>

        {error && <div className="pt-2"><ErrorBanner message={error} onDismiss={() => setError(null)} /></div>}

        <button
          onClick={handleCalculate}
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#216869] to-[#49A078] hover:from-[#1b5556] hover:to-[#3d8664] disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "📊"}
          <span>{loading ? t.income.calculating : t.income.calculate}</span>
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Transparency Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 font-medium text-center">
            ⚠️ Income estimates are based on reference agricultural data. Actual returns vary with yield, input costs, market prices, weather, crop quality, and location.
          </div>

          {bestCrop && (
            <div className="bg-gradient-to-r from-[#216869] to-[#49A078] text-white rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-[#EBEFC9] mb-1">
                  🏆 {t.income.bestChoice} {result.land_size_acres} {t.income.acres}
                </div>
                <div className="text-3xl font-black">{bestCrop.name}</div>
                <div className="text-emerald-100 mt-1 text-xs sm:text-sm font-bold">
                  {bestCrop.season} season · {bestCrop.water_need} water · {bestCrop.risk_level} risk
                </div>
              </div>
              <div className="sm:text-right bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="text-xs text-[#EBEFC9] font-black uppercase tracking-wider mb-0.5">{t.income.expectedProfit}</div>
                <div className="text-3xl font-black text-white">{formatINR(bestCrop.total_profit)}</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="font-black text-[#2B2118] mb-4 text-base">{t.income.revVsCost}</h3>
            <CropProfitChart recommendations={result.recommendations} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="font-black text-[#2B2118] mb-4 text-base">{t.income.detailedComp}</h3>
            <CropTable recommendations={result.recommendations} />
          </div>
        </div>
      )}
    </div>
  );
}