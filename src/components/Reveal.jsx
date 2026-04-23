// @ts-nocheck
"use client";

import React, { useRef, useMemo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

// 🟢 Extracted outside component to prevent recreation on every render
const premiumEase = [0.16, 1, 0.3, 1];

export default function Reveal({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.8,
  effect = "slide", // Options: "slide" | "blur" | "scale" | "flip"
  width = "auto",
  once = true,
  amount = 0.2, // Trigger point (0.2 = 20% visibility)
  className = "" // Allowed passing custom wrapper classes
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const shouldReduceMotion = useReducedMotion();

  // 🟢 ADVANCED FIX: Memoize variants to prevent expensive re-renders in heavy pages
  const variants = useMemo(() => {
    // Offset distance (subtle 40px is better than 50px for premium feel)
    const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
    const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;

    return {
      hidden: {
        opacity: 0,
        x: effect !== "scale" ? xOffset : 0,
        y: effect !== "scale" ? yOffset : 0,
        filter: effect === "blur" ? "blur(12px)" : "blur(0px)",
        scale: effect === "scale" ? 0.95 : 1, // 0.95 is more subtle and premium than 0.9
        rotateX: effect === "flip" ? 45 : 0,
        transformPerspective: effect === "flip" ? 1000 : "none",
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
        rotateX: 0,
        transition: {
          duration: duration,
          delay: delay,
          ease: premiumEase,
        },
      },
    };
  }, [direction, effect, duration, delay]);

  // Accessibility Guard: If user prefers reduced motion on their OS, skip animations
  if (shouldReduceMotion) {
    return <div style={{ width }} className={className}>{children}</div>;
  }

  return (
    <div ref={ref} style={{ width, position: "relative" }} className={`reveal-wrapper ${className}`}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ 
          willChange: "transform, opacity, filter", // Force Hardware Acceleration
          transformOrigin: effect === "flip" ? "bottom center" : "center" 
        }}
        className="gpu-accelerated"
      >
        {children}
      </motion.div>
    </div>
  );
}