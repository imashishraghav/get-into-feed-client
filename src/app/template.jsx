"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      // Naya page kahan se shuru hoga (Halka sa neeche, transparent, aur blur)
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      
      // Kahan par aakar rukega (Apni asli jagah par aur fully clear)
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      
      // Animation ki speed aur style (Premium Apple-like easing curve)
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], 
      }}
    >
      {children}
    </motion.div>
  );
}