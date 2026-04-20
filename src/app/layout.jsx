import { Suspense } from 'react'; 
import { Sora, Inter } from 'next/font/google'; // 🟢 Font Imports Add Kiye Hain
import './globals.css'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import CookieBanner from '../components/CookieBanner';
import ScrollToTop from '../components/ScrollToTop';

// 🟢 1. Initialize Fonts
const sora = Sora({ 
  subsets: ['latin'], 
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('http://localhost:3000'), // 🟢 YEH LINE ADD KI HAI (Production mein isko apni actual live domain se replace kar dijiyega)
  title: {
    default: 'Dominate the Feed | Get Into Feed',
    template: '%s | Get Into Feed'
  },
  description: 'We engineer scalable marketing systems that drive high-intent lead generation and exponential sales growth. Stop competing—start dominating.',
};

// 🟢 Premium Loader Fallback
const PageLoader = () => (
  <div className="min-h-[80vh] w-full flex items-center justify-center bg-[#F8F9FB]">
    <div className="w-10 h-10 border-4 border-[#E5E7EB] border-t-[#2ED1B2] rounded-full animate-spin" />
  </div>
);

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      dir="ltr"
      suppressHydrationWarning 
      className={`${sora.variable} ${inter.variable}`} // 🟢 2. Font variables inject kiye hain
    >
      <body 
        suppressHydrationWarning 
        className="bg-[#F8F9FB] text-[#0F172A] antialiased font-sans overflow-x-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
      >
        {/* 🧠 Global UX Layer */}
        {/* Cookie banner ko apna suspense diya taaki yeh main page ko block na kare */}
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
        
        <ScrollToTop />

        {/* 🚀 Smooth Scroll Wrapper (GLOBAL) */}
        <SmoothScroll>
          
          {/* Navbar instantly load hoga (No blank screen) */}
          <Navbar />
          
          {/* 🟢 Suspense sirf main content ke liye */}
          <main className="relative z-10 min-h-screen will-change-transform">
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </main>
          
          {/* Footer instantly load hoga */}
          <Footer />

        </SmoothScroll>
      </body>
    </html>
  );
}