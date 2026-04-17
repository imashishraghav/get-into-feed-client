"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X, Cookie, ShieldCheck, ChevronDown, ChevronUp, Info } from 'lucide-react';

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
    desc: 'Performance cookies are used to see how visitors use the website, eg. analytics cookies. Those cookies cannot be used to directly identify a certain visitor.',
    cookies: [
      { name: '_ga', provider: 'Google Analytics', expiration: '2 years', desc: 'Used to distinguish users for analytics purposes.' },
      { name: '_gid', provider: 'Google Analytics', expiration: '24 hours', desc: 'Used to distinguish users for daily analytics tracking.' }
    ]
  },
  {
    id: 'targeting',
    title: 'Targeting',
    required: false,
    desc: 'Targeting cookies are used to identify visitors between different websites, eg. content partners, banner networks. Those cookies may be used by companies to build a profile of visitor interests or show relevant ads on other websites.',
    cookies: [
      { name: '_fbp', provider: 'Meta (Facebook)', expiration: '3 months', desc: 'Used by Meta to deliver a series of advertisement products such as real time bidding from third party advertisers.' },
      { name: '_gcl_au', provider: 'Google AdSense', expiration: '3 months', desc: 'Used by Google AdSense for experimenting with advertisement efficiency.' }
    ]
  },
  {
    id: 'functionality',
    title: 'Functionality',
    required: false,
    desc: 'Functionality cookies are used to remember visitor information on the website, eg. language, timezone, enhanced content.',
    cookies: [
      { name: 'gif_theme_pref', provider: 'getintofeed.com', expiration: '1 year', desc: 'Remembers the user\'s selected theme (dark/light mode).' }
    ]
  }
];

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('banner');
  const [activeTab, setActiveTab] = useState('declaration');
  const [expandedDetails, setExpandedDetails] = useState({});
  
  const [preferences, setPreferences] = useState({
    performance: false,
    targeting: false,
    functionality: false,
  });

  useEffect(() => {
    setMounted(true);
    const savedConsent = localStorage.getItem('gif_cookie_consent');
    if (!savedConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Standard CSS lock fallback
  useEffect(() => {
    if (isVisible && view === 'settings') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible, view]);

  const handleConsent = (type) => {
    let finalPreferences = { strictlyNecessary: true };
    if (type === 'accept_all') {
      finalPreferences = { strictlyNecessary: true, performance: true, targeting: true, functionality: true };
    } else if (type === 'reject_all') {
      finalPreferences = { strictlyNecessary: true, performance: false, targeting: false, functionality: false };
    } else if (type === 'save_custom') {
      finalPreferences = { strictlyNecessary: true, ...preferences };
    }
    localStorage.setItem('gif_cookie_consent', JSON.stringify(finalPreferences));
    setIsVisible(false);
  };

  const handleTogglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDetails = (id) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {view === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setView('banner')}
              // 🟢 Stop scroll on background overlay
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            />
          )}

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`fixed inset-x-4 bottom-4 md:inset-x-auto md:bottom-8 md:right-8 z-[9999] flex justify-center md:justify-end ${view === 'settings' ? 'pointer-events-auto' : 'pointer-events-none'}`}
            // 🟢 Stop scroll on the modal container wrapper
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            
            {/* VIEW 1: COMPACT BANNER */}
            {view === 'banner' && (
              <div className="pointer-events-auto w-full max-w-[850px] bg-[#0a0f18]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-full p-4 md:p-3 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[100px] h-full bg-[#3AE272]/10 blur-xl pointer-events-none"></div>

                <div className="flex items-center gap-4 flex-1 md:pl-3 relative z-10">
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-[#3AE272]/10 border border-[#3AE272]/20 items-center justify-center shrink-0">
                     <Cookie className="w-5 h-5 text-[#3AE272]" />
                  </div>
                  <div>
                    <p className="text-zinc-300 text-[13px] leading-relaxed">
                      This website uses cookies to improve user experience. By clicking "Accept All", you consent to our use of cookies.
                    </p>
                    <div className="flex gap-4 mt-1">
                      <button onClick={() => setView('settings')} className="text-[11px] text-[#3AE272] hover:text-white underline underline-offset-2 transition-colors">Read more</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto shrink-0 relative z-10">
                  <button onClick={() => setView('settings')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 font-bold text-xs transition-colors">
                    <Settings2 className="w-4 h-4" /> Settings
                  </button>
                  <button onClick={() => handleConsent('reject_all')} className="flex-1 md:flex-none px-5 py-2.5 rounded-full border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 font-bold text-xs transition-colors whitespace-nowrap">
                    Reject All
                  </button>
                  <button onClick={() => handleConsent('accept_all')} className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-[#3AE272] text-[#022c22] font-extrabold text-xs hover:bg-[#4df287] transition-all duration-300 shadow-[0_0_15px_rgba(58,226,114,0.2)] whitespace-nowrap">
                    Accept All
                  </button>
                  
                  <div className="hidden md:block w-[1px] h-6 bg-white/10 mx-1"></div>
                  <button onClick={() => setIsVisible(false)} className="hidden md:flex p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer" title="Dismiss">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <button onClick={() => setIsVisible(false)} className="absolute top-3 right-3 md:hidden p-1.5 bg-white/5 text-zinc-400 hover:text-white rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* VIEW 2: DETAILED PREFERENCE CENTER */}
            {view === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pointer-events-auto w-full max-w-[700px] bg-[#0a0f18]/95 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-2xl flex flex-col relative overflow-hidden"
                style={{ maxHeight: '85vh' }}
              >
                {/* Header & Tabs */}
                <div className="bg-white/[0.02] border-b border-white/10 shrink-0">
                  <div className="p-5 md:p-6 pb-0 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#3AE272]" /> Privacy Center
                      </h3>
                      <button onClick={() => setView('banner')} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex gap-6">
                      <button onClick={() => setActiveTab('declaration')} className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'declaration' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        Cookie declaration
                        {activeTab === 'declaration' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3AE272]"></span>}
                      </button>
                      <button onClick={() => setActiveTab('about')} className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'about' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        About cookies
                        {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3AE272]"></span>}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 🟢 THE FIX IS HERE: data-lenis-prevent & onWheel stopPropagation */}
                <div 
                  className="p-5 md:p-6 overflow-y-auto bg-[#05080f]/50 flex-1 overscroll-none"
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  
                  {/* TAB 1: DECLARATION */}
                  {activeTab === 'declaration' && (
                    <div className="space-y-6 pb-4">
                      {cookieCategories.map((category) => (
                        <div key={category.id} className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
                          <div className="p-4 md:p-5">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-white font-bold text-base">{category.title}</h4>
                              {category.required ? (
                                <span className="text-[#3AE272] text-[10px] font-bold uppercase tracking-wider bg-[#3AE272]/10 px-3 py-1 rounded-full">Strictly Necessary</span>
                              ) : (
                                <ToggleSwitch isOn={preferences[category.id]} onToggle={() => handleTogglePreference(category.id)} />
                              )}
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                              {category.desc}
                            </p>
                            <button 
                              onClick={() => toggleDetails(category.id)}
                              className="flex items-center gap-1 text-xs font-bold text-zinc-300 hover:text-[#3AE272] transition-colors cursor-pointer"
                            >
                              {expandedDetails[category.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              {expandedDetails[category.id] ? 'Hide cookies' : 'Show cookies'}
                            </button>
                          </div>

                          <AnimatePresence>
                            {expandedDetails[category.id] && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/5 bg-black/40 overflow-x-auto"
                              >
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                  <thead>
                                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500">
                                      <th className="py-3 px-4 font-semibold">Name</th>
                                      <th className="py-3 px-4 font-semibold">Provider / Domain</th>
                                      <th className="py-3 px-4 font-semibold">Expiration</th>
                                      <th className="py-3 px-4 font-semibold">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {category.cookies.map((cookie, idx) => (
                                      <tr key={idx} className="border-b border-white/5 last:border-0 text-xs text-zinc-300">
                                        <td className="py-3 px-4 font-medium text-white">{cookie.name}</td>
                                        <td className="py-3 px-4">{cookie.provider}</td>
                                        <td className="py-3 px-4 text-zinc-400">{cookie.expiration}</td>
                                        <td className="py-3 px-4 leading-relaxed">{cookie.desc}</td>
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
                  )}

                  {/* TAB 2: ABOUT COOKIES */}
                  {activeTab === 'about' && (
                    <div className="space-y-6 text-zinc-300 text-sm leading-relaxed pb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                        <Info className="w-6 h-6 text-blue-400" />
                      </div>
                      <p>Cookies are small text files that are placed on your computer by websites that you visit. Websites use cookies to help users navigate efficiently and perform certain functions.</p>
                      <p>Cookies that are required for the website to operate properly are allowed to be set without your permission. All other cookies need to be approved before they can be set in the browser.</p>
                      <p>You can change your consent to cookie usage at any time on our Privacy Policy page. We also use cookies to collect data for the purpose of personalizing and measuring the effectiveness of our advertising. For more details, visit our complete Privacy Policy and Terms of Service.</p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-5 md:p-6 border-t border-white/10 bg-[#0a0f18] flex flex-col sm:flex-row justify-between gap-3 shrink-0">
                  <button onClick={() => handleConsent('save_custom')} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold text-xs hover:bg-white/5 transition-colors w-full sm:w-auto cursor-pointer">
                    Save My Preferences
                  </button>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => handleConsent('reject_all')} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white font-bold text-xs hover:bg-white/5 transition-colors cursor-pointer">
                      Reject All
                    </button>
                    <button onClick={() => handleConsent('accept_all')} className="flex-1 px-6 py-3 rounded-xl bg-[#3AE272] text-[#022c22] font-extrabold text-xs hover:bg-[#4df287] transition-all shadow-[0_0_15px_rgba(58,226,114,0.2)] cursor-pointer">
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

const ToggleSwitch = ({ isOn, onToggle }) => {
  return (
    <div 
      onClick={onToggle}
      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-[#3AE272]' : 'bg-white/10 border border-white/20'}`}
    >
      <motion.div 
        layout
        className="bg-white w-4 h-4 rounded-full shadow-md"
        animate={{ x: isOn ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  );
};