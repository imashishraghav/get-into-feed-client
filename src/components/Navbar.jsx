// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

// 🟢 1. Import usePathname from next/navigation
import { usePathname } from "next/navigation";

// Import your custom smooth scroll hook!
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// ----------------------------------------------------------------------
// Desktop & Mobile Link Data
// ----------------------------------------------------------------------
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Work", href: "/case-studies" }, // Ensure this matches your folder name
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Work With Us", href: "/careers" },
];

// ----------------------------------------------------------------------
// Advanced Framer Motion Variants
// ----------------------------------------------------------------------
const navbarVariants = {
  visible: { 
    y: 0, 
    transition: { ease: "easeOut", duration: 0.5 } 
  },
  hidden: { 
    y: "-100%", 
    transition: { ease: "easeOut", duration: 0.4 } 
  }
};

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.05, delayChildren: 0.1 }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🟢 2. Get the current route path
  const pathname = usePathname();

  // 1. Get the perfectly synced scroll data from Lenis + Framer Motion
  const { scrollY } = useSmoothScroll();

  // 2. Advanced Scroll Logic: Auto-Hide on Scroll Down, Show on Scroll Up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    // Prevent navbar from hiding if the mobile menu is open
    if (isMobileMenuOpen) return;

    // Check if we passed the 20px threshold to apply the glassmorphism blur
    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Smart Hide Logic: If scrolling down and passed 150px, hide it. If scrolling up, show it.
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  // 3. Lock Body Scroll when Mobile Menu is Open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  // 🟢 3. The Fix: Hide Navbar completely on Sanity Studio route
  // Change "/studio" to "/sanity" if your Sanity path is different
  if (pathname && (pathname.startsWith("/studio") || pathname.startsWith("/sanity"))) {
    return null;
  }

  return (
    <>
      <motion.header
        variants={navbarVariants}
        initial="visible"
        animate={isHidden ? "hidden" : "visible"}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ease-out gpu-accelerated ${
          isScrolled 
            ? "bg-white/85 backdrop-blur-lg border-b border-border shadow-sm py-3" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* ================= LEFT: LOGO ================= */}
          <Link href="/" className="flex items-center group z-50 relative">
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl flex-shrink-0 border border-white/60 bg-white/40 backdrop-blur-md shadow-sm overflow-hidden"
            >
              <Image 
                src="/gif.webp" 
                alt="Get Into Feed Logo" 
                fill 
                className="object-contain p-2 md:p-2.5 drop-shadow-sm"
                sizes="(max-width: 768px) 64px, 72px"
                priority
              />
            </motion.div>
          </Link>

          {/* ================= CENTER: DESKTOP LINKS ================= */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="font-sans text-sm font-bold text-slate-500 hover:text-navy transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-300 ease-out group-hover:w-full rounded-full opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          {/* ================= RIGHT: DESKTOP CTA ================= */}
          <div className="hidden md:flex items-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative group bg-primary text-navy px-7 py-2.5 rounded-full font-heading font-bold text-sm tracking-wide hover:bg-primary/90 transition-all duration-300 shadow-[0_0_0_rgba(46,209,178,0)] hover:shadow-[0_8px_25px_-5px_rgba(46,209,178,0.5)] flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
                <span className="relative z-10">Let's Talk</span>
              </motion.button>
            </Link>
          </div>

          {/* ================= MOBILE HAMBURGER TOGGLE ================= */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden relative z-50 p-2 -mr-2 text-navy focus:outline-none"
            aria-label="Toggle Menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>

        </div>
      </motion.header>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden pt-28 px-6 pb-6 flex flex-col gpu-accelerated"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={linkVariants}>
                  <Link 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-heading text-2xl font-bold text-navy flex items-center justify-between border-b border-border pb-4 group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile CTA */}
            <motion.div variants={linkVariants} className="mt-auto pb-8">
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-navy py-4 rounded-xl font-heading font-bold text-lg flex items-center justify-center gap-2 transition-transform shadow-lg shadow-primary/20"
                >
                  Let's Talk
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <p className="text-center font-sans text-xs font-bold text-slate-400 mt-5 uppercase tracking-widest">
                Dominate the Feed. Own the Market.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}