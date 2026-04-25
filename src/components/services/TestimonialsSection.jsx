// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

// 🟢 Import your custom lag-free smooth scroll hook & animation utils
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// Shared Helpers
// ----------------------------------------------------------------------
const renderStars = () => (
  <div className="flex gap-1 mb-5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={16} className="fill-primary text-primary" />
    ))}
  </div>
);

const FallbackAvatar = ({ name, className }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className={`rounded-full bg-gradient-to-br from-background to-navy/5 border border-navy/10 flex items-center justify-center text-secondary font-heading font-bold shadow-sm ${className}`}>
      {initial}
    </div>
  );
};

export default function TestimonialsSection({ testimonials }) {
  const containerRef = useRef(null);

  // 🟢 Global Background Parallax
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * 0.05);

  // 🟢 Local Scroll Parallax for Section Lift
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 25 });

  // Safety Check
  if (!testimonials || testimonials.length === 0) return null;

  // 🟢 Infinite Slider Trick: Duplicate the array to create a seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-background py-20 md:py-32 overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu"
    >
      {/* Subtle Background Glow */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-0 transform-gpu" 
      />

      <div className="w-full relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 flex flex-col items-center px-6 transform-gpu"
        >
          <motion.div variants={fadeUp} className="mb-6 transform-gpu">
            <span className="font-heading text-[11px] font-bold tracking-[0.2em] text-secondary uppercase bg-white px-4 py-2 rounded-full border border-navy/10 shadow-sm">
              Client Feedback
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-navy tracking-tight leading-[1.1] mb-6 text-balance transform-gpu"
          >
            Trusted by Brands That <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Demand Results.
            </span>
          </motion.h2>
        </motion.div>

        {/* ================= ADVANCED INFINITE SLIDER ================= */}
        {/* 1. Overflows screen on both sides.
          2. We use Framer Motion's 'animate' to move it continuously to the left.
          3. We use interaction tags (hover/drag) to give user control.
        */}
        <div className="relative w-full overflow-hidden flex items-center py-4">
          
          {/* Fade edges to blend into background */}
          <div className="absolute top-0 left-0 w-24 md:w-64 h-full bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 md:w-64 h-full bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

          <motion.div
            // Animate infinitely from 0 to -33.33% (1 full set of the duplicated array)
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{
              ease: "linear",
              duration: 25, // Control speed here (higher is slower)
              repeat: Infinity,
            }}
            // Hover pauses the animation
            whileHover={{ animationPlayState: "paused" }}
            className="flex gap-6 md:gap-8 px-6 md:px-8 w-max cursor-grab active:cursor-grabbing"
            style={{ 
               /* Add explicit width to ensure animation calculates correctly */
               width: "fit-content" 
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                // Using a combination of id and index for unique keys in duplicated lists
                key={`${testimonial._id}-${index}`} 
                data={testimonial} 
              />
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Testimonial Card Component
// ----------------------------------------------------------------------
function TestimonialCard({ data }) {
  return (
    <div className="group relative bg-white border border-navy/10 rounded-3xl p-8 w-[320px] md:w-[420px] h-[350px] shrink-0 flex flex-col overflow-hidden transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transform-gpu hover:-translate-y-2">
      
      {/* Decorative Quote Icon Background */}
      <Quote className="absolute top-6 right-6 text-navy/5 w-16 h-16 rotate-180 transition-transform duration-500 group-hover:scale-110 z-0 transform-gpu" />

      {/* Premium Top Border Glow on Hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      <div className="relative z-10 flex flex-col flex-1 h-full">
        {renderStars()}
        
        {/* Review Text */}
        <blockquote className="font-sans text-navy/70 text-base leading-relaxed font-medium mb-6 flex-1 line-clamp-5">
          "{data.testimonial || data.feedback}"
        </blockquote>
        
        {/* Client Details Section (Sticks to bottom) */}
        <div className="flex items-center gap-4 pt-6 border-t border-navy/10 mt-auto">
          <div className="shrink-0 w-12 h-12 relative rounded-full overflow-hidden border border-navy/10 shadow-sm group-hover:border-primary/30 transition-colors">
            {data.imageUrl ? (
              <Image src={data.imageUrl} alt={data.name} fill className="object-cover" />
            ) : (
              <FallbackAvatar name={data.name} className="w-full h-full text-base" />
            )}
          </div>
          <div>
            <h4 className="font-heading text-[15px] font-bold text-navy leading-tight group-hover:text-primary transition-colors">
              {data.name}
            </h4>
            <p className="font-sans text-xs font-semibold text-navy/60 mt-1 line-clamp-1">
              {data.role} <span className="text-primary mx-1">•</span> {data.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}s