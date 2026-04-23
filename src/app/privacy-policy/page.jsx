// @ts-nocheck
import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Get Into Feed",
  description: "Learn how we protect your data, manage your privacy, and secure your information at Get Into Feed.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 23, 2026";

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20 selection:text-secondary pt-24 pb-24 md:pt-32">
      
      {/* 🟢 Premium Ambient Header Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.05] via-background/0 to-transparent pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Back Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-sans font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-wider mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>

        {/* 🟢 Header Section */}
        <header className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-sans text-[11px] font-bold tracking-widest text-secondary uppercase">
              Data & Privacy
            </span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight mb-6 text-balance">
            Privacy Policy
          </h1>
          
          <p className="font-sans text-lg md:text-xl text-slate-500 font-medium leading-relaxed text-balance">
            We build predictable growth systems, not data-selling schemes. Here is exactly how we handle, protect, and respect your information.
          </p>
          <p className="font-sans text-sm text-slate-400 mt-6 font-semibold uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </header>

        {/* 🟢 Content Section */}
        <article className="font-sans text-slate-600 leading-relaxed space-y-12">
          
          {/* Section 1 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              At <strong>Get Into Feed</strong> ("we", "our", or "us"), we are committed to safeguarding your privacy. We operate as a performance marketing and digital strategy agency. Because we deal with data to optimize campaigns and scale revenue, transparency is our core principle.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, submit a contact form, or engage with our services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              To deliver our high-converting marketing systems, we only collect information that is absolutely necessary. This falls into two categories:
            </p>
            <ul className="list-none space-y-3 ml-1 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <div>
                  <strong className="text-navy">Information You Provide:</strong> Name, email address, company details, website URLs, and project requirements submitted via our contact or application forms.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <div>
                  <strong className="text-navy">Automatically Collected Data:</strong> IP addresses, browser types, device information, and interaction metrics (such as time spent on pages) collected when you browse our site.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use the data we collect for legitimate business purposes, specifically to:</p>
            <div className="bg-slate-50 border border-border rounded-2xl p-6 md:p-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span> Provide and manage our services
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span> Respond to your inquiries & audits
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span> Optimize website performance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span> Run targeted ad campaigns (with consent)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span> Prevent fraudulent activities
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              4. Cookies & Tracking Technologies
            </h2>
            <p className="mb-4">
              We use cookies, web beacons, and similar tracking technologies to track activity on our website. This includes <strong>Google Analytics</strong> to measure traffic and advertising pixels like the <strong>Meta Pixel</strong> and <strong>Google Ads tags</strong> to evaluate the success of our marketing efforts.
            </p>
            <p>
              <strong>Your Control:</strong> You have full control over non-essential cookies. Upon your first visit, our Cookie Consent system allows you to opt-in or out of Performance and Targeting cookies. You can update these preferences at any time via the settings icon on our site.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              5. Third-Party Services & Data Sharing
            </h2>
            <p className="mb-4">
              <strong>We do not sell, rent, or trade your personal data.</strong> We only share information with trusted third-party service providers who assist us in operating our business. These include:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 mb-4 marker:text-slate-300">
              <li>Analytics providers (e.g., Google Analytics).</li>
              <li>Advertising networks (e.g., Meta, Google) strictly for campaign tracking.</li>
              <li>Cloud hosting and CRM platforms used to manage your project.</li>
            </ul>
            <p>
              These partners are bound by strict confidentiality agreements and are prohibited from using your data for any other purpose.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              6. Data Security
            </h2>
            <p className="mb-4">
              We implement industry-standard administrative, technical, and physical security measures to protect your personal information. While no electronic transmission over the internet can be 100% secure, we utilize encrypted connections (HTTPS) and secure databases to ensure your data remains protected against unauthorized access.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              7. Your Privacy Rights (GDPR & Global Compliance)
            </h2>
            <p className="mb-4">
              Depending on your location, you possess certain rights regarding your personal data. We respect these rights globally:
            </p>
            <div className="space-y-4">
              <div className="p-5 bg-white border border-border rounded-xl shadow-sm">
                <h4 className="font-heading font-bold text-navy mb-1">Right to Access</h4>
                <p className="text-sm">You can request a copy of the personal data we hold about you.</p>
              </div>
              <div className="p-5 bg-white border border-border rounded-xl shadow-sm">
                <h4 className="font-heading font-bold text-navy mb-1">Right to Rectification</h4>
                <p className="text-sm">You have the right to request correction of any inaccurate or incomplete data.</p>
              </div>
              <div className="p-5 bg-white border border-border rounded-xl shadow-sm">
                <h4 className="font-heading font-bold text-navy mb-1">Right to Erasure ("Right to be Forgotten")</h4>
                <p className="text-sm">You can request that we delete your personal information from our systems.</p>
              </div>
            </div>
            <p className="mt-4">
              To exercise any of these rights, please contact us using the information provided below. We will respond to your request within 30 days.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              8. Data Retention
            </h2>
            <p className="mb-4">
              We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, or as required to comply with our legal obligations, resolve disputes, and enforce our legal agreements.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
              9. Changes to This Policy
            </h2>
            <p className="mb-4">
              The digital landscape evolves rapidly, and so might our practices. We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated "Last Updated" date at the top. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Section 10 - Contact */}
          <section className="pt-8 border-t border-border mt-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-6">
              10. Contact Us
            </h2>
            <p className="mb-8">
              If you have questions or comments about this Privacy Policy, or if you would like us to update or delete your information, please reach out to our team:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 flex items-start gap-4 p-6 bg-slate-50 border border-border rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-navy mb-1">Email</h4>
                  <a href="mailto:privacy@getintofeed.com" className="text-primary font-medium hover:underline">
                    privacy@getintofeed.com
                  </a>
                </div>
              </div>
              
              <div className="flex-1 flex items-start gap-4 p-6 bg-slate-50 border border-border rounded-2xl">
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
          </section>

        </article>
      </div>
    </main>
  );
}