"use client";

import React from "react";
import { motion } from "framer-motion";
import { LineChart, Flame, Users, LayoutTemplate } from "lucide-react";

// --- Premium Animation Settings ---
const premiumEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEase },
  },
};

const painCards = [
  {
    id: 1,
    icon: <Users strokeWidth={1.5} className="w-6 h-6 text-[#2ED1B2]" />,
    title: "Feast or Famine",
    description: "You have a good month, then a dead month. There is no predictable system bringing in qualified leads every single day.",
  },
  {
    id: 2,
    icon: <Flame strokeWidth={1.5} className="w-6 h-6 text-[#2ED1B2]" />,
    title: "Burning Cash",
    description: "You are spending money on Meta and Google, but the cost per lead keeps rising. You're just funding their platforms.",
  },
  {
    id: 3,
    icon: <LineChart strokeWidth={1.5} className="w-6 h-6 text-[#2ED1B2]" />,
    title: "Likes Don't Pay",
    description: "You spend hours creating content. You get views and likes, but none of those followers are turning into actual paying clients.",
  },
  {
    id: 4,
    icon: <LayoutTemplate strokeWidth={1.5} className="w-6 h-6 text-[#2ED1B2]" />,
    title: "The Guesswork Trap",
    description: "You are trying a little bit of everything—SEO, reels, emails—but nothing connects, and you have no clear system.",
  },
];

export default function PainSection() {
  return (
    <section className="relative py-12 md:py-20 bg-[#F8F9FB] overflow-hidden text-[#0F172A]">
      {/* Subtle Teal Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2ED1B2]/[0.08] via-[#F8F9FB]/0 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="flex flex-col items-center"
        >
          {/* Header Content */}
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-[#2ED1B2]/10 border border-[#2ED1B2]/20">
              <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-[#0EA5A4]">
                The Hard Truth
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1] text-[#0F172A]">
              Struggling to turn attention into actual revenue?
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
              You are exhausted from running ads, posting content, and trying every new tactic—only to see unpredictable pipelines, shrinking ROI, and stalled growth.
            </p>
          </motion.div>

          {/* Pain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
            {painCards.map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.4, ease: premiumEase }
                }}
                className="group relative bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col h-full transition-shadow duration-500 hover:border-[#2ED1B2]/30 hover:shadow-[0_24px_48px_-12px_rgba(46,209,178,0.12)]"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2ED1B2] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                
                <div className="w-12 h-12 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center mb-6 group-hover:bg-[#2ED1B2]/5 group-hover:border-[#2ED1B2]/20 transition-colors duration-400">
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-[#0F172A] tracking-tight">
                  {card.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-grow">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Transition Line */}
          <motion.div 
            variants={itemVariants} 
            className="mt-12 md:mt-16 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] relative inline-block">
              <span className="relative z-10">And that's exactly what we fix.</span>
              <span className="absolute bottom-1.5 left-0 w-full h-3 bg-[#2ED1B2]/20 -z-10 rounded-sm skew-x-[-10deg]" />
            </h3>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}