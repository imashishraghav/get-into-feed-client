"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Signal Calibration",
    description:
      "We isolate the exact messaging and triggers that force your ideal buyers to stop scrolling.",
  },
  {
    number: "02",
    title: "Market Saturation",
    description:
      "We deploy thumb-stopping creatives across networks, engineered to monopolize your industry's feed.",
  },
  {
    number: "03",
    title: "Algorithmic Scaling",
    description:
      "We ruthlessly optimize winning assets, transforming engagement spikes into a predictable revenue engine.",
  },
];

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function UniqueSystem() {
  return (
    // FIX 3: Reduced top padding (changed py-32 to pt-20 pb-32)
    <section className="relative w-full bg-[#F8F9FB] pt-16 md:pt-20 pb-24 md:pb-32 overflow-hidden">
      {/* Refined Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#2ED1B2] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Upgraded Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-24"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-5">
            The Feed Domination Framework
          </h2>
          
          <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium">
            A structured operating system designed to turn fleeting attention 
            into consistent, predictable revenue.
          </p>
        </motion.div>

        {/* 3-Step System Architecture */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Enhanced Directional Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent z-0">
            {/* Animated Flow Indicator */}
            <motion.div 
              className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-[#2ED1B2] to-transparent opacity-40"
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative z-10 group"
            >
              {/* Refined Product-Style Card */}
              <div className="relative h-full bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB] transition-all duration-500 ease-out hover:shadow-xl hover:shadow-[#2ED1B2]/5 hover:-translate-y-1 hover:border-[#2ED1B2]/30 overflow-hidden">
                
                {/* Subtle Background Watermark Number */}
                <span className="absolute -top-6 -right-4 text-[8rem] font-black text-slate-50 select-none group-hover:text-slate-100 transition-colors duration-500 z-0 pointer-events-none">
                  {step.number}
                </span>
                
                {/* Improved Micro-Hierarchy: Step Indicator */}
                <div className="relative z-10 flex items-center gap-3 mb-8">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] transition-colors duration-500 group-hover:border-[#2ED1B2]/30 group-hover:bg-[#2ED1B2]/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5A4] transition-colors duration-500 group-hover:bg-[#2ED1B2]" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-[#0EA5A4] uppercase">
                    Step {step.number}
                  </span>
                </div>

                {/* Streamlined Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}