import './globals.css'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import CookieBanner from '../components/CookieBanner';
import ScrollToTop from '../components/ScrollToTop';

export const metadata = {
  title: {
    default: 'Get Into Feed',
    template: '%s | Get Into Feed'
  },
  description: 'Premium Growth Engine for global brands',
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      dir="ltr"
      className="dark"
      suppressHydrationWarning
    >
      {/* 👇 🟢 YAHAN DHYAN DIJIYE: suppressHydrationWarning add kiya hai 👇 */}
      <body 
        suppressHydrationWarning 
        className="bg-[#020408] text-slate-300 antialiased font-sans overflow-x-hidden"
      >

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

      </body>
    </html>
  );
} 