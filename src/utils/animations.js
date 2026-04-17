// ============================================================================
// ADVANCED FRAMER MOTION GLOBAL UTILITIES
// ============================================================================

// ----------------------------------------------------------------------
// 1. Easing Curves & Spring Physics (The Core of Premium UI)
// ----------------------------------------------------------------------
export const premiumEase = [0.16, 1, 0.3, 1]; // Snappy, Apple-like ease
export const smoothEase = [0.22, 1, 0.36, 1]; // Softer, Vercel-like ease

export const springSmooth = { type: "spring", stiffness: 300, damping: 30, mass: 1 };
export const springBouncy = { type: "spring", stiffness: 400, damping: 15 };

// ----------------------------------------------------------------------
// 2. Viewport Configs (Reusable triggers)
// ----------------------------------------------------------------------
export const viewportConfig = { once: true, margin: "-10%" };
export const viewportEarly = { once: true, margin: "-5%" };

// ----------------------------------------------------------------------
// 3. Stagger Containers
// ----------------------------------------------------------------------
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerTextContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04, // Very fast stagger for text characters/words
      delayChildren: 0.1,
    },
  },
};

// ----------------------------------------------------------------------
// 4. Advanced Reveal Animations (Blur & 3D)
// ----------------------------------------------------------------------

// Standard Blur Fade Up (The Linear/Vercel Look)
export const blurFadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: premiumEase },
  },
};

// 3D Perspective Reveal (Great for featured cards or dashboard mockups)
export const perspectiveFade = {
  hidden: { opacity: 0, y: 40, rotateX: -15, transformPerspective: 1000, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: premiumEase },
  },
};

// Text Word/Char Reveal
export const textRevealVariant = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: premiumEase },
  },
};

// Standard Directional Fades
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: premiumEase } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: premiumEase } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: smoothEase } },
};

// ----------------------------------------------------------------------
// 5. Interaction Animations (Hovers, Taps, and Magnetics)
// ----------------------------------------------------------------------

export const hoverLift = {
  whileHover: { y: -6 },
  transition: springSmooth,
};

export const buttonMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: springSmooth,
};

// Advanced Card Hover with 3D feel and Glow
export const cardHoverPro = {
  whileHover: { 
    y: -8, 
    scale: 1.01,
    boxShadow: "0px 30px 60px -15px rgba(46, 209, 178, 0.15)", // Premium Teal Drop Shadow
  },
  transition: springSmooth,
};

// Image Zoom (Perfect for Case Study thumbnails)
export const imageZoomHover = {
  initial: { scale: 1 },
  whileHover: { scale: 1.05 },
  transition: { duration: 0.6, ease: premiumEase },
};