"use client";

import React, { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  isCurrency?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  isCurrency,
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
