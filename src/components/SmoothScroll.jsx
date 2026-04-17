"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect } from "react";

export default function SmoothScroll({ children }) {

  useEffect(() => {
    // Prevent layout shift / jank
    document.documentElement.style.scrollBehavior = "auto";
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,              // balance between smooth + responsive
        duration: 1.2,           // optimized duration
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.9,    // slightly slow = premium feel
        touchMultiplier: 1.5,
        infinite: false,
        orientation: "vertical",
        gestureOrientation: "vertical",
        normalizeWheel: true,    // ⚡ IMPORTANT for consistency
      }}
    >
      {children}
    </ReactLenis>
  );
}