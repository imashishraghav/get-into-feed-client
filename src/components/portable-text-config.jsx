import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';

// 🟢 Helper to create clean IDs for the Table of Contents
const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

// 🟢 Helper to safely extract raw string text from Sanity block
const getBlockText = (value) => {
  return value?.children?.map((child) => child.text).join('') || '';
};

export const portableTextComponents = {
  types: {
    image: (props) => {
      const { value } = props;
      if (!value?.asset?._ref) return null;
      return (
        <div className="relative w-full aspect-[21/9] my-12 rounded-2xl overflow-hidden shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Blog Image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      );
    },
  },
  block: {
    // 🟢 Fix: Used 'props' to satisfy TypeScript strictness
    h2: (props) => (
      <h2 id={slugify(getBlockText(props.value))} className="text-3xl font-bold text-white mt-16 mb-6 scroll-mt-32">
        {props.children}
      </h2>
    ),
    h3: (props) => (
      <h3 id={slugify(getBlockText(props.value))} className="text-2xl font-semibold text-white mt-10 mb-4 scroll-mt-32">
        {props.children}
      </h3>
    ),
    normal: (props) => (
      <p className="text-[#94A3B8] text-lg leading-relaxed mb-6">{props.children}</p>
    ),
    blockquote: (props) => (
      <blockquote className="border-l-4 border-[#2ED1B2] pl-6 py-4 my-10 italic text-xl text-white bg-white/5 shadow-sm rounded-r-xl">
        {props.children}
      </blockquote>
    ),
  },
  list: {
    // 🟢 Fix: Used 'props' here as well
    bullet: (props) => (
      <ul className="list-disc list-outside ml-6 mb-8 text-[#94A3B8] space-y-3 text-lg marker:text-[#2ED1B2]">
        {props.children}
      </ul>
    ),
    number: (props) => (
      <ol className="list-decimal list-outside ml-6 mb-8 text-[#94A3B8] space-y-3 text-lg marker:text-[#2ED1B2]">
        {props.children}
      </ol>
    ),
  },
  marks: {
    link: (props) => {
      const { children, value } = props;
      
      const href = value?.href || '#'; 
      
      const isExternal = !href.startsWith('/');
      const rel = isExternal ? 'noreferrer noopener' : undefined;
      const target = isExternal ? '_blank' : undefined;

      return (
        <Link 
          href={href} 
          rel={rel} 
          target={target}
          className="text-[#2ED1B2] font-medium hover:text-white underline decoration-[#2ED1B2]/40 hover:decoration-[#2ED1B2] underline-offset-4 transition-all duration-300"
        >
          {children}
        </Link>
      );
    },
    strong: (props) => {
      return <strong className="font-bold text-white">{props.children}</strong>;
    },
  },
}; // 🟢 Yeh aakhiri bracket miss ho gaya tha pichli baar!