import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.resolve(__dirname, 'index.html'),
    path.resolve(__dirname, 'src/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {
      colors: {
        'crm-canvas': '#F8F9FB',
        'crm-card': '#FFFFFF',
        'crm-border': '#E2E8F0',
        'crm-text': '#0F172A',
        'crm-muted': '#64748B',
        'crm-whatsapp': '#25d366',
        'crm-accent': '#0F172A',
        'crm-dark': '#09090B',
        'crm-surface': '#0F172A',
        'crm-lime': '#D4FF00',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        dossier: '-4px 0 32px rgba(15, 23, 42, 0.08)',
        modal: '0 20px 40px -15px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
