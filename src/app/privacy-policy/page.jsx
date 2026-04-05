import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-400 pt-32 pb-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-[#0b1015]/60 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-sm mb-8">Last Updated: April 2026</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>At Get Into Feed, we collect information that you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or request a strategy session. This may include your name, email address, phone number, and company details.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our marketing services. This includes responding to your inquiries, sending technical notices, and communicating with you about products, services, offers, and events offered by Get Into Feed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Sharing and Security</h2>
            <p>We do not sell, trade, or rent your personal identification information to others. We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access or disclosure of your personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies and Tracking</h2>
            <p>Our website may use "cookies" to enhance user experience. You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent. However, doing so may cause some parts of the site to not function properly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at: <strong className="text-[#3AE272]">privacy@getintofeed.com</strong></p>
          </section>
        </div>
      </div>
    </div>
  );
}