"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

// 🟢 Import your custom lag-free smooth scroll hook & animation utils
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "../../utils/animations";

/* // ============================================================================
// 🔌 SANITY CMS INTEGRATION (SERVER COMPONENT USAGE)
// ============================================================================
// In your app/services/page.jsx (or wherever you use this), fetch and pass the data:
//
// import { client } from "@/sanity/lib/client";
// import TestimonialsSection from "@/components/services/TestimonialsSection";
//
// const query = `*[_type == "testimonial"]{
//   _id, name, role, company, testimonial, 
//   "imageUrl": image.asset->url
// }`;
//
// export default async function ServicesPage() {
//   const testimonials = await client.fetch(query).catch(() => []);
//   return <TestimonialsSection testimonials={testimonials} />;
// }
// ============================================================================ */

// ----------------------------------------------------------------------
// Fallback Data (Contextual to your actual project history for testing)
// ----------------------------------------------------------------------
const fallbackTestimonials = [
  {
    _id: "1",
    name: "Vikas Gupta",
    role: "Director",
    company: "Property Expert Realtors",
    testimonial: "The marketing systems built by the Get Into Feed team completely transformed our lead pipeline. Their strategic approach to real estate acquisition is unmatched.",
    imageUrl: null,
  },
  {
    _id: "2",
    name: "Rahul Verma",
    role: "Marketing Head",
    company: "Eldeco 7 Peaks",
    testimonial: "We saw a massive surge in qualified inquiries for our new launch. They don't just run ads; they own the entire funnel architecture and optimize for actual revenue.",
    imageUrl: null,
  },
  {
    _id: "3",
    name: "Amit Sharma",
    role: "Founder",
    company: "Laxmi Boys PG",
    testimonial: "Within 30 days, our acquisition costs dropped by 40%. Their deep understanding of search intent and audience targeting gave us the predictable growth we needed.",
    imageUrl: null,
  }
];

// ----------------------------------------------------------------------
// Shared Helpers
// ----------------------------------------------------------------------
const renderStars = () => (
  <div className="flex gap-1 mb-5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={16} className="fill-[#2ED1B2] text-[#2ED1B2]" />
    ))}
  </div>
);

const FallbackAvatar = ({ name, className }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className={`rounded-full bg-gradient-to-br from-[#F8F9FB] to-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center text-[#0EA5A4] font-bold shadow-sm ${className}`}>
      {initial}
    </div>
  );
};

export default function TestimonialsSection({ testimonials = fallbackTestimonials }) {
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

  const displayData = testimonials?.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#F8F9FB] py-16 md:py-24 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      {/* Subtle Background Glow */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#2ED1B2]/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-0" 
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
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-white px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              Testimonials
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-6"
          >
            Trusted by Brands That <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Want Real Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            Here’s what our clients say about working with our systems.
          </motion.p>
        </motion.div>

        {/* ================= TESTIMONIALS LAYOUT ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: sectionLift }}
          /* Mobile: Swipeable Carousel | Desktop: 3-Column Grid */
          className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
        >
          {displayData.map((testimonial, index) => (
            <TestimonialCard key={testimonial._id || index} data={testimonial} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Testimonial Card Component
// ----------------------------------------------------------------------
function TestimonialCard({ data, index }) {
  // 🟢 FIXED: The syntax here is corrected for Framer Motion
  const hoverTransition = { type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 };

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, transition: hoverTransition }} // 🟢 FIX APPLIED HERE
      className="group relative bg-white border border-[#E5E7EB] rounded-3xl p-8 min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center transition-all duration-300 ease-out hover:border-[#2ED1B2]/40 hover:shadow-[0_20px_40px_-10px_rgba(46,209,178,0.12)] flex flex-col h-full overflow-hidden shrink-0 md:shrink"
    >
      {/* Decorative Quote Icon Background */}
      <Quote className="absolute top-6 right-6 text-[#F8F9FB] w-16 h-16 rotate-180 transition-transform duration-500 group-hover:scale-110 z-0" />

      {/* Premium Top Border Glow on Hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      <div className="relative z-10 flex flex-col flex-1">
        {renderStars()}
        
        <blockquote className="text-[#475569] text-base md:text-[17px] leading-relaxed font-medium mb-8 flex-1">
          "{data.testimonial}"
        </blockquote>
        
        {/* Client Details Section */}
        <div className="flex items-center gap-4 pt-6 border-t border-[#E5E7EB]/50 mt-auto">
          <div className="shrink-0 w-12 h-12 relative rounded-full overflow-hidden border border-[#E5E7EB] shadow-sm">
            {data.imageUrl ? (
              <Image src={data.imageUrl} alt={data.name} fill className="object-cover" />
            ) : (
              <FallbackAvatar name={data.name} className="w-full h-full text-base" />
            )}
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#0F172A] leading-tight">
              {data.name}
            </h4>
            <p className="text-xs font-semibold text-[#475569] mt-1">
              {data.role} <span className="text-[#2ED1B2] mx-1">•</span> {data.company}
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}