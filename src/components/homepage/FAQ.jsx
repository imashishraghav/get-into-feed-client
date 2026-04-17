"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

// Import your global motion system (adjust path as needed)
import { staggerContainer, fadeUp, premiumEase, smoothEase } from "../../utils/animations";

// ----------------------------------------------------------------------
// High-Converting FAQ Data
// ----------------------------------------------------------------------
const faqs = [
  {
    question: "How long does it take to see results?",
    answer: "We build for long-term, sustainable scale. However, you will typically see initial performance improvements within the first 14–30 days as we plug revenue leaks, optimize existing campaigns, and launch tested creatives."
  },
  {
    question: "Do you work with all industries?",
    answer: "No. We specialize in high-growth e-commerce, B2B SaaS, and premium service/real-estate businesses. We only partner with brands where we are 100% confident our growth system will yield a predictable ROI."
  },
  {
    question: "What makes you different from other agencies?",
    answer: "Most agencies focus on clicks, impressions, and vanity metrics. We operate as your outsourced CMO and execution team. Our only focus is your bottom line—generating qualified leads, scaling revenue, and increasing your profit margins."
  },
  {
    question: "Do I need a large budget to start?",
    answer: "To ensure we have enough data and leverage to aggressively scale your operations, we typically partner with brands spending a minimum of $5k–$10k/month on ad spend. If you're below that, our Growth Phase plan is the perfect starting point."
  },
  {
    question: "How do we get started?",
    answer: "It starts with a Free Growth Audit. We will analyze your current ad accounts, creatives, and funnel to identify exactly what's holding you back. We provide a clear roadmap before you ever sign a contract."
  }
];

export default function FAQ() {
  // State to track which FAQ is open. Null means all are closed.
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    // If clicking the currently open FAQ, close it. Otherwise, open the new one.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // TIGHTENED: Reduced section py-24/32 to py-16/20
    <section className="relative py-16 md:py-20 bg-[#F8F9FB] selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          // TIGHTENED: Reduced mb-16/20 to mb-10/12
          className="text-center mb-10 md:mb-12"
        >
          {/* TIGHTENED: Reduced mb-6 to mb-4 */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0EA5A4] animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
              Clarity & Transparency
            </span>
          </motion.div>

          {/* TIGHTENED: Reduced mb-5 to mb-3 */}
          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-3 leading-tight"
          >
            Common Questions.
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg text-slate-500 font-medium max-w-xl mx-auto"
          >
            Everything you need to know about our process, pricing, and how we scale your business.
          </motion.p>
        </motion.div>

        {/* FAQ Accordion List */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          // TIGHTENED: Reduced space-y-4 to space-y-3
          className="space-y-3"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                variants={fadeUp}
                layout
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ease-out ${
                  isOpen 
                    ? "bg-white border-slate-300 shadow-md" 
                    : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  // TIGHTENED: Reduced vertical padding from p-6/8 to py-4/5 while keeping horizontal padding (px-6/8)
                  className="w-full flex items-center justify-between px-6 py-4 md:px-8 md:py-5 text-left focus:outline-none"
                >
                  <motion.h3 
                    layout="position"
                    className={`text-lg font-bold transition-colors duration-300 pr-8 ${
                      isOpen ? "text-[#0EA5A4]" : "text-[#0F172A] group-hover:text-[#0EA5A4]"
                    }`}
                  >
                    {faq.question}
                  </motion.h3>
                  
                  {/* Rotating Plus Icon */}
                  <motion.div
                    layout="position"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: premiumEase }}
                    // TIGHTENED: Slightly smaller icon container (w-7 h-7)
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isOpen ? "bg-[#2ED1B2]/10" : "bg-slate-100 group-hover:bg-[#2ED1B2]/10"
                    }`}
                  >
                    <Plus className={`w-4 h-4 transition-colors duration-300 ${isOpen ? "text-[#0EA5A4]" : "text-slate-500 group-hover:text-[#0EA5A4]"}`} />
                  </motion.div>
                </button>

                {/* Animated Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: smoothEase }}
                    >
                      {/* TIGHTENED: Reduced bottom padding to pb-5/6 and top margin to mt-1 */}
                      <div className="px-6 pb-5 md:px-8 md:pb-6 pt-0 text-slate-500 font-medium leading-relaxed text-[15px] border-t border-slate-50 mt-1">
                        <motion.p
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.1, ease: smoothEase }}
                          // TIGHTENED: Reduced pt-4 to pt-3
                          className="pt-3"
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}