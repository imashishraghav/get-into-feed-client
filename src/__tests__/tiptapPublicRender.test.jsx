import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderArticleContent, getArticleToc } from '../utils/markdownRenderer.jsx';

describe('Public SPA TipTap & Converted Markdown Rendering', () => {
  it('renders every TipTap custom block safely inside .classic-content-pro and generates TOC entries', () => {
    const tiptapHtml = `
      <h2>Pipeline Strategy</h2>
      <div class="gif-toc-block" data-toc="true">
        <p><strong>Table of Contents</strong></p>
        <ul><li class="gif-toc-html-h2"><a href="#pipeline-strategy">Pipeline Strategy</a></li></ul>
      </div>
      <div class="gif-callout gif-callout-tip" data-callout="true" data-type="tip">
        <p>Optimize landing pages before scaling paid spend.</p>
      </div>
      <div class="gif-table-scroll">
        <table>
          <thead><tr><th>Metric</th><th>Target</th></tr></thead>
          <tbody><tr><td>CVR</td><td>4.5%</td></tr></tbody>
        </table>
      </div>
      <figure class="gif-image-figure">
        <img src="/storage/funnel.webp" alt="Funnel chart" loading="lazy" />
        <figcaption>Funnel conversion breakdown</figcaption>
      </figure>
      <figure class="gif-video-embed" data-video-embed="true">
        <iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Demo" loading="lazy"></iframe>
      </figure>
      <figure class="gif-video-embed" data-video-embed="true">
        <iframe src="https://evil.example/embed/phish"></iframe>
      </figure>
      <div class="gif-faq-block" data-faq="true">
        <div class="gif-faq-item"><h4>How quickly does CRO lift ROI?</h4><p>Often within 30 days.</p></div>
      </div>
      <div class="gif-cta-block" data-cta="button">
        <p><strong>Ready to grow pipeline?</strong></p>
        <a class="gif-cta-btn" data-cta="true" href="https://getintofeed.com/contact">Book Audit</a>
      </div>
      <script>window.__xss = true;</script>
    `;

    const toc = getArticleToc({ title: 'Growth Guide', content: tiptapHtml });
    expect(toc.some((item) => item.id === 'pipeline-strategy' && item.title === 'Pipeline Strategy')).toBe(true);

    const { container } = render(<div>{renderArticleContent(tiptapHtml, 'Growth Guide')}</div>);

    expect(container.querySelector('.classic-content-pro')).not.toBeNull();
    expect(container.querySelector('h2#pipeline-strategy')).not.toBeNull();
    expect(container.querySelector('.gif-toc-block')).not.toBeNull();
    expect(container.querySelector('.gif-callout[data-type="tip"]')).not.toBeNull();
    expect(container.querySelector('.gif-table-scroll table')).not.toBeNull();
    expect(container.querySelector('figure.gif-image-figure figcaption')?.textContent).toBe('Funnel conversion breakdown');
    expect(container.querySelector('figure[data-video-embed] iframe')?.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(container.querySelector('iframe[src*="evil.example"]')).toBeNull();
    expect(container.querySelector('.gif-faq-block .gif-faq-item h4')?.textContent).toBe('How quickly does CRO lift ROI?');
    expect(container.querySelector('.gif-cta-block a.gif-cta-btn')?.getAttribute('href')).toBe('https://getintofeed.com/contact');
    expect(container.querySelector('script')).toBeNull();
  });

  it('renders a legacy Markdown post converted via Convert to Visual Blocks identically on SPA and has public CSS', () => {
    const convertedHtml = '<h2>Revenue Marketing Playbook</h2><ul><li>Audit landing pages</li><li>Track attribution</li></ul><p>Use <strong>structured blocks</strong>.</p>';

    const { container } = render(<div>{renderArticleContent(convertedHtml, 'Legacy Post')}</div>);
    expect(container.querySelector('h2#revenue-marketing-playbook')?.textContent).toBe('Revenue Marketing Playbook');
    expect(container.querySelectorAll('ul li').length).toBe(2);
    expect(container.querySelector('strong')?.textContent).toBe('structured blocks');

    const css = fs.readFileSync(path.resolve(__dirname, '../styles.css'), 'utf8');
    for (const selector of ['.gif-callout', '.gif-cta-block', '.gif-cta-btn', '.gif-faq-block', '.gif-toc-block', '.gif-table-scroll', '.gif-image-figure', '.gif-video-embed']) {
      expect(css).toContain(selector);
    }
  });
});
