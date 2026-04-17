"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

// ----------------------------------------------------------------------
// Animation Variants (Refined for a smoother, premium feel)
// ----------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Testimonials({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null;

  // Separate featured testimonial from regular ones
  const featured = testimonials.find((t) => t.featured) || testimonials[0];
  const regular = testimonials.filter((t) => t._id !== featured?._id).slice(0, 3);

  // Helper to render stars with accessibility
  const renderStars = (rating) => {
    const validRating = Math.min(Math.max(rating || 5, 0), 5);
    return (
      <div 
        className="flex gap-1" 
        aria-label={`Rated ${validRating} out of 5 stars`}
        role="img"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            aria-hidden="true"
            className={`transition-colors duration-300 ${
              i < validRating 
                ? "fill-[#2ED1B2] text-[#2ED1B2]" 
                : "fill-slate-100 text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  // Helper for Fallback Avatar
  const renderFallbackAvatar = (name, sizeClasses) => {
    const initial = name ? name.charAt(0).toUpperCase() : "U";
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#F8F9FB] to-slate-100 border border-[#E5E7EB] flex items-center justify-center text-[#0EA5A4] font-bold shadow-sm`}>
        {initial}
      </div>
    );
  };

  return (
    // ADJUSTED PADDING HERE: Reduced top padding (pt-12 md:pt-16)
    <section className="relative w-full bg-[#F8F9FB] pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      {/* Subtle Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2ED1B2] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#0EA5A4] opacity-[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EA5A4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0EA5A4]"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-[#0EA5A4] uppercase">
              Client Feedback
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight mb-4">
            Don’t Take Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5A4] to-[#2ED1B2]">Word For It.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto mb-4">
            Here’s what happens when you turn attention into real, predictable revenue.
          </p>

          {/* Micro Trust Signal */}
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Trusted by founders, marketers, and scaling brands
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-8"
        >
          {/* BIG FEATURED TESTIMONIAL */}
          {featured && (
            <motion.div variants={itemVariants} className="w-full">
              <div className="relative group bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 border border-slate-200 shadow-sm transition-all duration-500 ease-out hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 overflow-hidden">
                {/* Decorative Quote Icon (Softened) */}
                <Quote className="absolute -top-4 -left-4 md:top-8 md:left-8 text-slate-50 w-32 h-32 md:w-40 md:h-40 -z-0 rotate-180 transition-transform duration-700 group-hover:scale-105" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-6">
                      {renderStars(featured.rating)}
                    </div>
                    
                    {/* Softened text color from slate-800 to slate-700 for better premium reading flow */}
                    <blockquote className="text-2xl md:text-3xl lg:text-[2rem] font-bold text-slate-700 leading-snug mb-10 tracking-tight">
                      "{featured.feedback}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center md:justify-start gap-5 mt-auto">
                      <div className="relative w-16 h-16 transition-transform duration-500 group-hover:scale-105">
                        {featured.imageUrl ? (
                          <Image
                            src={featured.imageUrl}
                            alt={`${featured.name}'s profile picture`}
                            fill
                            className="rounded-full border-2 border-white shadow-sm object-cover"
                          />
                        ) : (
                          renderFallbackAvatar(featured.name, "w-16 h-16 text-2xl")
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="text-slate-900 font-bold text-lg">{featured.name || "Anonymous User"}</h4>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">
                          {featured.role} 
                          {featured.company && <><span className="text-[#2ED1B2] mx-1.5">•</span> {featured.company}</>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SMALLER CARDS GRID */}
          {regular.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {regular.map((testimonial, i) => (
                <motion.div key={testimonial._id || i} variants={itemVariants} className="h-full">
                  <div className="relative h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all duration-500 ease-out hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-[#2ED1B2]/20 flex flex-col group overflow-hidden">
                    
                    {/* Subtle Background Quote */}
                    <Quote className="absolute top-6 right-6 text-slate-50 w-12 h-12 rotate-180 transition-transform duration-500 group-hover:scale-110" />

                    <div className="relative z-10 mb-6">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    {/* Adjusted line-height and text color for premium readability */}
                    <blockquote className="relative z-10 text-slate-600 text-lg font-medium leading-relaxed mb-8 flex-1">
                      "{testimonial.feedback}"
                    </blockquote>
                    
                    <div className="relative z-10 flex items-center gap-4 mt-auto pt-6 border-t border-slate-100 transition-colors">
                      <div className="relative w-12 h-12">
                        {testimonial.imageUrl ? (
                          <Image
                            src={testimonial.imageUrl}
                            alt={`${testimonial.name}'s profile picture`}
                            fill
                            className="rounded-full border border-slate-100 shadow-sm object-cover"
                          />
                        ) : (
                          renderFallbackAvatar(testimonial.name, "w-12 h-12 text-lg")
                        )}
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-bold">{testimonial.name || "Anonymous User"}</h4>
                        {/* Consistent • Separator Applied Here */}
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {testimonial.role}
                          {testimonial.company && <><span className="text-[#2ED1B2] mx-1.5">•</span> {testimonial.company}</>}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}