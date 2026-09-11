"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1708267034046-ade1ff02f20a?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1571267011930-677915c391f9?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1173&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1920",
];

export default function BackgroundCarousel() {
  const [bgIndex, setBgIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setBgIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % BACKGROUND_IMAGES.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#132a1e] pointer-events-none">
      {BACKGROUND_IMAGES.map((imgUrl, idx) => {
        const isActive = idx === bgIndex;
        const isPrevious = idx === prevIndex;
        return (
          <motion.img
            key={imgUrl}
            src={imgUrl}
            alt={`Agricultural landscape ${idx + 1}`}
            initial={{ opacity: idx === 0 ? 1 : 0, scale: 1 }}
            animate={{
              opacity: isActive ? 1 : isPrevious ? 1 : 0,
              scale: isActive && !shouldReduceMotion ? 1.05 : 1,
              zIndex: isActive ? 2 : isPrevious ? 1 : 0,
            }}
            transition={{
              opacity: { duration: 0.8, ease: "easeInOut" },
              scale: { duration: 4, ease: "linear" },
            }}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
          />
        );
      })}
      {/* Lighting Overlays */}
      <div className="absolute inset-0 bg-black/25 sm:bg-black/15 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent z-10" />
    </div>
  );
}
