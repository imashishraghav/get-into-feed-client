// @ts-nocheck
"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({ 
  children, 
  className = "", 
  pull = 0.2, // 🟢 You can easily control the magnetic strength via props now
}) {
  const ref = useRef(null);
  
  // 🟢 ADVANCED: Motion values update outside React's render cycle for 60fps performance
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 🟢 Apply physics directly to the motion values
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Update motion values directly (No Re-renders)
    x.set(middleX * pull);
    y.set(middleY * pull); 
  };

  const reset = () => {
    // Snap back to original position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      // Pass the spring values directly to the style object
      style={{ x: springX, y: springY }}
      // gpu-accelerated utility for hardware rendering
      className={`w-max relative flex items-center justify-center cursor-pointer gpu-accelerated ${className}`}
    >
      {children}
    </motion.div>
  );
}