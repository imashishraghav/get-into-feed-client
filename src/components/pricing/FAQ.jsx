"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

// ----------------------------------------------------------------------
// Reusable Global Animation Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

// ----------------------------------------------------------------------
// Tailored FAQ Data (No fluff, direct answers)
// ----------------------------------------------------------------------
const faqs = [
  {
    question: "How does your pricing work?",
    answer: "We operate on a transparent, retainer-based model with no hidden fees. Your monthly investment covers our end-to-end system architecture—from campaign strategy and landing page design to daily media buying and optimization."
  },
  {
    question: "Is there a minimum commitment?",
    answer: "Yes, we recommend a 3-month initial commitment. Building a high-performance funnel, optimizing meta tags, and training the ad algorithms for high-intent leads takes proper setup and testing to yield predictable, scalable returns."
  },
  {
    question: "Do you guarantee results?",
    answer: "We guarantee the flawless execution of a proven growth system. While we cannot legally promise specific revenue numbers due to external market variables, our strategies consistently lower CPA and drastically improve the quality of inquiries."
  },
  {
    question: "What platforms do you work with?",
    answer: "We specialize in scalable, high-intent platforms. Our core focus is on Google Ads and Meta (Facebook & Instagram), seamlessly integrated with high-converting landing pages to capture and qualify traffic."
  },
  {
    question: "Will I get a dedicated team?",
    answer: "Absolutely. You won't be passed off to junior account managers. You work directly with a dedicated performance marketing team that understands your brand, manages daily optimizations, and reports on the metrics that actually matter."
  },
  {
    question: "How soon can I expect results?",
    answer: "Most of our partners see an initial surge in qualified inquiries within the first 14 to 21 days. However, the system truly stabilizes and scales for optimal ROAS around month two or three as the data matures."
  },
  {
    question: "Can I upgrade or change plans?",
    answer: "Yes. As your revenue scales and your sales team's capacity for leads increases, we can seamlessly upgrade your tier to expand into new channels, deploy advanced creatives, or manage higher ad spends."
  },
  {
    question: "Do you work with all industries?",
    answer: "While our fundamental growth methodologies are universal, we possess deep, profound expertise in scaling high-ticket and service-based brands, particularly luxury real estate and premium commercial projects."
  }
];

export default function FAQ() {
  // State to track which accordion is open. Null means all closed.
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-[#F8F9FB] py-24 md:py-32 selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* ================= SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16 md:mb-20"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Clear answers to help you make a confident decision. No fluff, just the facts about how we operate.
          </motion.p>
        </motion.div>

        {/* ================= ACCORDION LIST ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="flex flex-col gap-4"
        >
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              faq={faq} 
              isOpen={openIndex === index} 
              onClick={() => toggleAccordion(index)} 
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Accordion Component
// ----------------------------------------------------------------------
function AccordionItem({ faq, isOpen, onClick }) {
  return (
    <motion.div 
      variants={fadeUp}
      className={`bg-white border transition-colors duration-300 rounded-2xl overflow-hidden shadow-sm ${
        isOpen ? "border-[#2ED1B2]/40" : "border-[#E5E7EB] hover:border-[#2ED1B2]/20"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ED1B2]/50 group"
      >
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-lg md:text-xl font-bold text-[#0F172A] pr-8 group-hover:text-[#0EA5A4] transition-colors duration-300">
          {faq.question}
        </span>
        
        {/* Animated Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isOpen ? "bg-[#2ED1B2]/10 text-[#0EA5A4]" : "bg-slate-50 text-slate-400 group-hover:bg-[#2ED1B2]/5 group-hover:text-[#2ED1B2]"
          }`}
        >
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.div>
      </button>

      {/* Smooth Height Expansion via AnimatePresence */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-8 md:px-8 md:pb-10 pt-0">
              <p className="font-['Inter',sans-serif] text-[#475569] font-medium leading-relaxed md:text-lg border-t border-slate-100 pt-6 mt-2">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}