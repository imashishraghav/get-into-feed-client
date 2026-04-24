import { Suspense } from 'react'; 
// 🟢 1. Advanced Font Optimization (Using your premium typography)
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'; 
import './globals.css'; 

// Component Imports (Ensure the paths are correct based on your setup)
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import CookieBanner from '@/components/CookieBanner';
import ScrollToTop from '@/components/ScrollToTop';

// ----------------------------------------------------------------------
// 🟢 2. Font Initialization
// ----------------------------------------------------------------------
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
});

// ----------------------------------------------------------------------
// 🟢 3. Enterprise-Grade SEO & OpenGraph Metadata
// ----------------------------------------------------------------------
export const metadata = {
  metadataBase: new URL('https://www.getintofeed.com'), // IMPORTANT: Change to your live domain
  title: {
    default: 'Get Into Feed | Dominate the Feed. Own the Market.',
    template: '%s | Get Into Feed'
  },
  description: 'We engineer scalable marketing systems that drive high-intent lead generation and exponential sales growth. Stop competing—start dominating.',
  keywords: ['Digital Marketing Agency', 'Lead Generation', 'Performance Marketing', 'B2B Growth', 'Scale Revenue'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.getintofeed.com',
    title: 'Get Into Feed | Dominate the Feed',
    description: 'Scalable marketing systems that drive high-intent lead generation.',
    siteName: 'Get Into Feed',
    images: [{
      url: '/og-image.jpg', // Add a 1200x630 image in your /public folder
      width: 1200,
      height: 630,
      alt: 'Get Into Feed - Digital Marketing Agency'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Into Feed | Dominate the Feed',
    description: 'Scalable marketing systems that drive high-intent lead generation.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ----------------------------------------------------------------------
// 🟢 4. Separate Viewport Configuration (Next.js 14+ Standard)
// ----------------------------------------------------------------------
export const viewport = {
  themeColor: '#0F172A', // Dark Navy/Black for a premium mobile browser bar
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// ----------------------------------------------------------------------
// 🟢 5. Premium Loader Fallback
// ----------------------------------------------------------------------
const PageLoader = () => (
  <div className="min-h-[80vh] w-full flex items-center justify-center bg-[#F8F9FB]">
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div className="absolute inset-0 border-4 border-[#E5E7EB] rounded-full" />
      {/* Black spinner for authoritative branding */}
      <div className="absolute inset-0 border-4 border-[#0F172A] rounded-full border-t-transparent animate-spin" />
    </div>
  </div>
);

// ----------------------------------------------------------------------
// 🟢 MAIN ROOT LAYOUT
// ----------------------------------------------------------------------
export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      dir="ltr"
      suppressHydrationWarning 
      className={`${plusJakarta.variable} ${inter.variable}`} 
    >
      <body 
        suppressHydrationWarning 
        // Force flex-col & min-h-screen so the footer always stays at the bottom
        className="bg-[#F8F9FB] text-[#0F172A] antialiased font-sans overflow-x-hidden selection:bg-[#0F172A]/10 selection:text-[#0F172A] flex flex-col min-h-screen"
      >
        {/* 🧠 Global UX Layer */}
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
        
        {/* ✅ FIXED: ScrollToTop is now inside Suspense */}
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>

        {/* ✅ FIXED: The entire SmoothScroll and its contents are wrapped in one Master Suspense */}
        <Suspense fallback={<PageLoader />}>
          <SmoothScroll>
            
            <Navbar />
            
            {/* flex-grow ensures the main content pushes the footer down if the page is short */}
            <main className="relative z-10 flex-grow will-change-transform">
              {children}
            </main>
            
            <Footer />

          </SmoothScroll>
        </Suspense>
      </body>
    </html>
  );
}