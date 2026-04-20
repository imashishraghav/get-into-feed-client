"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "../../utils/animations";

// ----------------------------------------------------------------------
// Custom SVG Icons (Replaces missing Lucide brand icons)
// ----------------------------------------------------------------------
const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
);

// ----------------------------------------------------------------------
// Team Data
// ----------------------------------------------------------------------
const teamData = [
  {
    id: "1",
    name: "Ashish Raghav",
    role: "Founder / Growth Strategist",
    description: "Architecting scalable marketing systems that turn attention into exponential, predictable revenue.",
    isFounder: true,
  },
  {
    id: "2",
    name: "Sumit Mishra",
    role: "Creative & Strategy Lead",
    description: "Engineering high-converting narratives, funnel architecture, and visual assets that dominate the feed.",
    isFounder: false,
  },
  {
    id: "3",
    name: "Saurabh Negi",
    role: "Performance Marketing",
    description: "Executing ruthless, data-driven media buying to systematically lower CPA and maximize ROAS.",
    isFounder: false,
  },
];

export default function TeamSection() {
  const containerRef = useRef(null);

  // 🟢 1. Global Background Drift for Subtle Depth
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * 0.05);

  // 🟢 2. Localized Scroll Parallax for Section Lift
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const sectionLift = useSpring(rawY, { stiffness: 80, damping: 25 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#F8F9FB] py-6 md:py-14 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      {/* Soft Background Orb Parallax */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#2ED1B2]/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-[#F8F9FB] px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              Our Team
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.05] mb-6"
          >
            Meet the People Behind the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            A dedicated unit of strategists, creatives, and media buyers engineering your success.
          </motion.p>
        </motion.div>

        {/* ================= TEAM GRID ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: sectionLift }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {teamData.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Team Card with 3D Tilt Hover Effect
// ----------------------------------------------------------------------
function TeamCard({ member, index }) {
  // 3D Tilt Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Get Initials for Avatar
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <motion.div
      variants={fadeUp}
      className="perspective-[1200px] h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, y: -6, transition: { duration: 0.2 } }}
        className={`relative h-full bg-[#F8F9FB] rounded-[2rem] p-8 transition-all duration-300 ease-out hover:shadow-[0_25px_50px_-12px_rgba(46,209,178,0.15)] flex flex-col group cursor-default border ${
          member.isFounder ? "border-[#2ED1B2]/30 hover:border-[#2ED1B2]" : "border-[#E5E7EB] hover:border-[#2ED1B2]/40"
        }`}
      >
        {/* Subtle Inner Glow on Hover */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#2ED1B2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none -z-0" />

        <div className="relative z-10 flex-1 flex flex-col items-center text-center" style={{ transform: "translateZ(30px)" }}>
          
          {/* Avatar Area */}
          <div className="relative mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm transition-transform duration-500 group-hover:scale-105 border-4 border-white ${
              member.isFounder 
                ? "bg-gradient-to-br from-[#2ED1B2] to-[#0EA5A4] text-white" 
                : "bg-gradient-to-br from-[#E5E7EB] to-[#CBD5E1] text-[#475569] group-hover:from-[#2ED1B2]/20 group-hover:to-[#0EA5A4]/20 group-hover:text-[#0EA5A4]"
            }`}>
              {initials}
            </div>
            
            {/* Founder Highlight Badge */}
            {member.isFounder && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white whitespace-nowrap">
                Founder
              </div>
            )}
          </div>

          {/* Details */}
          <h3 className="text-xl font-bold text-[#0F172A] mb-1 tracking-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
            {member.name}
          </h3>
          <p className="text-sm font-semibold text-[#2ED1B2] mb-4 uppercase tracking-wider">
            {member.role}
          </p>
          <p className="text-[#475569] text-[15px] leading-relaxed font-medium mb-8">
            {member.description}
          </p>

          {/* Social Links (Micro Animations using our Custom SVGs) */}
          <div className="mt-auto flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#94A3B8] hover:text-[#0EA5A4] hover:border-[#2ED1B2]/40 hover:bg-[#2ED1B2]/5 transition-all duration-300 hover:-translate-y-1 shadow-sm">
              <LinkedinIcon className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#94A3B8] hover:text-[#0EA5A4] hover:border-[#2ED1B2]/40 hover:bg-[#2ED1B2]/5 transition-all duration-300 hover:-translate-y-1 shadow-sm">
              <TwitterIcon className="w-4 h-4" />
            </button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}