"use client";

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

// Advanced Reveal Component
const Reveal = ({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.8,
  effect = "slide", // Options: "slide" | "blur" | "scale" | "flip"
  width = "auto",
  once = true,
  amount = 0.2 // Kitna percent screen mein aane par trigger hoga (0.2 = 20%)
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const shouldReduceMotion = useReducedMotion();

  // Premium Awwwards-style Easing (Expo Out)
  const premiumEase = [0.16, 1, 0.3, 1];

  // Offset distance (subtle 40px is better than 50px for premium feel)
  const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;

  // Animation Variants
  const variants = {
    hidden: {
      opacity: 0,
      x: effect !== "scale" ? xOffset : 0,
      y: effect !== "scale" ? yOffset : 0,
      filter: effect === "blur" ? "blur(12px)" : "blur(0px)",
      scale: effect === "scale" ? 0.9 : 1,
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

  // Agar user ke system mein animations off hain (Accessibility)
  if (shouldReduceMotion) {
    return <div style={{ width }}>{children}</div>;
  }

  return (
    <div ref={ref} style={{ width, position: "relative" }}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ 
          willChange: "transform, opacity, filter", // GPU Acceleration
          transformOrigin: effect === "flip" ? "bottom center" : "center" 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;