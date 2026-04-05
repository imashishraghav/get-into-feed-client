"use client";

import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-zinc-400 pt-24 pb-32 px-6 font-sans relative overflow-hidden">
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vh] bg-[#3AE272]/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left: Contact Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3AE272] animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">Let's Connect</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Ready to <span className="text-[#3AE272]">scale?</span>
            </h1>
            <p className="text-lg text-slate-400 mb-12 max-w-md">
              Drop us a message. Hamari team aapke brand ko analyze karke ek explosive growth strategy tayar karegi.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3AE272] shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Email Us</h4>
                  <p className="text-sm mt-1">hello@getintofeed.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3AE272] shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Call Us</h4>
                  <p className="text-sm mt-1">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3AE272] shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Headquarters</h4>
                  <p className="text-sm mt-1">Sarita Vihar, New Delhi<br/>India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-[#0b1015]/60 backdrop-blur-xl border border-white/[0.05] p-8 md:p-10 rounded-[2rem] shadow-2xl relative">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <MessageSquare className="text-[#3AE272]" /> Send a Message
            </h3>
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input type="text" className="bg-[#05080a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3AE272]/50 transition-colors" placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input type="email" className="bg-[#05080a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3AE272]/50 transition-colors" placeholder="john@company.com" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company / Brand Name</label>
                <input type="text" className="bg-[#05080a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3AE272]/50 transition-colors" placeholder="Your Brand" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">How can we help?</label>
                <textarea rows="4" className="bg-[#05080a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3AE272]/50 transition-colors resize-none" placeholder="Tell us about your goals..."></textarea>
              </div>
              <button className="w-full bg-[#3AE272] text-[#022c22] font-bold py-4 rounded-xl hover:bg-[#4df287] transition-all duration-300 shadow-[0_0_20px_rgba(58,226,114,0.15)] mt-2 flex items-center justify-center gap-2">
                Send Inquiry <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}