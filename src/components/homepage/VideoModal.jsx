// @ts-nocheck
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { premiumEase } from '@/utils/animations';

// YAHAN CHECK KAREIN: "export default" hona chahiye
export default function VideoModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 gpu-accelerated"
        >
          <div className="absolute inset-0 bg-navy/90 backdrop-blur-xl cursor-pointer" onClick={onClose} />
          <motion.div 
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: premiumEase }}
            className="relative w-full max-w-5xl aspect-video bg-navy rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(15,23,42,0.4)] border border-slate-800 z-10"
          >
            <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-20 group">
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-tr from-navy to-[#111827]">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <Play className="w-10 h-10 text-navy fill-navy ml-2" />
              </motion.div>
              <p className="font-heading font-bold text-2xl tracking-widest uppercase text-slate-300 drop-shadow-sm">Manifesto Video Playing</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}