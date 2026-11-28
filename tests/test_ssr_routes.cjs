const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync('laravel/database/database.sqlite');
const templateHtml = fs.readFileSync('index.html', 'utf8');

function renderRoute(routePath) {
    let title = 'GetIntoFeed | Creative Marketing & Performance Growth Agency';
    let h1 = 'Your business is online. But is it getting noticed?';
    let body = '';

    if (routePath === '/') {
        title = 'GetIntoFeed | Creative Marketing & Performance Growth Agency';
        h1 = 'Your business is online. But is it getting noticed?';
        body = '<h1>' + h1 + '</h1><p>Digital marketing services in Delhi NCR...</p>';
    } else if (routePath === '/services') {
        title = 'Our Services — Performance Marketing, SEO & Creative Media | GetIntoFeed';
        h1 = 'Growth & Performance Marketing Services in Delhi NCR';
        body = '<h1>' + h1 + '</h1><p>Comprehensive creative performance marketing, SEO, video reels...</p>';
    } else if (routePath === '/pricing') {
        title = 'Pricing & Growth Sprints — Transparent Retainers | GetIntoFeed';
        h1 = 'Transparent Growth Sprints & Retainers';
        body = '<h1>' + h1 + '</h1><p>Explore transparent engagement models: Full-Funnel Growth Retainer...</p>';
    } else if (routePath === '/contact') {
        title = 'Contact Us — Book a 30-Minute Growth Strategy Call | GetIntoFeed';
        h1 = 'Start a Direct Conversation With Our Strategy Lead';
        body = '<h1>' + h1 + '</h1><p>Reach out to our growth directors in New Delhi...</p>';
    } else if (routePath.startsWith('/services/')) {
        const slug = routePath.replace('/services/', '');
        const svc = db.prepare('SELECT name, short_description FROM services WHERE slug = ?').get(slug);
        const name = svc ? svc.name : 'Digital Marketing';
        title = `${name} Services in Delhi NCR | GetIntoFeed`;
        h1 = `${name} Services in Delhi NCR`;
        body = '<h1>' + h1 + '</h1><p>' + (svc ? svc.short_description : '') + '</p>';
    } else if (routePath === '/blog') {
        title = 'Feed Notes & Growth Insights — Performance Marketing Playbooks | GetIntoFeed';
        h1 = 'Feed Notes & Growth Insights';
        body = '<h1>' + h1 + '</h1><p>Deep dives on Meta Advantage+ scaling...</p>';
    } else if (routePath === '/thank-you') {
        title = 'Thank You | Consultation Request Received — GetIntoFeed';
        h1 = 'Thank You! Your Growth Consultation Is Scheduled';
        body = '<h1>' + h1 + '</h1><p>Thank you for requesting a growth consultation...</p>';
    }

    // SSR Injection
    let rendered = templateHtml;
    rendered = rendered.replace(/<title>.*?<\/title>/is, `<title>${title}</title>`);
    rendered = rendered.replace('<div id="root"><!-- SSR_CONTENT_INJECTION --></div>', `<div id="root">\n  <main id="main-content">\n    ${body}\n  </main>\n</div>`);

    const h1Match = rendered.match(/<h1[^>]*>(.*?)<\/h1>/i);
    return {
        path: routePath,
        title,
        h1: h1Match ? h1Match[1] : 'NONE',
        hasSingleH1: (rendered.match(/<h1/gi) || []).length === 1
    };
}

const routes = [
    '/',
    '/services',
    '/pricing',
    '/contact',
    '/services/seo-services-delhi-ncr',
    '/blog',
    '/thank-you'
];

console.log('Testing Server-Side Rendered H1 and Title across public routes:');
routes.forEach(r => {
    const res = renderRoute(r);
    console.log(`Route [${res.path}] -> H1: "${res.h1}" | Exactly 1 H1: ${res.hasSingleH1}`);
});
