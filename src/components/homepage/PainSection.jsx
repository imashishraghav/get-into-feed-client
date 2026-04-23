// @ts-nocheck
"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { LineChart, Flame, Users, LayoutTemplate } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const premiumEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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
    icon: <Users strokeWidth={1.5} className="w-6 h-6 text-primary" />,
    title: "Feast or Famine",
    description: "You have a good month, then a dead month. There is no predictable system bringing in qualified leads every single day.",
  },
  {
    id: 2,
    icon: <Flame strokeWidth={1.5} className="w-6 h-6 text-primary" />,
    title: "Burning Cash",
    description: "You are spending money on Meta and Google, but the cost per lead keeps rising. You're just funding their platforms.",
  },
  {
    id: 3,
    icon: <LineChart strokeWidth={1.5} className="w-6 h-6 text-primary" />,
    title: "Likes Don't Pay",
    description: "You spend hours creating content. You get views and likes, but none of those followers are turning into actual paying clients.",
  },
  {
    id: 4,
    icon: <LayoutTemplate strokeWidth={1.5} className="w-6 h-6 text-primary" />,
    title: "The Guesswork Trap",
    description: "You are trying a little bit of everything—SEO, reels, emails—but nothing connects, and you have no clear system.",
  },
];

export default function PainSection() {
  const { scrollY } = useSmoothScroll();
  const bgParallax = useTransform(scrollY, (y) => y * 0.15);
  
  // 🟢 Reduced parallax from -0.05 to -0.02 to prevent the blue-line gap from opening too wide
  const cardsParallax = useTransform(scrollY, (y) => y * -0.02);

  return (
    <section className="relative py-20 md:py-32 bg-background overflow-hidden text-navy selection:bg-primary/20 selection:text-secondary">
      
      <motion.div 
        style={{ y: bgParallax }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.08] via-background/0 to-transparent pointer-events-none gpu-accelerated" 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="flex flex-col items-center gpu-accelerated"
        >
          {/* 🔴 RED LINE PART: Fixed with increased margin-bottom */}
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
            <div className="font-sans inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-secondary">
                The Hard Truth
              </span>
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-navy text-balance">
              Struggling to turn attention into actual revenue?
            </h2>
            
            <p className="font-sans text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto text-balance">
              You are exhausted from running ads, posting content, and trying every new tactic—only to see unpredictable pipelines and stalled growth.
            </p>
          </motion.div>

          <motion.div 
            style={{ y: cardsParallax }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full gpu-accelerated"
          >
            {painCards.map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.4, ease: premiumEase } }}
                className="group relative bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full transition-shadow duration-500 hover:border-primary/30 hover:shadow-[0_24px_48px_-12px_rgba(46,209,178,0.12)]"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors duration-400">
                  {card.icon}
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-navy tracking-tight">{card.title}</h3>
                <p className="font-sans text-slate-600 leading-relaxed text-sm md:text-base flex-grow">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* 🔵 BLUE LINE PART: Fixed with tighter mt and balanced scale */}
          <motion.div 
            variants={itemVariants} 
            className="mt-16 md:mt-24 text-center"
          >
            <h3 className="font-heading text-2xl md:text-4xl font-extrabold text-navy relative inline-block text-balance">
              <span className="relative z-10">And that's exactly what we fix.</span>
              <span className="absolute bottom-1.5 left-0 w-full h-3 bg-primary/20 -z-10 rounded-sm skew-x-[-10deg]" />
            </h3>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}