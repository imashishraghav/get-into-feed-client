// @ts-nocheck
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Mail, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";

// --- Premium Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function TermsPage() {
  const lastUpdated = "April 23, 2026";

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20 selection:text-secondary pt-24 pb-24 md:pt-32 relative overflow-hidden">
      
      {/* 🟢 Premium Ambient Header Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.05] via-background/0 to-transparent pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Back Navigation */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-sans font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-wider mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
        </motion.div>

        {/* 🟢 Header Section */}
        <motion.header 
          initial="hidden" animate="visible" variants={staggerContainer} 
          className="mb-16 md:mb-20 gpu-accelerated"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 shadow-sm">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-sans text-[11px] font-bold tracking-widest text-secondary uppercase">
              Legal Agreement
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeUpVariant} className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight mb-6 text-balance">
            Terms & Conditions
          </motion.h1>
          
          <motion.p variants={fadeUpVariant} className="font-sans text-lg md:text-xl text-slate-500 font-medium leading-relaxed text-balance">
            Clear rules, mutual respect, and transparent operations. These terms outline how we partner together to scale your brand predictably.
          </motion.p>
          
          <motion.p variants={fadeUpVariant} className="font-sans text-sm text-slate-400 mt-6 font-semibold uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </motion.p>
        </motion.header>

        {/* 🟢 Content Section */}
        <motion.article 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="font-sans text-slate-600 leading-relaxed space-y-14 gpu-accelerated"
        >
          
          {/* Section 1 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              1. Agreement to Terms
            </h2>
            <p className="mb-4">
              By accessing our website (Get Into Feed) or executing a Service Agreement or Statement of Work (SOW) with us, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services or website. 
            </p>
            <p>
              These terms constitute a legally binding agreement made between you (the "Client") and Get Into Feed (the "Agency").
            </p>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              2. Services & Scope of Work
            </h2>
            <p className="mb-4">
              We provide premium digital marketing services, including but not limited to <strong>Performance Marketing, Social Media Marketing, Influencer Marketing, Website Development, and Strategy Consulting</strong>. 
            </p>
            <ul className="list-none space-y-3 ml-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span><strong>Defined Scope:</strong> The exact deliverables, timelines, and budgets will be outlined in a separate, written Statement of Work (SOW) or proposal signed by both parties.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span><strong>Out-of-Scope Work:</strong> Any requests falling outside the agreed SOW will be evaluated separately and billed at our standard hourly or project rates.</span>
              </li>
            </ul>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              3. Client Responsibilities
            </h2>
            <p className="mb-4">To ensure we can build and optimize your growth systems effectively, you agree to:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 marker:text-primary">
              <li>Provide timely access to ad accounts, social profiles, websites, and necessary software.</li>
              <li>Deliver brand assets, approvals, and feedback within the agreed-upon timeframes.</li>
              <li>Ensure that all materials provided to us (images, videos, copy) do not infringe on any third-party intellectual property rights.</li>
            </ul>
            <p className="mt-4 text-sm text-slate-500 italic">
              Note: Delays in providing necessary access or assets will result in project delays, and billing will continue as scheduled.
            </p>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              4. Payment Terms & Billing
            </h2>
            <p className="mb-4">
              We operate on a transparent and structured billing model to maintain momentum on your campaigns.
            </p>
            <div className="bg-slate-50 border border-border rounded-2xl p-6 md:p-8 space-y-4">
              <div>
                <strong className="text-navy block mb-1">Invoicing:</strong> Retainer fees are billed at the beginning of each billing cycle (typically monthly).
              </div>
              <div>
                <strong className="text-navy block mb-1">Ad Spend:</strong> The Client is solely responsible for paying ad spend directly to platforms (Meta, Google, etc.). Our fees do not include media spend.
              </div>
              <div>
                <strong className="text-navy block mb-1">Late Payments:</strong> Invoices are due upon receipt unless otherwise stated. We reserve the right to pause all campaigns and services if invoices remain unpaid for more than 5 business days.
              </div>
            </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              5. Refund & Cancellation Policy
            </h2>
            <p className="mb-4">
              Because our services involve dedicated time, strategy, and intellectual property deployment, <strong>all fees paid are non-refundable</strong>. 
            </p>
            <p>
              Either party may cancel a monthly retainer agreement with a written notice as specified in your SOW (typically 30 days). Project-based contracts cannot be cancelled once work has commenced.
            </p>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              6. Intellectual Property Rights
            </h2>
            <p className="mb-4">
              <strong>Your Property:</strong> Upon full payment of all invoices, the Client owns the final deliverables (e.g., ad creatives, website code, written copy).
            </p>
            <p>
              <strong>Our Property:</strong> Get Into Feed retains all ownership and rights to our proprietary systems, internal frameworks, templates, and pre-existing code used to deliver the services. We also reserve the right to use non-confidential deliverables in our portfolio and marketing materials.
            </p>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              7. Confidentiality & Data Protection
            </h2>
            <p className="mb-4">
              We treat your business data with the highest level of respect. Both parties agree to keep all proprietary information, financial data, business strategies, and customer lists strictly confidential.
            </p>
            <p>
              For details on how we handle personal data collected via our website, please refer to our <Link href="/privacy-policy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </motion.section>

          {/* Section 8 - Crucial for Agencies */}
          <motion.section variants={fadeUpVariant}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-secondary" />
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy">
                8. Performance Disclaimer
              </h2>
            </div>
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
              <p className="text-slate-700 font-medium">
                While we utilize data-driven, industry-leading methodologies to optimize your campaigns, digital marketing involves variables beyond our control (market trends, competition, consumer behavior). Therefore, <strong>Get Into Feed makes no absolute guarantees regarding specific financial outcomes, lead volumes, or Return on Ad Spend (ROAS).</strong> Past performance is not a guarantee of future results.
              </p>
            </div>
          </motion.section>

          {/* Section 9 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              9. Third-Party Platforms Disclaimer
            </h2>
            <p className="mb-4">
              Our services heavily rely on third-party platforms (e.g., Meta, Google, TikTok, Shopify). We are not responsible or liable for:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 marker:text-primary">
              <li>Algorithm changes that impact campaign performance.</li>
              <li>Unexpected ad account bans, restrictions, or suspensions.</li>
              <li>Platform downtimes, bugs, or data tracking errors.</li>
            </ul>
          </motion.section>

          {/* Section 10 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              10. Limitation of Liability
            </h2>
            <p className="mb-4">
              Under no circumstances shall Get Into Feed, its directors, employees, or contractors be liable for any indirect, consequential, or special damages, including lost profits or lost data, arising out of or in connection with our services. 
            </p>
            <p>
              Our total maximum liability to you for any claim shall not exceed the total amount of fees paid by you to us in the three (3) months preceding the claim.
            </p>
          </motion.section>

          {/* Section 11 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              11. Indemnification
            </h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless Get Into Feed against any claims, damages, or legal fees arising from materials, assets, claims, or data provided by you (e.g., if you provide an image for an ad that violates a third party’s copyright).
            </p>
          </motion.section>

          {/* Section 12 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              12. Termination of Services
            </h2>
            <p className="mb-4">
              We reserve the right to terminate our services immediately, without refund, if you breach these Terms (including failure to pay), engage in abusive behavior toward our team, or demand unethical/illegal marketing practices.
            </p>
          </motion.section>

          {/* Section 13 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              13. Modifications to Terms
            </h2>
            <p className="mb-4">
              We may modify these Terms at any time. Updated versions will be posted on this page with a revised "Last Updated" date. Continued use of our services after updates constitutes acceptance of the new Terms.
            </p>
          </motion.section>

          {/* Section 14 */}
          <motion.section variants={fadeUpVariant}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              14. Governing Law & Jurisdiction
            </h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Delhi NCR (Noida), India.
            </p>
          </motion.section>

          {/* Section 15 - Contact */}
          <motion.section variants={fadeUpVariant} className="pt-8 border-t border-border mt-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-6">
              15. Contact Information
            </h2>
            <p className="mb-8">
              If you have any questions regarding these Terms & Conditions, please contact us directly:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 flex items-start gap-4 p-6 bg-slate-50 border border-border rounded-2xl transition-all hover:border-primary/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-navy mb-1">Email</h4>
                  <a href="mailto:legal@getintofeed.com" className="text-primary font-medium hover:underline">
                    legal@getintofeed.com
                  </a>
                </div>
              </div>
              
              <div className="flex-1 flex items-start gap-4 p-6 bg-slate-50 border border-border rounded-2xl transition-all hover:border-primary/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-navy mb-1">Office Location</h4>
                  <p className="text-slate-600 font-medium">
                    Get Into Feed<br />
                    Noida, Delhi NCR, India
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

        </motion.article>
      </div>
    </main>
  );
}