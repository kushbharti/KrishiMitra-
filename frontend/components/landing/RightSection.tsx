"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Scan,
  Thermometer,
  Droplets,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

// Import the auth forms you created previously
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const EASE_APPLE = [0.16, 1, 0.3, 1] as const;

const CROP_DATA = [
  {
    crop: "Tomato",
    disease: "Early Blight",
    conf: 98.6,
    sev: "Moderate",
    color: "#ef4444",
    image:
      "https://images.unsplash.com/photo-1721520609152-0a02d79f46fe?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tips: [
      "Apply Mancozeb 75% WP",
      "Avoid overhead irrigation",
      "Improve lower canopy airflow",
    ],
  },

  {
    crop: "Corn",
    disease: "Northern Leaf Blight",
    conf: 97.8,
    sev: "Moderate",
    color: "#ef4444",
    image:
      "https://plus.unsplash.com/premium_photo-1661825317479-0b8e91a640b7?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tips: [
      "Apply appropriate fungicide",
      "Remove infected crop residue",
      "Use resistant corn hybrids",
    ],
  },
  {
    crop: "Soybean",
    disease: "Soybean Rust",
    conf: 96.5,
    sev: "High",
    color: "#b91c1c",
    image:
      "https://images.unsplash.com/photo-1772401957990-27cb95aaa08e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tips: [
      "Apply triazole fungicide",
      "Monitor humidity regularly",
      "Plant resistant varieties",
    ],
  },

  {
    crop: "Rice",
    disease: "Leaf Blast",
    conf: 92.1,
    sev: "Low",
    color: "#f59e0b",
    image:
      "https://images.unsplash.com/photo-1614091066096-4c6521fbea3f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tips: [
      "Maintain consistent water flooding",
      "Apply Tricyclazole",
      "Avoid excessive nitrogen dumping",
    ],
  },
  {
    crop: "Wheat",
    disease: "Leaf Rust",
    conf: 96.4,
    sev: "Moderate",
    color: "#ef4444",
    image:
      "https://media.istockphoto.com/id/1339007141/photo/wheat-diseases.jpg?s=612x612&w=0&k=20&c=8aUDs0wxOu0FsmdfKgk6ul8Xxg78oyWMJtVwz5cEAxw=",
    tips: [
      "Apply Triazole fungicides",
      "Ensure proper row spacing",
      "Monitor flag leaf early growth",
    ],
  },
];

/* ==========================================================================
   RIGHT PANEL CONTAINER (SCANNER / LOGIN / SIGNUP WITH ANIMATEPRESENCE)
   ========================================================================== */

interface RightSectionProps {
  authView: "scanner" | "login" | "signup";
  onSwitchAuth: (view: "login" | "signup") => void;
}

export default function RightSection({
  authView,
  onSwitchAuth,
}: RightSectionProps) {
  const [scanStep, setScanStep] = useState<number>(0);
  const [cropIndex, setCropIndex] = useState<number>(0);
  const [liveTelemetry, setLiveTelemetry] = useState({
    temp: "24.0",
    hum: "60",
    conf: "0.0",
  });

  const currentCrop = CROP_DATA[cropIndex];
  const shouldReduceMotion = useReducedMotion();

  // Handle Scanner Animation Timing
  useEffect(() => {
    if (authView !== "scanner") return;

    let timer: NodeJS.Timeout;
    if (scanStep === 0) {
      timer = setTimeout(() => setScanStep(1), 1500);
    } else if (scanStep === 1) {
      timer = setTimeout(() => setScanStep(2), 1500);
    } else if (scanStep === 2) {
      timer = setTimeout(() => setScanStep(3), 4500);
    } else if (scanStep === 3) {
      timer = setTimeout(() => {
        setCropIndex((prev) => (prev + 1) % CROP_DATA.length);
        setScanStep(1);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [scanStep, authView]);

  // Handle Live Telemetry Numbers
  useEffect(() => {
    if (scanStep !== 2 || authView !== "scanner") return;

    const interval = setInterval(() => {
      setLiveTelemetry({
        temp: (24 + Math.random() * 1.5).toFixed(1),
        hum: (60 + Math.random() * 4).toFixed(0),
        conf: (45 + Math.random() * 48).toFixed(1),
      });
    }, 150);

    return () => clearInterval(interval);
  }, [scanStep, authView]);

  return (
    <section
      aria-label="Interactive Right Workspace Panel"
      className="relative h-full w-full flex items-center justify-center p-6 lg:p-12 z-10"
    >
      {/* mode="wait" ensures the scanner completely disappears before the form appears */}
      <AnimatePresence mode="wait">
        {/* =========================================
            STATE 1: 3D LEAF SCANNER
            ========================================= */}
        {authView === "scanner" && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: EASE_APPLE }}
            // The scanner's specific wrapper styling is now attached DIRECTLY to the scanner view
            className="relative w-full max-w-[460px] aspect-[4/5] rounded-[32px] bg-slate-950/55 backdrop-blur-[24px] border border-white/12 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col items-center justify-center"
          >
            {/* Hardware Top Bezel & Status LEDs */}
            <div className="absolute top-5 w-16 h-1.5 rounded-full bg-white/20 shadow-inner" />
            <div
              className="absolute top-6 right-7 flex items-center gap-2"
              role="status"
              aria-live="polite"
            >
              <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase hidden sm:inline">
                {scanStep === 2
                  ? "SCANNING..."
                  : scanStep === 3
                    ? "DIAGNOSED"
                    : "STANDBY"}
              </span>
              <motion.div
                animate={{ opacity: scanStep >= 2 ? [0.3, 1, 0.3] : 0.2 }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              />
            </div>

            {/* Ambient Cavity Lighting */}
            <motion.div
              animate={{
                opacity: scanStep === 2 ? 0.7 : 0.15,
                scale: scanStep === 2 ? 1.3 : 1,
              }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.25),_transparent_70%)] mix-blend-screen pointer-events-none"
            />

            {/* 3D Photorealistic Leaf Display */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                {scanStep >= 1 && scanStep <= 3 && (
                  <motion.div
                    key={`crop-${cropIndex}`}
                    initial={{ opacity: 0, x: -200, scale: 0.7, rotate: -15 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: scanStep === 2 && !shouldReduceMotion ? [0, -8, 0] : 0,
                      scale: scanStep === 3 ? 1.05 : 1,
                      rotate:
                        scanStep === 3
                          ? 0
                          : !shouldReduceMotion
                            ? [0, 2, -2, 0]
                            : 0,
                      filter:
                        scanStep === 3
                          ? "drop-shadow(0 25px 35px rgba(0,0,0,0.8))"
                          : "drop-shadow(0 15px 20px rgba(0,0,0,0.5))",
                    }}
                    exit={{
                      opacity: 0,
                      x: 200,
                      scale: 0.8,
                      rotate: 15,
                      filter: "blur(6px)",
                      transition: { duration: 0.7, ease: "easeInOut" },
                    }}
                    transition={{
                      duration: scanStep === 1 ? 1.2 : 0.8,
                      ease: EASE_APPLE,
                      y: {
                        repeat: scanStep === 2 ? Infinity : 0,
                        duration: 3,
                        ease: "easeInOut",
                      },
                    }}
                    className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center pointer-events-none will-change-transform"
                  >
                    <img
                      src={currentCrop.image}
                      alt="Specimen"
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />

                    {/* Pathogen Highlight Overlay */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: scanStep === 3 ? 0.85 : 0,
                        scale: scanStep === 3 ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.8, ease: EASE_APPLE }}
                      className="absolute w-1/2 h-1/2 bg-[radial-gradient(circle,_rgba(239,68,68,0.7)_0%,_rgba(220,38,38,0.2)_60%,_transparent_100%)] mix-blend-color-dodge rounded-full pointer-events-none blur-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Laser Scanner Beam */}
              <AnimatePresence>
                {scanStep === 2 && (
                  <motion.div
                    key="laser-beam"
                    initial={{ opacity: 0, top: "10%" }}
                    animate={{ opacity: 1, top: "85%" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
                    transition={{
                      top: {
                        duration: 2.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                      },
                      opacity: { duration: 0.3 },
                    }}
                    className="absolute left-6 right-6 h-[2px] bg-emerald-400 shadow-[0_0_25px_4px_rgba(52,211,153,0.6)] z-20 pointer-events-none"
                  >
                    <div className="absolute -top-3 -bottom-3 left-0 right-0 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent blur-xs" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* HUD OVERLAY (Now with Animated Equalizer Bars) */}
            <AnimatePresence>
              {scanStep === 2 && (
                <motion.div
                  key="hud-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between font-mono text-[11px] text-emerald-400/90 z-20"
                >
                  <div className="flex justify-between items-start">
                    <div className="bg-black/60 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg backdrop-blur-md">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Scan className="w-3.5 h-3.5 text-emerald-400" />{" "}
                        AI.ENGINE.v2
                      </div>
                      <div className="text-[10px] text-white/70">
                        SPECIMEN: {currentCrop.crop.toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-black/60 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg backdrop-blur-md text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" />{" "}
                        {liveTelemetry.temp}°C
                      </div>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-white/70">
                        <Droplets className="w-3.5 h-3.5 text-sky-400" />{" "}
                        {liveTelemetry.hum}% RH
                      </div>
                    </div>
                  </div>

                  {/* Restored: Bottom HUD with Animated Bars */}
                  <div className="flex justify-between items-end">
                    <div className="w-28 h-12 bg-black/60 border border-emerald-500/30 rounded-lg p-2 flex items-end gap-1 backdrop-blur-md overflow-hidden">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            height: !shouldReduceMotion
                              ? [
                                  `${20 + ((i * 7) % 80)}%`,
                                  `${80 - ((i * 13) % 60)}%`,
                                  `${40 + ((i * 3) % 50)}%`,
                                ]
                              : "50%",
                          }}
                          transition={{
                            duration: 0.4 + i * 0.05,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          className="flex-1 bg-emerald-500/60 rounded-t-sm"
                        />
                      ))}
                    </div>
                    <div className="bg-black/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg backdrop-blur-md text-right font-bold text-white">
                      ANALYZING PATHOLOGY...
                      <br />
                      <span className="text-emerald-400">
                        CONF: {liveTelemetry.conf}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FINAL CLINICAL RESULT CARD */}
            <AnimatePresence>
              {scanStep === 3 && (
                <motion.div
                  key="result-card"
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    filter: "blur(6px)",
                    transition: { duration: 0.3 },
                  }}
                  transition={{ duration: 0.6, ease: EASE_APPLE }}
                  className="absolute bottom-5 left-5 right-5 bg-slate-950/95 backdrop-blur-2xl border border-white/20 p-5 rounded-3xl shadow-2xl z-30"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />{" "}
                        Pathogen Identified
                      </div>
                      <h3 className="text-xl font-extrabold text-white tracking-tight">
                        {currentCrop.disease}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Host Crop:{" "}
                        <span className="text-white font-semibold">
                          {currentCrop.crop}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white font-mono">
                        {currentCrop.conf}%
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Confidence
                      </div>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-800 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentCrop.conf}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>

                  <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />{" "}
                      Immediate Remedies
                    </div>
                    <ul className="text-xs text-slate-300 font-medium space-y-1.5">
                      {currentCrop.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* =========================================
            STATE 2: LOGIN FORM
            ========================================= */}
        {authView === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: 0.2, ease: EASE_APPLE }}
            className="w-full max-w-md mx-auto"
          >
            <LoginForm onSwitchToSignup={() => onSwitchAuth("signup")} />
          </motion.div>
        )}

        {/* =========================================
            STATE 3: SIGNUP FORM
            ========================================= */}
        {authView === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: 0.3, ease: EASE_APPLE }}
            className="w-full max-w-md mx-auto"
          >
            <SignupForm onSwitchToLogin={() => onSwitchAuth("login")} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
