import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Layers,
  Zap,
  Check
} from 'lucide-react';

/**
 * Basic safe sanitizer to allow standard CMS rich text tags while stripping script execution
 */
function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
      'ul', 'ol', 'li', 'blockquote', 'hr', 'br', 'pre', 'code',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'a', 'img', 'figure', 'figcaption', 'span', 'div', 'section', 'article',
      'details', 'summary', 'mark'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'target', 'rel', 'class', 'id',
      'src', 'alt', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes',
      'data-type', 'data-callout', 'data-media-id', 'data-language', 'colspan', 'rowspan', 'open'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|\/[a-z0-9_#?&.\/-]*|[#?])/i,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'svg', 'math', 'base', 'template'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'srcdoc', 'formaction', 'action']
  });
}

/**
 * FAQ Accordion Block Item
 */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50/70 transition-colors cursor-pointer"
      >
        <span className="text-base sm:text-lg pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(answer) }} />
        </div>
      )}
    </div>
  );
}

/**
 * Individual Block Renderer
 */
function BlockItem({ block, onNavigate, onOpenModal }) {
  const type = block.type || '';
  const data = block.data || {};

  switch (type) {
    case 'hero':
      return (
        <section className="bg-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 rounded-3xl my-8 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {data.kicker && (
              <span className="inline-block px-3.5 py-1 mb-4 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                {data.kicker}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              {data.title || data.heading}
            </h1>
            {data.subtitle && (
              <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                {data.subtitle}
              </p>
            )}
            {data.cta_label && (
              <button
                type="button"
                onClick={() => {
                  if (data.cta_url && data.cta_url.startsWith('http')) {
                    window.open(data.cta_url, '_blank');
                  } else if (data.cta_url && onNavigate) {
                    onNavigate(data.cta_url);
                  } else if (onOpenModal) {
                    onOpenModal(data.title);
                  }
                }}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-blue-600/30"
              >
                <span>{data.cta_label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      );

    case 'rich_text':
    case 'text':
      return (
        <div className="my-8 max-w-4xl mx-auto">
          <div
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.content || data.body || '') }}
          />
        </div>
      );

    case 'deliverables':
      const items = Array.isArray(data.items) ? data.items : [];
      return (
        <div className="my-8 p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl max-w-4xl mx-auto">
          {data.heading && (
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
              {data.heading}
            </h3>
          )}
          {data.description && (
            <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
              {data.description}
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item, idx) => {
              const label = typeof item === 'string' ? item : item.title || item.text || item.label;
              const desc = typeof item === 'object' ? item.description || item.desc : null;
              return (
                <div key={idx} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 text-sm block">{label}</span>
                    {desc && <span className="text-slate-500 text-xs mt-0.5 block leading-relaxed">{desc}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'process_steps':
      const steps = Array.isArray(data.steps) ? data.steps : [];
      return (
        <div className="my-10 max-w-4xl mx-auto">
          {data.heading && (
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                EXECUTION FRAMEWORK
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {data.heading}
              </h3>
            </div>
          )}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {steps.map((st, idx) => (
              <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-blue-300 transition">
                <span className="text-3xl font-black text-blue-600 block mb-2 font-mono">
                  {st.step_number || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1)}
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">{st.title || st.step_title}</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{st.description || st.text}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'problem_solution':
      return (
        <div className="my-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-rose-50/70 border border-rose-200 rounded-2xl">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>THE COMMON BOTTLENECK</span>
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 mb-3">{data.problem_heading || 'The Challenge'}</h4>
            <div className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.problem_content || '') }} />
          </div>

          <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>OUR STRATEGIC FIX</span>
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 mb-3">{data.solution_heading || 'The Solution'}</h4>
            <div className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.solution_content || '') }} />
          </div>
        </div>
      );

    case 'metrics':
      const stats = Array.isArray(data.items || data.metrics) ? (data.items || data.metrics) : [];
      return (
        <div className="my-8 p-6 sm:p-8 bg-slate-900 text-white rounded-3xl max-w-4xl mx-auto">
          {data.heading && <h3 className="text-xl font-bold text-center mb-6 text-slate-100">{data.heading}</h3>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-3">
                <span className="text-2xl sm:text-4xl font-black text-[#d4ff00] block mb-1 font-mono">
                  {s.value || s.number || s.metric}
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-300 block">{s.label || s.title}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'faq_accordion':
    case 'faqs':
      const faqsList = Array.isArray(data.items || data.faqs) ? (data.items || data.faqs) : [];
      return (
        <div className="my-10 max-w-4xl mx-auto space-y-3">
          {data.heading && (
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              {data.heading}
            </h3>
          )}
          {faqsList.map((faq, idx) => (
            <FaqItem
              key={idx}
              question={faq.question || faq.q || ''}
              answer={faq.answer || faq.a || ''}
            />
          ))}
        </div>
      );

    case 'cta_banner':
    case 'cta':
      return (
        <div className="my-12 p-8 sm:p-12 bg-linear-to-r from-blue-900 to-indigo-950 text-white rounded-3xl text-center max-w-4xl mx-auto shadow-xl relative overflow-hidden">
          <h3 className="text-2xl sm:text-4xl font-black mb-3">{data.heading || 'Ready to Scale Your Inbound Pipeline?'}</h3>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
            {data.description || 'Consult with our senior strategist to plan an actionable growth sprint.'}
          </p>
          <button
            type="button"
            onClick={() => onOpenModal ? onOpenModal('General Inquiry') : onNavigate?.('/contact')}
            className="px-8 py-3.5 bg-[#d4ff00] hover:bg-[#bbf000] text-slate-950 font-bold text-sm uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <span>{data.button_label || 'Book Discovery Call'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );

    case 'custom_html':
      return (
        <div className="my-8 max-w-4xl mx-auto overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.html || '') }} />
        </div>
      );

    default:
      if (data.content || data.body || data.text) {
        return (
          <div className="my-6 max-w-4xl mx-auto prose prose-slate">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.content || data.body || data.text) }} />
          </div>
        );
      }
      return null;
  }
}

/**
 * Universal Dynamic Content Renderer Component
 * Renders Classic HTML or Gutenberg-style Block JSON seamlessly
 */
export default function DynamicContentRenderer({
  editorMode = 'classic',
  content = '',
  contentBlocks = [],
  className = '',
  onNavigate,
  onOpenModal,
}) {
  // 1. If Block mode with blocks array
  if (editorMode === 'block' && Array.isArray(contentBlocks) && contentBlocks.length > 0) {
    return (
      <div className={`dynamic-block-stream ${className}`}>
        {contentBlocks.map((block, idx) => (
          <BlockItem
            key={idx}
            block={block}
            onNavigate={onNavigate}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>
    );
  }

  // 2. Classic Editor Mode or fallback to HTML content
  if (content && typeof content === 'string' && content.trim().length > 0) {
    return (
      <div
        className={`classic-content-pro prose prose-slate max-w-none text-slate-700 leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    );
  }

  return null;
}
