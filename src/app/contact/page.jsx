"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Zap, BarChart3, Globe, 
  ChevronRight, ArrowLeft, Send, 
  CheckCircle2, Mail, Phone, Loader2, MapPin
} from 'lucide-react';

// --- AWWWARDS-LEVEL ANIMATION CONFIG ---
const premiumEase = [0.16, 1, 0.3, 1];

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 40 : -40, opacity: 0 })
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    goal: '', budget: '', name: '', email: '', phone: '', company: '', message: ''
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  // Actual Backend Submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          company: formData.company, 
          budget: formData.budget,
          message: `[Goal: ${formData.goal}] - ${formData.message}`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setServerError("Failed to send message. Please try again.");
      }
    } catch (error) {
      setServerError("Server Error! Backend check kijiye.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* --- PREMIUM TYPOGRAPHY INJECTION --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Mono:wght@400;700&display=swap');
        .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        input:-webkit-autofill, textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 50px white inset !important;
          -webkit-text-fill-color: #0F172A !important;
        }
        input::placeholder, textarea::placeholder { color: #9CA3AF; font-weight: 400; }
      `}} />

      {/* Base: Premium Light Theme */}
      <main className="bg-[#F9FAFB] min-h-screen font-body text-[#0F172A] selection:bg-[#0F172A] selection:text-white relative overflow-hidden pb-32">
        
        {/* Subtle Grain Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

        {/* Blurred Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C9A227]/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none z-0" />

        {/* =========================================
            HERO SECTION
        ========================================= */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgb(15,23,42,0.04)] mb-8">
              <div className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></div>
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#0F172A]">
                Initiate
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-heading text-6xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.95] text-[#0F172A] mb-8">
              Let's <span className="text-[#6B7280]">Talk.</span>
            </motion.h1>
          </motion.div>
        </section>

        {/* =========================================
            MAIN SPLIT LAYOUT (Info + Multi-Step Form)
        ========================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Sticky Contact Info (International Standard) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 pr-0 lg:pr-8">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <motion.h3 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-6 text-[#0F172A] leading-[1.2]">
                  Ready to scale your <br /> global acquisition?
                </motion.h3>
                <motion.p variants={fadeUp} className="font-body text-[#6B7280] text-lg leading-relaxed mb-12 max-w-sm">
                  Whether you need to dominate search, scale paid media, or restructure your entire funnel, our strategists are ready to engineer your growth.
                </motion.p>

                <motion.div variants={fadeUp} className="space-y-10 border-l border-[#E5E7EB] pl-8">
                  {/* Global Email */}
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-2 text-[#6B7280]">
                      <Mail size={16} />
                      <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">New Business</span>
                    </div>
                    <a href="mailto:partnerships@agency.global" className="font-heading text-xl md:text-2xl font-bold text-[#0F172A] group-hover:text-[#C9A227] transition-colors duration-500 tracking-tight">
                      partnerships@agency.global
                    </a>
                  </div>

                  {/* Global Phone */}
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-2 text-[#6B7280]">
                      <Phone size={16} />
                      <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">Global Desk</span>
                    </div>
                    <a href="tel:+18005550199" className="font-heading text-xl md:text-2xl font-bold text-[#0F172A] group-hover:text-[#C9A227] transition-colors duration-500 tracking-tight">
                      +1 (800) 555-0199
                    </a>
                  </div>

                  {/* Global HQ */}
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-2 text-[#6B7280]">
                      <MapPin size={16} />
                      <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">London HQ</span>
                    </div>
                    <p className="font-heading text-lg font-bold text-[#0F172A] group-hover:text-[#C9A227] transition-colors duration-500 tracking-tight">
                      100 Shoreditch High St<br />London, E1 6JQ
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Premium Multi-Step Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: premiumEase }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-[#E5E7EB] shadow-[0_8px_40px_rgb(15,23,42,0.04)] relative overflow-hidden min-h-[500px]"
              >
                {!isSubmitted ? (
                  <>
                    {/* Minimalist Progress Bar */}
                    <div className="mb-12">
                      <div className="flex justify-between font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#9CA3AF] mb-4">
                        <span className={step >= 1 ? "text-[#0F172A]" : ""}>01. Goal</span>
                        <span className={step >= 2 ? "text-[#0F172A]" : ""}>02. Budget</span>
                        <span className={step >= 3 ? "text-[#0F172A]" : ""}>03. Details</span>
                      </div>
                      <div className="w-full h-[2px] bg-[#F3F4F6] overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#0F172A]" 
                          initial={{ width: '33.33%' }} 
                          animate={{ width: `${(step / 3) * 100}%` }} 
                          transition={{ duration: 0.6, ease: premiumEase }}
                        />
                      </div>
                    </div>

                    <form onSubmit={onSubmit} className="relative z-10">
                      <AnimatePresence mode="wait" custom={direction}>
                        
                        {/* ================= STEP 1: GOAL ================= */}
                        {step === 1 && (
                          <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: premiumEase }} className="space-y-8">
                            <div>
                              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight">Primary Objective</h2>
                              <p className="font-body text-[#6B7280]">Select the main focus for your upcoming campaign.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {[
                                { id: 'Lead Generation', label: 'Lead Generation', icon: <Target className="w-5 h-5"/> },
                                { id: 'Social & Viral', label: 'Social & Viral', icon: <Zap className="w-5 h-5"/> },
                                { id: 'E-commerce Sales', label: 'E-commerce Sales', icon: <BarChart3 className="w-5 h-5"/> },
                                { id: 'Brand Authority', label: 'Brand Authority', icon: <Globe className="w-5 h-5"/> }
                              ].map((goal) => (
                                <div 
                                  key={goal.id} 
                                  onClick={() => updateForm('goal', goal.id)} 
                                  className={`p-6 rounded-[1.5rem] border cursor-pointer transition-all duration-300 flex flex-col gap-4 group ${formData.goal === goal.id ? "border-[#C9A227] bg-[#C9A227]/5" : "border-[#E5E7EB] bg-transparent hover:border-[#0F172A]"}`}
                                >
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.goal === goal.id ? "bg-[#C9A227] text-white" : "bg-[#F3F4F6] text-[#6B7280] group-hover:bg-[#0F172A] group-hover:text-white"}`}>
                                    {goal.icon}
                                  </div>
                                  <h4 className="font-heading font-bold text-lg text-[#0F172A]">{goal.label}</h4>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-end pt-6 border-t border-[#E5E7EB]">
                              <button 
                                type="button" disabled={!formData.goal} onClick={nextStep} 
                                className="group flex items-center gap-3 text-[#0F172A] font-heading font-bold tracking-tight disabled:opacity-30 transition-opacity"
                              >
                                Next Step
                                <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
                                  <ChevronRight size={18}/>
                                </div>
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* ================= STEP 2: BUDGET ================= */}
                        {step === 2 && (
                          <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: premiumEase }} className="space-y-8">
                            <div>
                              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight">Project Scale</h2>
                              <p className="font-body text-[#6B7280]">Select your estimated monthly media or retainer budget.</p>
                            </div>
                            
                            {/* Internationalized Budgets */}
                            <div className="flex flex-col gap-3">
                              {['$10k - $50k', '$50k - $100k', '$100k - $500k', '$500k+'].map((range) => (
                                <div 
                                  key={range} 
                                  onClick={() => updateForm('budget', range)} 
                                  className={`p-5 rounded-2xl border cursor-pointer font-heading font-bold text-lg transition-all duration-300 flex items-center justify-between group ${formData.budget === range ? "border-[#0F172A] bg-[#0F172A] text-white shadow-lg" : "border-[#E5E7EB] bg-transparent text-[#0F172A] hover:border-[#0F172A]"}`}
                                >
                                  {range}
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.budget === range ? 'border-white' : 'border-[#E5E7EB] group-hover:border-[#0F172A]'}`}>
                                    {formData.budget === range && <div className="w-2.5 h-2.5 bg-[#C9A227] rounded-full" />}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center pt-6 border-t border-[#E5E7EB]">
                              <button type="button" onClick={prevStep} className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#6B7280] hover:text-[#0F172A] transition-colors">
                                <ArrowLeft size={16}/> Back
                              </button>
                              <button 
                                type="button" disabled={!formData.budget} onClick={nextStep} 
                                className="group flex items-center gap-3 text-[#0F172A] font-heading font-bold tracking-tight disabled:opacity-30 transition-opacity"
                              >
                                Next Step
                                <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
                                  <ChevronRight size={18}/>
                                </div>
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* ================= STEP 3: DETAILS ================= */}
                        {step === 3 && (
                          <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: premiumEase }} className="space-y-10">
                            <div>
                              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight">Final Details</h2>
                              <p className="font-body text-[#6B7280]">Where should our strategists send the proposal?</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                              <div className="relative group">
                                <label className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B7280] mb-2 block group-focus-within:text-[#C9A227] transition-colors">
                                  Full Name *
                                </label>
                                <input 
                                  required type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)}
                                  placeholder="John Doe"
                                  className="w-full bg-transparent border-b border-[#E5E7EB] pb-2 text-xl font-heading font-bold text-[#0F172A] focus:outline-none focus:border-[#C9A227] transition-colors rounded-none"
                                />
                              </div>
                              <div className="relative group">
                                <label className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B7280] mb-2 block group-focus-within:text-[#C9A227] transition-colors">
                                  Company / Brand *
                                </label>
                                <input 
                                  required type="text" value={formData.company} onChange={(e) => updateForm('company', e.target.value)}
                                  placeholder="Acme Corp"
                                  className="w-full bg-transparent border-b border-[#E5E7EB] pb-2 text-xl font-heading font-bold text-[#0F172A] focus:outline-none focus:border-[#C9A227] transition-colors rounded-none"
                                />
                              </div>
                              <div className="relative group">
                                <label className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B7280] mb-2 block group-focus-within:text-[#C9A227] transition-colors">
                                  Email Address *
                                </label>
                                <input 
                                  required type="email" value={formData.email} onChange={(e) => updateForm('email', e.target.value)}
                                  placeholder="john@company.com"
                                  className="w-full bg-transparent border-b border-[#E5E7EB] pb-2 text-xl font-heading font-bold text-[#0F172A] focus:outline-none focus:border-[#C9A227] transition-colors rounded-none"
                                />
                              </div>
                              <div className="relative group">
                                <label className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B7280] mb-2 block group-focus-within:text-[#C9A227] transition-colors">
                                  Phone Number
                                </label>
                                <input 
                                  type="tel" value={formData.phone} onChange={(e) => updateForm('phone', e.target.value)}
                                  placeholder="+1 (555) 000-0000"
                                  className="w-full bg-transparent border-b border-[#E5E7EB] pb-2 text-xl font-heading font-bold text-[#0F172A] focus:outline-none focus:border-[#C9A227] transition-colors rounded-none"
                                />
                              </div>
                              <div className="relative group md:col-span-2">
                                <label className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B7280] mb-2 block group-focus-within:text-[#C9A227] transition-colors">
                                  Project Details *
                                </label>
                                <textarea 
                                  required rows="2" value={formData.message} onChange={(e) => updateForm('message', e.target.value)}
                                  placeholder="Tell us briefly about your current bottlenecks..."
                                  className="w-full bg-transparent border-b border-[#E5E7EB] pb-2 text-lg font-body text-[#0F172A] focus:outline-none focus:border-[#C9A227] transition-colors rounded-none resize-none leading-relaxed"
                                ></textarea>
                              </div>
                            </div>

                            {serverError && <p className="font-body text-red-500 text-sm font-medium">{serverError}</p>}

                            <div className="flex justify-between items-center pt-6 border-t border-[#E5E7EB]">
                              <button type="button" onClick={prevStep} className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#6B7280] hover:text-[#0F172A] transition-colors">
                                <ArrowLeft size={16}/> Back
                              </button>
                              
                              {/* Premium Submit Button */}
                              <motion.button 
                                type="submit" disabled={isSubmitting}
                                whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ ease: premiumEase, duration: 0.4 }}
                                className="group relative overflow-hidden bg-[#0F172A] text-white px-8 md:px-10 py-4 rounded-full font-heading font-bold text-lg tracking-tight flex justify-center items-center gap-3 shadow-[0_8px_20px_rgb(15,23,42,0.15)] disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                <div className="absolute inset-0 bg-[#C9A227] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></div>
                                <span className="relative z-10 transition-colors duration-500">
                                  {isSubmitting ? 'Transmitting' : 'Submit Request'}
                                </span>
                                <div className="relative z-10 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white overflow-hidden">
                                  {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
                                        <Send size={14} />
                                      </div>
                                      <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
                                        <Send size={14} />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </>
                ) : (
                  /* ================= SUCCESS STATE ================= */
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: premiumEase }}
                    className="w-full h-full min-h-[400px] flex flex-col justify-center items-center text-center p-8 relative z-10"
                  >
                    <div className="w-20 h-20 bg-[#F9FAFB] border border-[#E5E7EB] shadow-sm flex items-center justify-center rounded-full mb-8">
                      <CheckCircle2 size={32} className="text-[#C9A227]" />
                    </div>
                    <h3 className="font-heading text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter mb-4">
                      Signal Received.
                    </h3>
                    <p className="font-body text-[#6B7280] text-lg leading-relaxed max-w-md mb-10">
                      Your brief has been securely transmitted. A senior strategist will review your requirements and respond within 24 hours.
                    </p>
                    <button 
                      onClick={() => { setIsSubmitted(false); setStep(1); }}
                      className="font-mono text-xs tracking-[0.2em] font-bold uppercase text-[#0F172A] hover:text-[#C9A227] transition-colors duration-300 border-b border-[#0F172A] hover:border-[#C9A227] pb-1"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>

          </div>
        </section>

        {/* =========================================
            BOTTOM SECTION: PREMIUM MAP
        ========================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mt-24 md:mt-32 relative z-10">
          <div className="w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-[#E5E7EB] shadow-[0_8px_40px_rgb(15,23,42,0.04)] relative bg-white">
            {/* Minimal Light Mode Map (London Focus) */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39722.25700412678!2d-0.127592!3d51.507222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(80%) contrast(1.1) opacity(0.8)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Global Headquarters"
            ></iframe>
            
            {/* Floating Location Card over Map */}
            <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_8px_32px_rgb(15,23,42,0.08)] hidden md:block">
              <p className="font-heading text-xl font-black text-[#0F172A] tracking-tighter mb-1">London, UK</p>
              <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#C9A227]">Global HQ</p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}