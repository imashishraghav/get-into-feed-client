"use client";

import { useEffect, useRef, useState } from "react";
import { ReactLenis } from "lenis/react";
import { usePathname, useSearchParams } from "next/navigation";

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // 1. Accessibility Check: Respect user's OS motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 2. Next.js Routing Fix: Reset scroll to top on route or param change
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, searchParams]);

  // 3. Reset native scroll behavior to prevent jank
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }, []);

  // If the user prefers reduced motion, completely bypass Lenis
  if (isReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.08,             // Slightly eased from 0.07 for an "Apple-like" fluid feel
        duration: 1.5,          // Slightly longer duration for perceived weight
        smoothWheel: true,
        smoothTouch: false,     // Native iOS/Android touch scrolling is always superior
        wheelMultiplier: 1,     // Normalizing to 1 prevents hyper-fast scrolling on Windows mice
        touchMultiplier: 2,
        infinite: false,
        normalizeWheel: true,   // Critical for consistent speed across Mac Trackpads and Windows Scroll Wheels
      }}
    >
      {children}
    </ReactLenis>
  );
}