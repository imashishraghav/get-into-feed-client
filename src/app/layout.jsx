import { Suspense } from 'react'; // 🟢 YEH IMPORT ADD KIYA HAI
import './globals.css'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import CookieBanner from '../components/CookieBanner';
import ScrollToTop from '../components/ScrollToTop';

export const metadata = {
  title: {
    default: 'Dominate the Feed | Get Into Feed',
    template: '%s | Get Into Feed'
  },
  description: 'We engineer scalable marketing systems that drive high-intent lead generation and exponential sales growth. Stop competing—start dominating.',
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      dir="ltr"
      suppressHydrationWarning 
    >
      <body 
        suppressHydrationWarning 
        className="bg-[#F8F9FB] text-[#0F172A] antialiased font-sans overflow-x-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
      >
        {/* 🟢 SUSPENSE WRAPPER ADD KIYA HAI */}
        <Suspense fallback={<div className="min-h-screen bg-[#F8F9FB]"></div>}>
          
          {/* 🧠 Global UX Layer */}
          <CookieBanner />
          <ScrollToTop />

          {/* 🚀 Smooth Scroll Wrapper (GLOBAL) */}
          <SmoothScroll>
            
            {/* 🌍 Layout */}
            <Navbar />
            
            <main className="relative z-10 min-h-screen will-change-transform">
              {children}
            </main>
            
            <Footer />

          </SmoothScroll>

        </Suspense>
      </body>
    </html>
  );
}