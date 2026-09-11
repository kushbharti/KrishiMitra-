"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Loader2,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  UploadCloud,
  X,
  CheckCircle2,
  HeartPulse,
  Droplet,
  Eye,
  Camera,
  FileText,
  HelpCircle,
  Activity,
  Award,
  BookOpen,
} from "lucide-react";
import { fetchSupportedCrops, predictDisease } from "@/lib/api";
import { DiseasePredictionResponse, TopPrediction } from "@/types";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { useTranslation } from "@/context/LanguageContext";
import { getCropAdvisory } from "@/lib/advisoryHelper"; // <-- NEW IMPORT

// Royalty-free agricultural imagery mapping
const REAL_CROP_IMAGES: Record<string, string> = {
  Apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  Blueberry: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80",
  Cashew: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  Cassava: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
  Cherry: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
  Chilli: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
  Citrus: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80",
  "Corn / Maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
  Cotton: "https://images.unsplash.com/photo-1594913785162-e6785f782352?auto=format&fit=crop&w=600&q=80",
  Grape: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80",
  Groundnut: "https://images.unsplash.com/photo-1567892305148-52264fa58efc?auto=format&fit=crop&w=600&q=80",
  Orange: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80",
  Papaya: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80",
  Peach: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=600&q=80",
  "Bell Pepper": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
  Potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  Raspberry: "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?auto=format&fit=crop&w=600&q=80",
  Rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80",
  Soybean: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=600&q=80",
  Squash: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=600&q=80",
  Strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
  Sugarcane: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=600&q=80",
  Tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  Wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
};

type TabId = "symptoms" | "causes" | "treatment" | "prevention" | "fertilizer" | "pesticide" | "organic";

export default function DiseaseDetectionPage() {
  const { t, language } = useTranslation(); // Extracted language context
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [crops, setCrops] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<DiseasePredictionResponse | null>(null);
  const [selectedPredIndex, setSelectedPredIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabId>("symptoms");

  const [isLoadingCrops, setIsLoadingCrops] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load supported crops
  useEffect(() => {
    let isMounted = true;
    const loadCrops = async () => {
      try {
        setIsLoadingCrops(true);
        const cropList = await fetchSupportedCrops();
        if (isMounted) {
          setCrops(cropList);
          setIsLoadingCrops(false);
        }
      } catch {
        if (isMounted) {
          setErrorMessage(t.disease?.errorLoadCrops || "Failed to load supported crops. Please refresh.");
          setIsLoadingCrops(false);
        }
      }
    };
    loadCrops();
    return () => { isMounted = false; };
  }, [t.disease?.errorLoadCrops]);

  // Image Processing & Validation
  const validateAndProcessFile = useCallback((file: File) => {
    setErrorMessage(null);
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedExtensions.includes(ext) || !file.type.startsWith("image/")) {
      setErrorMessage("Invalid file format. Please upload only JPG, JPEG, PNG, or WEBP leaf images.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(`File size exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB). Please compress your image.`);
      return;
    }

    setImageFile(file);
    setPredictionResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleClearImage = useCallback(() => {
    setImageFile(null);
    setPreviewUrl(null);
    setPredictionResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const executeDetection = async (targetCrop: string, fileToAnalyze: File) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setPredictionResult(null);
    try {
      const result = await predictDisease(targetCrop, fileToAnalyze);
      setPredictionResult(result);
      setSelectedPredIndex(0);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : t.common?.error || "Model inference failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDetectDisease = () => {
    if (!selectedCrop) return setErrorMessage(t.disease?.errorSelectCrop || "Please select a supported crop first.");
    if (!imageFile) return setErrorMessage(t.disease?.errorUploadImage || "Please upload a leaf photograph.");
    executeDetection(selectedCrop, imageFile);
  };

  const handleSwitchCrop = (newCrop: string) => {
    setSelectedCrop(newCrop);
    if (imageFile) executeDetection(newCrop, imageFile);
  };

  const handleResetWorkflow = () => {
    setSelectedCrop("");
    handleClearImage();
  };

  // Extract the Active Prediction and Mapped JSON Advisory
  const activePred: TopPrediction | undefined =
    predictionResult?.predictions[selectedPredIndex] ||
    predictionResult?.predictions[0];
    
  // Load the full multilingual advisory from the JSON using the helper
  const advisory = activePred ? getCropAdvisory(activePred.disease, language) : null;

  const severityColors: Record<string, string> = {
    Critical: "bg-red-500 text-white animate-pulse",
    High: "bg-[#BD5532] text-white",
    Moderate: "bg-amber-500 text-white",
    Low: "bg-[#49A078] text-white",
    None: "bg-emerald-500 text-white",
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1] py-8 px-4 sm:px-6 lg:px-8 text-[#2B2118]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-[#216869] border border-slate-200/80 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#49A078]" />
            <span>AI Crop Disease Detection Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#2B2118]">
            {t.disease?.title || "Instant Diagnostic & Clinical Advisory"}
          </h1>
          <p className="text-sm sm:text-base text-[#475B63] font-medium leading-relaxed">
            {t.disease?.subtitle || "Select your crop, upload an image of an affected leaf, and let our computer vision model identify pathogens, calculate confidence scores, and formulate immediate chemical & organic recovery plans."}
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: UPLOAD & WORKFLOW CONTROLS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="crop-select" className="text-xs font-black uppercase tracking-wider text-[#475B63]">
                  {t.diseaseExtra?.step1Label || "Step 1: Select Target Botanical Crop"} <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-bold text-[#729B79]">{t.diseaseExtra?.modelsCount || "24 Certified Models"}</span>
              </div>

              {isLoadingCrops ? (
                <div className="py-4 flex items-center justify-center gap-2 text-xs font-bold text-[#475B63]">
                  <Loader2 className="w-4 h-4 text-[#49A078] animate-spin" />
                  <span>Loading crop configurations...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    id="crop-select"
                    value={selectedCrop}
                    onChange={(e) => {
                      setSelectedCrop(e.target.value);
                      setPredictionResult(null);
                    }}
                    disabled={isAnalyzing}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#2B2118] focus:outline-none focus:ring-2 focus:ring-[#49A078] transition-all disabled:opacity-50"
                  >
                    <option value="" disabled>{t.diseaseExtra?.chooseCrop || "-- Choose a crop from the supported list --"}</option>
                    {crops.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
                  </select>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                    {crops.slice(0, 8).map((cropName) => {
                      const isSelected = selectedCrop === cropName;
                      return (
                        <button
                          key={cropName}
                          type="button"
                          onClick={() => { setSelectedCrop(cropName); setPredictionResult(null); }}
                          disabled={isAnalyzing}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex-shrink-0 ${
                            isSelected ? "bg-[#216869] text-white border-[#216869] shadow-sm scale-105" : "bg-slate-50 text-[#475B63] border-slate-200 hover:bg-slate-100 hover:text-[#2B2118]"
                          }`}
                        >
                          {REAL_CROP_IMAGES[cropName] && (
                            <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
                              <Image src={REAL_CROP_IMAGES[cropName]} alt={cropName} fill sizes="20px" className="object-cover" />
                            </div>
                          )}
                          <span>{cropName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <label className="text-xs font-black uppercase tracking-wider text-[#475B63] block">
                {t.diseaseExtra?.step2Label || "Step 2: Upload Leaf Photograph"} <span className="text-red-500">*</span>
              </label>

              {previewUrl ? (
                <div className="space-y-4 animate-scale-up">
                  <div className="relative overflow-hidden rounded-3xl border-2 border-[#49A078]/40 bg-slate-900 shadow-md group h-72 sm:h-80 flex items-center justify-center">
                    <Image src={previewUrl} alt="Leaf preview" fill sizes="(max-w-768px) 100vw, 600px" className="object-contain" />
                    {isAnalyzing && <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#49A078] to-transparent shadow-[0_0_15px_#49A078] animate-scan z-20" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-5 z-10">
                      <div className="text-white">
                        <p className="text-xs font-black truncate max-w-xs">{imageFile?.name}</p>
                        <p className="text-[10px] font-mono text-slate-300">{imageFile?.size ? (imageFile.size / 1024 / 1024).toFixed(2) : "0"} MB · Ready for AI</p>
                      </div>
                      <button type="button" onClick={handleClearImage} disabled={isAnalyzing} className="p-2.5 rounded-2xl bg-red-600/90 hover:bg-red-700 text-white shadow-lg transition-all" title="Remove Image">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); if (!isAnalyzing) setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (isAnalyzing || !e.dataTransfer.files?.length) return; validateAndProcessFile(e.dataTransfer.files[0]); }}
                  onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-200 cursor-pointer ${
                    isAnalyzing ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed" : isDragging ? "border-[#49A078] bg-[#49A078]/10 scale-[0.99]" : "border-slate-300 bg-slate-50/50 hover:border-[#49A078] hover:bg-[#49A078]/5"
                  }`}
                >
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.length && validateAndProcessFile(e.target.files[0])} disabled={isAnalyzing} className="hidden" />
                  <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-[#49A078] mb-4">
                    <UploadCloud className="w-8 h-8 animate-bounce" />
                  </div>
                  <p className="text-base font-black text-[#2B2118]">
                    {t.diseaseExtra?.dragDrop || "Drag and drop leaf image here, or browse files"}
                  </p>
                  <p className="text-xs font-medium text-[#475B63] mt-1">{t.diseaseExtra?.supportedFormats || "Supported formats: JPG, JPEG, PNG, WEBP (Max upload size: 5MB)"}</p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200/60 w-full justify-center text-[11px] font-bold text-[#729B79]">
                    <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> {t.diseaseExtra?.goodLight || "Good natural light"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {t.diseaseExtra?.singleFocus || "Single leaf focus"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Run Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleDetectDisease}
                disabled={!selectedCrop || !imageFile || isAnalyzing}
                className={`w-full py-4 px-8 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2.5 transition-all duration-200 ${
                  !selectedCrop || !imageFile || isAnalyzing ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-[#216869] to-[#49A078] text-white shadow-[#49A078]/25 hover:from-[#1b5556] hover:to-[#3d8664] hover:-translate-y-0.5"
                }`}
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>{t.diseaseExtra?.evaluating || "Analyzing Botanical Patterns..."}</span></>
                ) : (
                  <><Sparkles className="w-5 h-5" /><span>{t.diseaseExtra?.runDetection || "Run AI Disease Detection"}</span></>
                )}
              </button>

              {(selectedCrop || imageFile || predictionResult) && (
                <button type="button" onClick={handleResetWorkflow} disabled={isAnalyzing} className="w-full py-2.5 rounded-xl text-xs font-bold text-[#475B63] hover:text-[#2B2118] hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /><span>{t.diseaseExtra?.resetWorkflow || "Reset Workflow & Clear Results"}</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: JSON-INTEGRATED CLINICAL ADVISORY */}
          <div className="lg:col-span-5 space-y-6">
            {isAnalyzing ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-10 shadow-xl flex flex-col items-center justify-center min-h-[520px] space-y-5 text-center animate-fade-in">
                <div className="w-24 h-24 rounded-full bg-[#9CC5A1]/20 border-4 border-[#49A078]/30 flex items-center justify-center animate-pulse">
                  <Activity className="w-10 h-10 text-[#216869] animate-bounce" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h3 className="text-lg font-black text-[#2B2118]">{t.diseaseExtra?.evaluating || "Evaluating Cellular Pathology"}</h3>
                  <p className="text-xs font-medium text-[#475B63]">{t.diseaseExtra?.extracting || "Extracting RGB centroids and evaluating neural network logits across all 75 botanical classes..."}</p>
                </div>
                <div className="w-full max-w-xs space-y-2 pt-4">
                  <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-[#49A078] rounded-full w-2/3 animate-pulse" />
                  </div>
                </div>
              </div>
            ) : predictionResult && activePred && advisory ? (
              <div className="space-y-6 animate-fade-in">
                {/* Crop Mismatch Verification */}
                {!predictionResult.crop_match && (
                  <div className="rounded-3xl border-2 border-red-400 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 p-5 shadow-lg animate-shake">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="rounded-2xl bg-red-500 p-2.5 text-white shadow-md flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-200/80 text-red-900 font-black text-[10px] uppercase tracking-wider mb-1">{t.diseaseExtra?.cropMismatch || "Crop Mismatch Detected"}</span>
                          <h4 className="font-black text-[#2B2118] text-sm">Image appears to be {predictionResult.detected_crop}, not {predictionResult.selected_crop}.</h4>
                        </div>
                      </div>
                      <button type="button" onClick={() => handleSwitchCrop(predictionResult.detected_crop)} className="w-full sm:w-auto flex-shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#216869] to-[#49A078] text-white font-black text-xs shadow-md">
                        Switch to {predictionResult.detected_crop}
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Diagnostic Hero Card from JSON Data */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-[#9CC5A1]/20 blur-2xl pointer-events-none" />

                  <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${severityColors[advisory.severityLevel] || "bg-slate-500 text-white"}`}>
                          {advisory.severityLevel} Severity
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase border border-slate-200">
                          {advisory.pathogenType}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-[#2B2118] tracking-tight">{advisory.diseaseName}</h2>
                      <p className="text-xs font-bold text-[#475B63] mt-0.5">{t.diseaseExtra?.botanicalFamily || "Botanical Family:"} <span className="text-[#216869] font-black">{advisory.crop}</span></p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-right min-w-[110px] flex-shrink-0">
                      <span className="text-[10px] font-black uppercase text-[#729B79] block">Confidence</span>
                      <span className="text-2xl font-black text-[#216869] font-mono block leading-tight">{activePred.confidence}%</span>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#49A078] rounded-full transition-all duration-1000" style={{ width: `${activePred.confidence}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Top Prediction Selection Grid */}
                  <div className="mt-5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#729B79] flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#49A078]" /> {t.diseaseExtra?.clickCard || "Click any card to switch advisory view:"}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {predictionResult.predictions.map((pred, idx) => {
                        const isSelected = selectedPredIndex === idx;
                        const isNA = pred.disease === "N/A";
                        return (
                          <button key={idx} type="button" onClick={() => !isNA && setSelectedPredIndex(idx)} disabled={isNA} className={`p-2.5 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between ${isNA ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" : isSelected ? "bg-[#49A078]/10 border-[#49A078] text-[#216869] font-black shadow-2xs scale-[1.02]" : "bg-white border-slate-200/80 text-[#475B63] hover:bg-slate-50 hover:border-slate-300 font-bold"}`}>
                            <div className="truncate pr-1">
                              <p className="text-xs truncate">{pred.disease.replace(/_/g, " ")}</p>
                            </div>
                            <span className="font-mono text-xs font-black">{pred.confidence}%</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* JSON Integrated Tab System */}
                <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xl">
                  <div className="flex border-b border-slate-100 bg-slate-50/60 overflow-x-auto">
                    {[
                      { id: "symptoms", label: t.diseaseExtra?.symptomsTab || "Symptoms", icon: HeartPulse },
                      { id: "treatment", label: t.diseaseExtra?.actionTab || "Action Plan", icon: Droplet },
                      { id: "prevention", label: t.diseaseExtra?.preventionTab || "Prevention", icon: ShieldCheck },
                      { id: "fertilizer", label: t.diseaseExtra?.clinicalTab || "Clinical Rx", icon: BookOpen },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as TabId)} className={`flex items-center gap-2 px-5 py-3.5 text-xs font-black whitespace-nowrap border-b-2 transition-all ${isActive ? "border-[#49A078] text-[#216869] bg-white shadow-xs" : "border-transparent text-[#475B63] hover:text-[#2B2118] hover:bg-slate-100/50"}`}>
                          <Icon className={`w-4 h-4 ${isActive ? "text-[#49A078]" : "text-[#729B79]"}`} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-6 min-h-[220px]">
                    {activeTab === "symptoms" && (
                      <div className="space-y-4 animate-fade-in">
                        <h5 className="text-xs font-black uppercase tracking-wider text-[#729B79] mb-2.5">{t.diseaseExtra?.obsSymptoms || "Observed Botanical Symptoms"}</h5>
                        <ul className="space-y-2">
                          {advisory.symptoms.map((s, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-[#475B63]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#49A078] mt-2 flex-shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === "treatment" && (
                      <div className="space-y-4 animate-fade-in">
                        <h5 className="text-xs font-black uppercase tracking-wider text-[#729B79] mb-2">{t.diseaseExtra?.immAction || "Immediate Field Action"}</h5>
                        <ol className="space-y-3">
                          {advisory.treatmentPlan.immediateAction.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-[#475B63]">
                              <span className="w-6 h-6 rounded-xl bg-[#49A078]/15 text-[#216869] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                              <span className="mt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {activeTab === "prevention" && (
                      <div className="space-y-3 animate-fade-in">
                        <h5 className="text-xs font-black uppercase tracking-wider text-[#729B79] mb-2">{t.diseaseExtra?.ltPrevention || "Long-Term Prevention"}</h5>
                        <ul className="space-y-2.5">
                          {advisory.prevention.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-[#475B63]">
                              <CheckCircle2 className="w-4 h-4 text-[#49A078] flex-shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === "fertilizer" && (
                      <div className="space-y-4 animate-fade-in">
                        {advisory.treatmentPlan.chemicalRemedies.map((chem, idx) => (
                          <div key={idx} className="rounded-2xl bg-[#EBEFC9]/60 border border-[#9CC5A1] p-4 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#216869] flex items-center gap-1">
                              <Droplet className="w-3.5 h-3.5 text-[#49A078]" /> {t.diseaseExtra?.chemIntervention || "Chemical Intervention"}
                            </span>
                            <p className="text-sm font-extrabold text-[#2B2118]">{chem.name}</p>
                            <p className="text-xs font-medium text-[#475B63]">{t.diseaseExtra?.dosage || "Dosage:"} {chem.dosage} — {chem.applicationMethod}</p>
                          </div>
                        ))}
                        
                        {advisory.treatmentPlan.organicRemedies.map((org, idx) => (
                          <div key={idx} className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#729B79]">🌱 {t.diseaseExtra?.orgAdvisory || "Organic Advisory"}</span>
                            <p className="text-sm font-extrabold text-[#2B2118]">{org.name}</p>
                            <p className="text-xs font-medium text-[#475B63]">{t.diseaseExtra?.dosage || "Dosage:"} {org.dosage} — {org.applicationMethod}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-10 flex flex-col items-center justify-center min-h-[520px] text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#729B79]">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div className="max-w-xs space-y-1">
                  <h3 className="text-base font-black text-[#2B2118]">{t.diseaseExtra?.awaitingPhoto || "Awaiting Leaf Photograph"}</h3>
                  <p className="text-xs font-medium text-[#475B63] leading-relaxed">
                    {t.disease?.awaitingSub || "Select your crop on the left and upload an image of an affected leaf. The AI will output confidence distributions and treatment advice here."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}