import React from "react";
import DOMPurify from "dompurify";

export function extractArticleHeadings(markdown = "") {
  if (!markdown || typeof markdown !== "string") return [];
  const lines = markdown.split("\n");
  const headings = [];
  let index = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      const cleanText = rawText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/[`*#]/g, "");
      const id = "section-" + index + "-" + cleanText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ id, text: cleanText, level, index });
      index++;
    }
  }
  return headings;
}

export function isSafeUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("data:")
  ) {
    return false;
  }
  return /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(trimmed);
}

export function renderInlineFormatting(text) {
  if (!text) return null;

  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-950">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-slate-700">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 bg-slate-100 rounded text-sm text-slate-900 font-mono font-semibold">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const rawHref = (linkMatch[2] || "").trim();
        const safeHref = isSafeUrl(rawHref) ? rawHref : "#";
        const isExternal = /^https?:\/\//i.test(safeHref);
        parts.push(
          <a
            key={match.index}
            href={safeHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-slate-950 font-semibold underline decoration-[#CCFF00] decoration-2 underline-offset-4 hover:bg-[#CCFF00]/25 transition rounded px-0.5"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function slugifyHeading(text, seenIds = new Set()) {
  let id = (text || "")
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[*_`#]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!id) id = "heading";
  let uniqueId = id;
  let counter = 1;
  while (seenIds.has(uniqueId)) {
    uniqueId = `${id}-${counter++}`;
  }
  seenIds.add(uniqueId);
  return uniqueId;
}

export function injectHeadingIds(html) {
  if (!html || typeof html !== "string") return html;
  const seenIds = new Set(["intro"]);
  return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (fullMatch, level, attrs, text) => {
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    if (idMatch) {
      seenIds.add(idMatch[1]);
      return fullMatch;
    }
    const cleanText = text.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    const id = slugifyHeading(cleanText, seenIds);
    return `<h${level}${attrs} id="${id}" class="scroll-mt-28">${text}</h${level}>`;
  });
}

export function getArticleToc(article) {
  if (!article || !article.content) return [];
  const content = String(article.content);
  const seenIds = new Set(["intro"]);
  const toc = [{ id: "intro", title: "Introduction" }];

  // Check if content is HTML (from backend rich text editor)
  if (/<[a-z][\s\S]*>/i.test(content)) {
    const headingRegex = /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi;
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1], 10);
      const attrs = match[2] || "";
      const rawHtml = match[3] || "";
      const cleanText = rawHtml.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
      if (!cleanText) continue;

      const idMatch = attrs.match(/id=["']([^"']+)["']/i);
      const id = idMatch ? idMatch[1] : slugifyHeading(cleanText, seenIds);

      if (level === 2) {
        toc.push({
          id,
          title: cleanText,
          level
        });
      }
    }
    return toc;
  }

  // Markdown format parsing
  const lines = content.split("\n");
  let foundFirstHeading = false;

  lines.forEach((line) => {
    const match = line.trim().match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim().replace(/[*_`]/g, "");

      if (level === 1 && (!foundFirstHeading || rawText.toLowerCase() === (article.title || "").toLowerCase().trim())) {
        foundFirstHeading = true;
        return;
      }
      foundFirstHeading = true;

      // Keep TOC clean by listing main Level 2 sections
      if (level !== 2) return;

      const id = slugifyHeading(rawText, seenIds);
      toc.push({
        id,
        title: rawText,
        level
      });
    }
  });

  return toc;
}

const ALLOWED_PUBLIC_IFRAME_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com',
]);

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node && node.tagName === 'IFRAME') {
    const src = (node.getAttribute('src') || '').trim();
    try {
      const parsed = new URL(src);
      if (parsed.protocol !== 'https:' || !ALLOWED_PUBLIC_IFRAME_HOSTS.has(parsed.hostname.toLowerCase())) {
        node.remove();
        return;
      }
      if (!node.getAttribute('loading')) node.setAttribute('loading', 'lazy');
      if (!node.getAttribute('referrerpolicy')) node.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    } catch {
      node.remove();
    }
  }
});

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
      'ul', 'ol', 'li', 'blockquote', 'hr', 'br', 'pre', 'code',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'a', 'img', 'figure', 'figcaption', 'span', 'div', 'section', 'article',
      'details', 'summary', 'mark', 'iframe'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'target', 'rel', 'class', 'id', 'aria-label', 'scope',
      'src', 'alt', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes',
      'data-type', 'data-callout', 'data-cta', 'data-faq', 'data-toc', 'data-video-embed',
      'data-media-id', 'data-language', 'colspan', 'rowspan', 'open',
      'allowfullscreen', 'referrerpolicy'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|\/[a-z0-9_#?&.\/-]*|[#?])/i,
    FORBID_TAGS: ['script', 'style', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'svg', 'math', 'base', 'template'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'srcdoc', 'formaction', 'action']
  });
}

export function renderArticleContent(markdown = "", articleTitle = "") {
  if (!markdown || typeof markdown !== "string") return null;

  if (/<[a-z][\s\S]*>/i.test(markdown)) {
    const withIds = injectHeadingIds(markdown);
    return (
      <div
        className="classic-content-pro prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(withIds) }}
      />
    );
  }

  const lines = markdown.split("\n");
  const blocks = [];
  let currentList = null;
  let currentQuote = null;
  const seenIds = new Set(["intro"]);
  let foundFirstHeading = false;

  const flushList = () => {
    if (currentList) {
      const listItems = currentList.items;
      const isNumbered = currentList.type === "ol";
      blocks.push(
        isNumbered ? (
          <ol key={`ol-${blocks.length}`} className="list-decimal pl-6 my-6 space-y-2.5 text-[1.05rem] text-slate-700 leading-relaxed marker:font-bold marker:text-slate-900">
            {listItems.map((item, idx) => (
              <li key={idx} className="pl-1">{renderInlineFormatting(item)}</li>
            ))}
          </ol>
        ) : (
          <ul key={`ul-${blocks.length}`} className="list-disc pl-6 my-6 space-y-2.5 text-[1.05rem] text-slate-700 leading-relaxed marker:text-slate-900">
            {listItems.map((item, idx) => (
              <li key={idx} className="pl-1">{renderInlineFormatting(item)}</li>
            ))}
          </ul>
        )
      );
      currentList = null;
    }
  };

  const flushQuote = () => {
    if (currentQuote && currentQuote.length > 0) {
      const fullText = currentQuote.join("\n");
      const isKeyTakeaways = /key takeaways/i.test(fullText);

      if (isKeyTakeaways) {
        const rawItems = currentQuote
          .filter(l => !/key takeaways/i.test(l))
          .map(l => l.replace(/^[-*•]\s+/, "").trim())
          .filter(Boolean);

        blocks.push(
          <div key={`takeaways-${blocks.length}`} className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 mb-10 shadow-lg border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#CCFF00]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-[#CCFF00] text-slate-950 text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider">
                TL;DR • Key Takeaways
              </span>
              <span className="text-xs text-slate-400 font-mono">Quick Summary</span>
            </div>
            <ul className="space-y-3 text-sm sm:text-[15px] text-slate-200 leading-relaxed pl-0 list-none mb-0">
              {rawItems.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <div>{renderInlineFormatting(item)}</div>
                </li>
              ))}
            </ul>
          </div>
        );
        currentQuote = null;
        return;
      }

      const isCallout = /action for this week|key rule|pro tip|note:|warning:/i.test(fullText);
      if (isCallout) {
        blocks.push(
          <div key={`callout-${blocks.length}`} className="my-7 rounded-2xl border-l-4 border-slate-950 bg-slate-50 border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-950" />
              <span>Key Takeaway</span>
            </div>
            {currentQuote.map((qLine, qIdx) => (
              <p key={qIdx} className={`text-slate-800 text-[1.05rem] leading-relaxed ${qIdx === currentQuote.length - 1 ? "!mb-0" : "!mb-2"}`}>
                {renderInlineFormatting(qLine)}
              </p>
            ))}
          </div>
        );
        currentQuote = null;
        return;
      }

      blocks.push(
        <blockquote key={`quote-${blocks.length}`} className="my-8 bg-gradient-to-r from-slate-100/70 via-slate-50 to-transparent border-l-4 border-slate-950 p-6 rounded-r-2xl not-italic shadow-xs">
          {currentQuote.map((qLine, qIdx) => (
            <p key={qIdx} className={`text-slate-800 text-lg leading-relaxed font-medium ${qIdx === currentQuote.length - 1 ? "!mb-0" : "!mb-2"}`}>
              {renderInlineFormatting(qLine)}
            </p>
          ))}
        </blockquote>
      );
      currentQuote = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      flushQuote();
      continue;
    }

    // Heading match
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      flushQuote();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const cleanTitle = text.replace(/[*_`]/g, "");

      if (level === 1 && (!foundFirstHeading || cleanTitle.toLowerCase() === (articleTitle || "").toLowerCase().trim())) {
        foundFirstHeading = true;
        continue;
      }
      foundFirstHeading = true;

      const headingId = slugifyHeading(cleanTitle, seenIds);

      if (level <= 2) {
        blocks.push(
          <h2 key={`h2-${blocks.length}`} id={headingId} className="scroll-mt-28">
            {renderInlineFormatting(text)}
          </h2>
        );
      } else {
        blocks.push(
          <h3 key={`h3-${blocks.length}`} id={headingId} className="scroll-mt-28">
            {renderInlineFormatting(text)}
          </h3>
        );
      }
      continue;
    }

    // Divider
    if (trimmed === "---" || trimmed === "***") {
      flushList();
      flushQuote();
      blocks.push(<hr key={`hr-${blocks.length}`} className="my-8 border-slate-200" />);
      continue;
    }

    // Math formula line
    const isFormula = trimmed.startsWith("$$") || 
      /^(Page Conversion Rate|Form Completion Rate|Minimum Sample Size|Sample Size Formula)\s*=/i.test(trimmed);
    if (isFormula) {
      flushList();
      flushQuote();
      let cleanMath = trimmed
        .replace(/^\$\$|\$\$$/g, "")
        .replace(/\\text\{([^}]+)\}/g, "$1")
        .replace(/\\left\(|\\right\)/g, "")
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 ÷ $2)")
        .replace(/\\cdot/g, "×")
        .replace(/\\times/g, "×")
        .replace(/\\sigma\^2/g, "σ²")
        .replace(/\\delta\^2/g, "δ²")
        .replace(/\\/g, "")
        .trim();

      blocks.push(
        <div key={`formula-${blocks.length}`} className="my-6 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-slate-950 inline-block" />
              <span>Core CRO Formula</span>
            </div>
            <div className="font-mono text-base sm:text-lg text-slate-950 font-bold tracking-tight">
              {cleanMath}
            </div>
          </div>
          <span className="self-start sm:self-center text-xs font-mono bg-white text-slate-700 px-3 py-1 rounded-md border border-slate-200 font-semibold shadow-xs">
            Standard Metric
          </span>
        </div>
      );
      continue;
    }

    // Markdown Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      flushQuote();
      const tableLines = [trimmed];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith("|") && lines[i + 1].trim().endsWith("|")) {
        i++;
        tableLines.push(lines[i].trim());
      }
      if (tableLines.length >= 2) {
        const headerCells = tableLines[0].split("|").slice(1, -1).map(c => c.trim());
        const dataRows = tableLines.slice(tableLines[1].includes("---") ? 2 : 1).map(line =>
          line.split("|").slice(1, -1).map(c => c.trim())
        );
        blocks.push(
          <div key={`table-${blocks.length}`} className="overflow-x-auto my-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-900">
                  {headerCells.map((h, hIdx) => (
                    <th key={hIdx} className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-slate-900">
                      {renderInlineFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white hover:bg-slate-50/80 transition" : "bg-slate-50/40 hover:bg-slate-50 transition"}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3.5 px-4 text-slate-700 leading-normal">
                        {renderInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      flushList();
      const quoteLine = trimmed.replace(/^>\s*/, "").replace(/^["'"](.*)["'"]$/, "$1");
      if (!currentQuote) currentQuote = [];
      currentQuote.push(quoteLine);
      continue;
    }

    // Bullet List
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushQuote();
      const itemText = trimmed.replace(/^[-*]\s+/, "");
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(itemText);
      continue;
    }

    // Numbered List
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      flushQuote();
      const itemText = numMatch[2];
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(itemText);
      continue;
    }

    // Markdown image ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushList();
      flushQuote();
      const rawSrc = (imgMatch[2] || "").trim();
      const safeSrc = isSafeUrl(rawSrc) ? rawSrc : "";
      const altText = (imgMatch[1] || "").trim();
      blocks.push(
        <figure key={`img-${blocks.length}`} className="my-10 text-center">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
            <img
              src={safeSrc}
              alt={altText || "Article Visual"}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
          {altText && (
            <figcaption className="mt-3 text-center text-xs text-slate-500 font-medium italic">
              {altText}
            </figcaption>
          )}
        </figure>
      );
      continue;
    }

    // Regular Paragraph
    flushList();
    flushQuote();
    blocks.push(
      <p key={`p-${blocks.length}`}>
        {renderInlineFormatting(trimmed)}
      </p>
    );
  }

  flushList();
  flushQuote();

  return blocks;
}
