"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

// 🟢 Import your custom smooth scroll hook!
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

// ----------------------------------------------------------------------
// Premium Spring Configurations
// ----------------------------------------------------------------------
const smoothSpring = { type: "spring", stiffness: 80, damping: 20, mass: 0.8 };
const snappySpring = { type: "spring", stiffness: 400, damping: 25 };

// Word-by-word text reveal animation
const wordVariants = {
  hidden: { opacity: 0, y: 24, rotateX: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: smoothSpring
  }
};

export default function Capabilities({ services }) {
  const containerRef = useRef(null);

  // 🟢 1. Global Smooth Scroll for Parallax
  const { scrollY } = useSmoothScroll();
  const headerParallax = useTransform(scrollY, [0, 3000], [0, -150]);

  // Scroll Progress Tracker for the sticky line (Kept native for accurate DOM mapping)
  const { scrollYProgress: sectionScrollY } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(sectionScrollY, [0, 1], ["0%", "100%"]);

  if (!services || services.length === 0) return null;

  const headingText = "Turning Attention Into".split(" ");

  return (
    <section ref={containerRef} className="relative pt-24 md:pt-32 pb-12 md:pb-16 bg-white selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start relative">
          
          {/* Scroll Indicator Line (Left Side) */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[1px] bg-[#E5E7EB] z-0">
            <motion.div 
              style={{ height: lineHeight }} 
              className="w-full bg-gradient-to-b from-[#2ED1B2] to-[#0EA5A4] origin-top rounded-b-full shadow-[0_0_15px_rgba(46,209,178,0.6)]"
            />
          </div>

          {/* LEFT COLUMN: Sticky Header + 🟢 Parallax */}
          <motion.div 
            style={{ y: headerParallax }}
            className="lg:col-span-5 lg:sticky lg:top-40 lg:h-fit self-start lg:pl-10 flex flex-col items-start justify-start text-left z-20"
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={{
                visible: { transition: { staggerChildren: 0.08 } }
              }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.05] mb-6 perspective-[1000px]">
                {headingText.map((word, idx) => (
                  <motion.span key={idx} className="inline-block mr-3" variants={wordVariants}>
                    {word}
                  </motion.span>
                ))}
                <motion.span 
                  variants={wordVariants} 
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] pb-2"
                >
                  Revenue.
                </motion.span>
              </h2>
              
              <motion.p 
                variants={wordVariants}
                className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-8 max-w-md"
              >
                We build scalable systems that turn cold traffic into qualified leads, and leads into exponential growth—consistently.
              </motion.p>

              <motion.div 
                variants={wordVariants}
                className="mt-2 inline-flex items-center gap-4 bg-white pr-6 pl-2 py-2 rounded-full border border-[#E5E7EB] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2ED1B2] animate-pulse shadow-[0_0_8px_rgba(46,209,178,0.8)]" />
                </div>
                <p className="text-[#0F172A] font-bold text-sm md:text-base tracking-tight">
                  This is exactly how we do it.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Floating Dynamic Services List */}
          <div className="lg:col-span-7 relative z-10 flex flex-col gap-10 mt-16 lg:mt-0 pt-4 lg:pt-0 pb-8">
            {services.map((service, index) => (
              <FloatingServiceRow key={service._id || index} service={service} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Advanced Card Component with 🟢 Velocity Physics
// ----------------------------------------------------------------------
function FloatingServiceRow({ service, index }) {
  const cardRef = useRef(null);

  // 1. Dynamic Stacking Physics (Native Scroll for perfect responsive offsets)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1.15", "1 1"],
  });

  // 2. 🟢 Velocity Skew Physics (Custom Smooth Scroll Hook)
  const { velocity } = useSmoothScroll();
  const smoothVelocity = useSpring(velocity, { damping: 40, stiffness: 400 });
  // Converts scroll speed into a subtle angle (-2deg to 2deg)
  const skewY = useTransform(smoothVelocity, [-1000, 1000], [2, -2]);

  const rawY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const rawRotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);

  const y = useSpring(rawY, { stiffness: 100, damping: 25, mass: 0.5 });
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 25 });
  const scale = useSpring(rawScale, { stiffness: 100, damping: 25 });
  const rotateX = useSpring(rawRotateX, { stiffness: 100, damping: 25 });

  const href = service.slug?.current ? `/services/${service.slug.current}` : "#";
  const title = service.title || "Service Title";
  const desc = service.shortDescription || "We generate consistent leads and sales using high-performing ad systems across Meta and Google.";
  const tags = Array.isArray(service.tags) ? service.tags : ["Strategy", "Growth", "Systems"];

  const formattedIndex = (index + 1).toString().padStart(2, '0');

  return (
    <motion.div
      ref={cardRef}
      // 🟢 Applied the new skewY here along with your stacking physics
      style={{ y, opacity, scale, rotateX, skewY, transformOrigin: "bottom center" }}
      className="w-full perspective-[1200px]"
    >
      <Link 
        href={href} 
        className="block w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ED1B2]/50 rounded-[2rem] transition-all"
      >
        <motion.div
          initial="initial"
          whileHover="hover"
          className="group relative p-8 md:p-10 rounded-[2rem] bg-white border border-[#E5E7EB] transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(46,209,178,0.15)] hover:border-[#2ED1B2]/40 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2ED1B2] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F8F9FB] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-sm font-bold text-[#0EA5A4] bg-[#2ED1B2]/10 px-3 py-1 rounded-full border border-[#2ED1B2]/20 shadow-sm">
                  {formattedIndex}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
                  {title}
                </h3>
              </div>
              
              <p className="text-base md:text-lg leading-relaxed text-gray-500 group-hover:text-gray-700 transition-colors duration-300 max-w-xl">
                {desc}
              </p>

              <div className="flex flex-wrap gap-2 mt-8">
                {tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-semibold text-gray-500 bg-[#F8F9FB] px-3.5 py-1.5 rounded-full border border-gray-200 group-hover:border-[#2ED1B2]/30 group-hover:text-[#0EA5A4] group-hover:bg-[#2ED1B2]/5 transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 mt-2 flex flex-col items-center gap-2">
              <motion.div 
                variants={{
                  initial: { backgroundColor: "#FFFFFF", color: "#64748B", borderColor: "#E5E7EB", rotate: 0 },
                  hover: { backgroundColor: "#2ED1B2", color: "#FFFFFF", borderColor: "#2ED1B2", rotate: 45 }
                }}
                transition={snappySpring}
                className="w-14 h-14 rounded-full border shadow-sm flex items-center justify-center relative z-10"
              >
                <ArrowUpRight size={26} strokeWidth={2.5} />
              </motion.div>
              
              <motion.span 
                variants={{
                  initial: { opacity: 0, y: -5 },
                  hover: { opacity: 1, y: 0 }
                }}
                className="text-[11px] font-bold text-[#0EA5A4] uppercase tracking-widest hidden md:block"
              >
                Explore
              </motion.span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}