// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X, Cookie, ShieldCheck, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react';

const CONSENT_VERSION = "1.0";
const STORAGE_KEY = 'gif_cookie_consent';

const cookieCategories = [
  {
    id: 'necessary',
    title: 'Strictly necessary',
    required: true,
    desc: 'Strictly necessary cookies allow core website functionality such as user login, security, and consent management. The website cannot be used properly without these cookies.',
    cookies: [
      { name: 'gif_cookie_consent', provider: 'getintofeed.com', expiration: '1 year', desc: 'Stores the user\'s cookie consent preferences.' },
      { name: 'gif_session', provider: 'getintofeed.com', expiration: 'Session', desc: 'Used to maintain user session state across page requests.' }
    ]
  },
  {
    id: 'performance',
    title: 'Performance',
    required: false,
    desc: 'Performance cookies (like Google Analytics) help us understand how visitors interact with the site, allowing us to improve speed and content quality.',
    cookies: [
      { name: '_ga', provider: 'Google Analytics', expiration: '2 years', desc: 'Used to distinguish users for analytics purposes.' },
      { name: '_gid', provider: 'Google Analytics', expiration: '24 hours', desc: 'Used to distinguish users for daily analytics tracking.' }
    ]
  },
  {
    id: 'targeting',
    title: 'Targeting',
    required: false,
    desc: 'Targeting cookies (like Meta Pixel) are used to track visitors across websites to display relevant ads and measure marketing campaign performance.',
    cookies: [
      { name: '_fbp', provider: 'Meta (Facebook)', expiration: '3 months', desc: 'Used by Meta to deliver advertisement products.' },
      { name: '_gcl_au', provider: 'Google AdSense', expiration: '3 months', desc: 'Used for experimenting with advertisement efficiency.' }
    ]
  },
  {
    id: 'functionality',
    title: 'Functionality',
    required: false,
    desc: 'Functionality cookies remember your choices (like dark mode or language) to provide a more personalized experience.',
    cookies: [
      { name: 'gif_theme_pref', provider: 'getintofeed.com', expiration: '1 year', desc: 'Remembers the user\'s selected theme.' }
    ]
  }
];

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState('banner');
  const [activeTab, setActiveTab] = useState('declaration');
  const [expandedDetails, setExpandedDetails] = useState({});
  const [preferences, setPreferences] = useState({
    performance: false,
    targeting: false,
    functionality: false,
  });

  // 1. Real Cookie Control Logic (GDPR Compliant)
  const applyConsent = useCallback((prefs) => {
    if (typeof window === "undefined") return;

    // Google Analytics (Gtag) Control
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': prefs.performance ? 'granted' : 'denied',
        'ad_storage': prefs.targeting ? 'granted' : 'denied'
      });
    }

    // Meta Pixel (Fbq) Control
    if (window.fbq) {
      if (prefs.targeting) window.fbq('consent', 'grant');
      else window.fbq('consent', 'revoke');
    }
  }, []);

  // 2. Initialize and Load Preferences
  useEffect(() => {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        if (parsed.version === CONSENT_VERSION) {
          applyConsent(parsed.preferences);
          return;
        }
      } catch (e) { console.error("Consent Error", e); }
    }
    
    // Show banner with delay if no consent found
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [applyConsent]);

  // 3. Scroll Lock Management
  useEffect(() => {
    if (isVisible && view === 'settings') {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => e.key === 'Escape' && setView('banner');
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isVisible, view]);

  const handleSaveConsent = (type) => {
    let finalPrefs = { performance: false, targeting: false, functionality: false };
    
    if (type === 'accept_all') {
      finalPrefs = { performance: true, targeting: true, functionality: true };
    } else if (type === 'save_custom') {
      finalPrefs = { ...preferences };
    }

    const consentData = {
      preferences: finalPrefs,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
      essential: true
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
    applyConsent(finalPrefs);
    setIsVisible(false);
  };

  const toggleDetails = (id) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay for Settings View */}
          {view === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-navy/60 backdrop-blur-md"
              onClick={() => setView('banner')}
            />
          )}

          <motion.div
            role="dialog"
            aria-modal={view === 'settings'}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`fixed inset-x-4 bottom-4 md:inset-x-auto md:bottom-8 md:right-8 z-[9999] flex justify-center md:justify-end ${view === 'settings' ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            
            {/* VIEW 1: COMPACT BANNER */}
            {view === 'banner' && (
              <div className="pointer-events-auto w-full max-w-[850px] bg-navy/95 backdrop-blur-2xl border border-white/10 shadow-glass rounded-3xl p-4 md:p-3 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-teal-gradient opacity-[0.03] pointer-events-none" />

                <div className="flex items-center gap-4 flex-1 md:pl-3 relative z-10">
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary/10 border border-primary/20 items-center justify-center shrink-0">
                     <Cookie className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-white/80 text-[13px] font-sans leading-relaxed">
                    We use cookies to optimize lead generation systems and track performance. By clicking "Accept All", you agree to our data processing.
                  </p>
                </div>

                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto shrink-0 relative z-10">
                  <button onClick={() => setView('settings')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 font-bold text-xs transition-all">
                    <Settings2 className="w-4 h-4" /> Settings
                  </button>
                  <button onClick={() => handleSaveConsent('reject_all')} className="flex-1 md:flex-none px-5 py-2.5 rounded-full border border-white/10 text-white font-bold text-xs hover:border-white/30 transition-all">
                    Reject
                  </button>
                  <button onClick={() => handleSaveConsent('accept_all')} className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-primary text-navy font-bold text-xs hover:bg-[#4df287] transition-all shadow-glow whitespace-nowrap">
                    Accept All
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: PREFERENCE CENTER */}
            {view === 'settings' && (
              <motion.div 
                layoutId="cookieModal"
                className="pointer-events-auto w-full max-w-[700px] bg-white border border-border shadow-soft rounded-[2.5rem] flex flex-col relative overflow-hidden font-sans"
                style={{ maxHeight: '85vh' }}
              >
                <div className="p-6 md:p-8 pb-4 border-b border-border flex justify-between items-center bg-background/50 backdrop-blur-xl">
                  <div>
                    <h3 className="text-2xl font-heading font-extrabold text-navy flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-primary" /> Privacy Preference Center
                    </h3>
                  </div>
                  <button onClick={() => setView('banner')} className="p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-full transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-background" data-lenis-prevent="true">
                  <div className="flex gap-6 mb-8 border-b border-border">
                    {['declaration', 'about'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`pb-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? 'text-navy' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab === 'declaration' ? 'Cookie Declaration' : 'About Cookies'}
                        {activeTab === tab && <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'declaration' ? (
                    <div className="space-y-4">
                      {cookieCategories.map((category) => (
                        <div key={category.id} className="premium-card p-5 md:p-6 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-navy font-bold text-lg mb-1">{category.title}</h4>
                              <p className="text-slate-500 text-xs leading-relaxed max-w-md">{category.desc}</p>
                            </div>
                            {category.required ? (
                              <span className="text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Essential</span>
                            ) : (
                              <ToggleSwitch 
                                isOn={preferences[category.id]} 
                                onToggle={() => setPreferences(p => ({ ...p, [category.id]: !p[category.id] }))} 
                              />
                            )}
                          </div>
                          
                          <button onClick={() => toggleDetails(category.id)} className="flex items-center gap-1.5 text-[11px] font-extrabold text-navy/60 hover:text-primary transition-colors">
                            {expandedDetails[category.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            {expandedDetails[category.id] ? 'Hide Cookies' : `Show Details (${category.cookies.length})`}
                          </button>

                          <AnimatePresence>
                            {expandedDetails[category.id] && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-border overflow-x-auto">
                                <table className="w-full text-left text-[11px]">
                                  <thead>
                                    <tr className="text-slate-400 uppercase tracking-tighter">
                                      <th className="pb-2 pr-4">Cookie</th>
                                      <th className="pb-2 pr-4">Source</th>
                                      <th className="pb-2">Expiry</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-navy/80 font-medium">
                                    {category.cookies.map((cookie, idx) => (
                                      <tr key={idx} className="border-b border-slate-50 last:border-0">
                                        <td className="py-2 pr-4 font-bold text-primary">{cookie.name}</td>
                                        <td className="py-2 pr-4">{cookie.provider}</td>
                                        <td className="py-2">{cookie.expiration}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                      <div className="p-6 bg-primary/5 rounded-[2rem] flex gap-4 items-start">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <p>We use state-of-the-art tracking to ensure your marketing funnels perform at 100%. Blocking performance cookies may result in a less personalized experience and slower site performance.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8 bg-slate-50 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
                  <button onClick={() => handleSaveConsent('save_custom')} className="px-8 py-3 rounded-2xl border border-border text-navy font-bold text-sm hover:bg-white transition-all">
                    Save My Choices
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => handleSaveConsent('reject_all')} className="flex-1 px-8 py-3 rounded-2xl bg-white border border-border text-navy font-bold text-sm hover:bg-slate-100 transition-all">
                      Reject All
                    </button>
                    <button onClick={() => handleSaveConsent('accept_all')} className="flex-1 px-8 py-3 rounded-2xl bg-navy text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">
                      Accept All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const ToggleSwitch = ({ isOn, onToggle }) => (
  <div onClick={onToggle} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-500 ${isOn ? 'bg-primary shadow-[0_0_10px_rgba(46,209,178,0.3)]' : 'bg-slate-200'}`}>
    <motion.div layout className="bg-white w-4 h-4 rounded-full shadow-sm" animate={{ x: isOn ? 24 : 0 }} />
  </div>
);