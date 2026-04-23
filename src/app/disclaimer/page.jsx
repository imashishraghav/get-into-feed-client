// @ts-nocheck
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  ExternalLink, 
  BarChart3, 
  TrendingUp, 
  Star, 
  ShieldAlert, 
  CheckCircle,
  Scale,
  FileWarning
} from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-background text-navy/70 pt-32 pb-24 px-6 font-sans relative overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu">
      
      {/* --- 🟢 Ambient Cinematic Background --- */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(46,209,178,0.08),transparent_70%)]" />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/5 border border-navy/10 text-navy text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            <AlertCircle size={14} className="text-secondary" />
            Legal Disclosure
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl font-extrabold text-navy tracking-tight mb-4 text-balance"
          >
            Disclaimer
          </motion.h1>
          <p className="font-sans text-navy/50 font-medium text-sm uppercase tracking-widest">
            Effective Date: April 2026 • Get Into Feed®
          </p>
        </div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-2xl border border-border p-8 md:p-16 rounded-[2.5rem] shadow-soft transform-gpu"
        >
          <div className="space-y-12">
            
            {/* 1. General Info & 2. No Professional Advice */}
            <section className="relative pl-0 md:pl-6 border-l-0 md:border-l-2 border-primary/20">
              <h2 className="font-heading text-2xl font-bold text-navy mb-4">General Information & No Professional Advice</h2>
              <p className="text-lg font-medium text-navy/80 leading-relaxed italic mb-4">
                "The content provided on the Get Into Feed website, including all strategies, frameworks, and insights, is for general informational and educational purposes only. We engineer high-performance marketing systems; we do not provide licensed financial, legal, or tax advisory services."
              </p>
              <p className="text-navy/70 leading-relaxed">
                By utilizing this website or consuming our content, you acknowledge that no fiduciary, legal, or financial relationship is established. Always consult with a certified professional before making significant financial or legal decisions for your business.
              </p>
            </section>

            <hr className="border-border" />

            {/* 3. Earnings & Results & 11. No Guarantees */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <BarChart3 size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">Earnings, Results & No Guarantees</h2>
              </div>
              <div className="space-y-4 text-navy/70 leading-relaxed">
                <p>
                  Any income statements, ROAS (Return on Ad Spend) examples, lead volume metrics, or growth trajectories showcased on this platform represent <span className="text-navy font-bold">exceptional results</span> from specific, highly optimized campaigns. 
                </p>
                <p>
                  These metrics are intended to demonstrate our agency's capabilities. <span className="font-bold text-navy">Get Into Feed explicitly makes no guarantees regarding financial gains, revenue scaling, or specific business outcomes.</span> Past performance does not dictate future success. Your results will vary depending on your offer, market conditions, business infrastructure, and capital deployment.
                </p>
              </div>
            </section>

            {/* 4. Marketing Performance & 5. Third-Party Platforms */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <TrendingUp size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">Marketing & Third-Party Platforms</h2>
              </div>
              <div className="space-y-4 text-navy/70 leading-relaxed">
                <p>
                  Digital marketing operates within a highly dynamic ecosystem. Our strategies leverage third-party platforms such as <span className="font-bold text-navy">Meta (Facebook/Instagram), Google, TikTok, LinkedIn, and Shopify</span>.
                </p>
                <p>
                  Get Into Feed is an independent entity and is not directly affiliated with, or endorsed by, these platforms. We hold zero liability for algorithmic shifts, sudden ad account bans, arbitrary platform restrictions, API downtimes, or changes in third-party Terms of Service that may impact your campaign's performance or business operations.
                </p>
              </div>
            </section>

            {/* 7. Testimonials & Case Studies */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Star size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">Testimonials & Case Studies</h2>
              </div>
              <p className="text-navy/70 leading-relaxed">
                The case studies, client reviews, and testimonials featured across our platform are 100% authentic representations of our partnerships. However, they highlight our most successful collaborations. They are not intended to represent a "baseline" or promised standard for every client. Every business is unique, and results will invariably differ.
              </p>
            </section>

            {/* 6. External Links & 8. Affiliate Disclosure */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ExternalLink size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">External Links & Affiliate Disclaimer</h2>
              </div>
              <div className="space-y-4 text-navy/70 leading-relaxed">
                <p>
                  Our website and content may contain links to third-party websites, software tools, or resources not operated by Get Into Feed. We do not control, and assume no responsibility for, the content, security, or privacy practices of any third-party sites.
                </p>
                <p>
                  <span className="font-bold text-navy">Affiliate Disclosure:</span> Some outbound links on our site may be affiliate links. If you click on these links and make a purchase, we may receive a commission at no additional cost to you. We maintain strict integrity and only recommend software, tools, or services that we actively vet and utilize within our own agency operations.
                </p>
              </div>
            </section>

            {/* 9. Limitation of Liability & 10. User Responsibility */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Scale size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">Limitation of Liability & User Responsibility</h2>
              </div>
              <p className="text-navy/70 leading-relaxed mb-4">
                By utilizing our website, consuming our free content, or applying our insights, you accept full responsibility for your own business actions and advertising budgets. 
              </p>
              <div className="bg-background border border-border rounded-2xl p-6">
                <p className="text-sm font-semibold text-navy/80 uppercase tracking-wide mb-2">Legal Limitation:</p>
                <p className="text-sm italic text-navy/70">
                  Under no circumstances shall Get Into Feed, its founders, team members, or partners be held liable for any direct, indirect, incidental, consequential, or special damages—including lost profits, lost data, or business interruption—arising out of your use of, or inability to use, the information provided on this website.
                </p>
              </div>
            </section>

            {/* 12. Errors & Omissions */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileWarning size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">Errors & Omissions</h2>
              </div>
              <p className="text-navy/70 leading-relaxed">
                The digital marketing space evolves at a rapid pace. While we strive to ensure all articles, frameworks, and data published on this website are accurate and up-to-date at the time of publishing, Get Into Feed assumes no liability for errors, omissions, or outdated information.
              </p>
            </section>

            {/* 13. Consent & 14. Updates */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <CheckCircle size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">Consent & Modifications</h2>
              </div>
              <p className="text-navy/70 leading-relaxed">
                By accessing, browsing, and continuing to use getintofeed.com, you hereby unequivocally consent to this Disclaimer and agree to its terms. We reserve the right to amend, update, or modify this document at any time without prior individualized notice. Continued use of our platform signifies your acceptance of any published revisions.
              </p>
            </section>

            {/* 15. Final Contact Footer */}
            <div className="pt-8 mt-12 border-t border-border text-center">
              <p className="font-sans text-sm font-medium text-navy/50 mb-5">
                For legal inquiries or further clarification regarding this disclaimer:
              </p>
              <a 
                href="mailto:legal@getintofeed.com" 
                className="font-heading inline-block px-8 py-3.5 rounded-full bg-navy text-white font-bold tracking-wide hover:bg-navy/90 transition-all hover:scale-105 shadow-md hover:shadow-xl hover:shadow-navy/20"
              >
                legal@getintofeed.com
              </a>
            </div>

          </div>
        </motion.div>
      </div>
    </main>
  );
}