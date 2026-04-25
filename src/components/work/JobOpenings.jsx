"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Clock, ChevronRight, X } from "lucide-react";

import WorkWithUsForm from "@/components/work/WorkWithUsForm";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

export default function JobOpenings({ jobs = [] }) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedDept, setSelectedDept] = useState("All");

  // 🚀 ADVANCED: Extract unique departments for the filter dynamically
  const departments = useMemo(() => {
    const depts = jobs.map((job) => job.department).filter(Boolean);
    return ["All", ...new Set(depts)];
  }, [jobs]);

  // Filter jobs based on selected department
  const filteredJobs = useMemo(() => {
    if (selectedDept === "All") return jobs;
    return jobs.filter((job) => job.department === selectedDept);
  }, [jobs, selectedDept]);

  return (
    <section className="relative w-full py-20 bg-[#F8F9FB]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl">
              Don't see a perfect fit? Send us an open application. We're always looking for top talent.
            </p>
          </div>

          {/* 🚀 ADVANCED: Dynamic Department Filters */}
          {departments.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedDept === dept
                      ? "bg-[#2ED1B2] text-[#0F172A] shadow-md"
                      : "bg-white text-[#475569] border border-[#E5E7EB] hover:border-[#2ED1B2]/50 hover:text-[#0F172A]"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🚀 JOB GRID */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group flex flex-col bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:shadow-xl hover:border-[#2ED1B2]/40 transition-all duration-300 transform-gpu hover:-translate-y-1"
              >
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-[#F8F9FB] border border-[#E5E7EB] text-[#475569] text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                    {job.department}
                  </span>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-3 leading-tight group-hover:text-[#2ED1B2] transition-colors">
                    {job.role}
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed line-clamp-2">
                    {job.shortDescription}
                  </p>
                </div>

                {/* Job Metadata Tags */}
                <div className="flex flex-wrap gap-3 mt-auto pt-6 border-t border-[#E5E7EB] mb-8">
                  <div className="flex items-center text-xs font-semibold text-[#475569] bg-[#F8F9FB] px-3 py-1.5 rounded-full">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#2ED1B2]" /> {job.location}
                  </div>
                  <div className="flex items-center text-xs font-semibold text-[#475569] bg-[#F8F9FB] px-3 py-1.5 rounded-full">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 text-[#2ED1B2]" /> {job.type}
                  </div>
                  <div className="flex items-center text-xs font-semibold text-[#475569] bg-[#F8F9FB] px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-[#2ED1B2]" /> {job.experience}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setSelectedJob(job)}
                  className="w-full py-3.5 bg-[#0F172A] text-white rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-[#2ED1B2] group-hover:text-[#0F172A] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#2ED1B2] focus:ring-offset-2"
                >
                  Apply Now <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          /* 🚀 ADVANCED: Fallback Empty State */
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full bg-white border border-[#E5E7EB] rounded-3xl p-16 text-center shadow-sm"
          >
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">No Openings Found</h3>
            <p className="text-[#475569] mb-6">We currently don't have any open roles in this department.</p>
            <button 
              onClick={() => setSelectedDept("All")}
              className="text-[#2ED1B2] font-bold hover:underline underline-offset-4"
            >
              View all departments
            </button>
          </motion.div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 🚀 APPLICATION MODAL SYSTEM (Framer Motion) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between p-6 sm:p-8 border-b border-[#E5E7EB] bg-[#F8F9FB]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2ED1B2] mb-1 block">
                    Applying For
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0F172A] leading-tight">
                    {selectedJob.role}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 bg-white rounded-full text-[#475569] hover:bg-[#E5E7EB] hover:text-[#0F172A] transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content (Injecting your custom form) */}
              <div className="p-6 sm:p-8 overflow-y-auto">
                <WorkWithUsForm 
                  jobTitle={selectedJob.role} 
                  onClose={() => setSelectedJob(null)} 
                />
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
