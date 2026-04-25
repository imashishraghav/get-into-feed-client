import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source) { return builder.image(source); }

// 🟢 Helper function to create IDs from heading text
const slugify = (text) => {
  const stringText = typeof text === 'string' ? text : String(text);
  return stringText
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const portableTextComponents = {
  types: {
    image: (props) => {
      const { value } = props;
      if (!value?.asset?._ref) return null;
      return (
        <div className="relative w-full aspect-video my-12 rounded-2xl overflow-hidden shadow-md border border-[#E5E7EB]">
          <Image src={urlFor(value).url()} alt={value.alt || 'Blog image'} fill className="object-cover" />
        </div>
      );
    },
  },
  block: {
    // 🟢 FIX: Used (props) everywhere instead of ({ children }) to bypass TS strictness
    h2: (props) => {
      const { children } = props;
      const id = slugify(Array.isArray(children) ? children[0] : children || "heading");
      return (
        <h2 id={id} className="scroll-mt-32 text-3xl font-extrabold text-[#0F172A] mt-16 mb-6 tracking-tight leading-snug">
          {children}
        </h2>
      );
    },
    h3: (props) => {
      const { children } = props;
      const id = slugify(Array.isArray(children) ? children[0] : children || "heading");
      return (
        <h3 id={id} className="scroll-mt-32 text-2xl font-bold text-[#0F172A] mt-10 mb-4 tracking-tight">
          {children}
        </h3>
      );
    },
    normal: (props) => <p className="text-lg text-[#475569] leading-loose mb-6">{props.children}</p>,
    blockquote: (props) => (
      <blockquote className="border-l-4 border-[#2ED1B2] bg-white pl-6 py-4 my-8 rounded-r-xl shadow-sm text-xl italic font-medium text-[#0F172A]">
        {props.children}
      </blockquote>
    ),
  },
  list: {
    bullet: (props) => <ul className="list-none space-y-3 my-6 ml-4">{props.children}</ul>,
    number: (props) => <ol className="list-decimal text-lg text-[#475569] space-y-3 my-6 ml-6">{props.children}</ol>,
  },
  listItem: {
    bullet: (props) => (
      <li className="flex items-start text-lg text-[#475569] leading-relaxed">
        <span className="text-[#2ED1B2] mr-3 font-bold">•</span>
        <span>{props.children}</span>
      </li>
    ),
  },
  marks: {
    link: (props) => {
      const { children, value } = props;
      const href = value?.href || '#';
      const rel = !href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <Link href={href} rel={rel} className="text-[#2ED1B2] font-semibold underline decoration-[#2ED1B2]/30 underline-offset-4 hover:decoration-[#2ED1B2] transition-colors">
          {children}
        </Link>
      );
    },
    strong: (props) => <strong className="font-bold text-[#0F172A]">{props.children}</strong>,
  },
};