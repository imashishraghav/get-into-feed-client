import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-400 pt-32 pb-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-[#0b1015]/60 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
        <p className="text-sm mb-8">Last Updated: April 2026</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using the Get Into Feed website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Service Delivery & Payments</h2>
            <p>All digital marketing services, including SEO, performance ads, and social media management, are billed according to the agreed-upon contract or pricing tier. Monthly retainers are billed in advance. Get Into Feed reserves the right to suspend services if payments are delayed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Intellectual Property</h2>
            <p>Unless otherwise stated, Get Into Feed and/or its licensors own the intellectual property rights for all material generated during campaigns until full payment is received. Upon payment, usage rights of the final deliverables are transferred to the client.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
            <p>While we strive for explosive growth and maximum ROI, Get Into Feed cannot guarantee specific financial results from advertising platforms (like Google or Meta) due to the unpredictable nature of third-party algorithms and market conditions.</p>
          </section>
        </div>
      </div>
    </div>
  );
}