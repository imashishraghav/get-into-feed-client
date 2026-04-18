"use client";

import { useMotionValue } from "framer-motion";
import { useLenis } from "lenis/react";

export function useSmoothScroll() {
  // Create raw motion values
  const scrollY = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);
  const velocity = useMotionValue(0);

  // useLenis interceptor: Ye Lenis ke internal scroll data ko seedha Framer Motion mein feed karega
  useLenis((lenis) => {
    scrollY.set(lenis.scroll);
    
    // progress usually goes from 0 (top) to 1 (bottom)
    scrollYProgress.set(lenis.progress);
    
    // velocity gives speed & direction (positive for down, negative for up)
    velocity.set(lenis.velocity);
  });

  return { scrollY, scrollYProgress, velocity };
}