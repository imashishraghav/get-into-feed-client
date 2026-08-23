import { readFile } from "node:fs/promises";

const pageMetadata = {
  "/": {
    title: "Get Into Feed | Digital Marketing Agency for India's Growth Brands",
    description: "Get Into Feed is a digital marketing agency for ambitious brands seeking growth through SEO, paid media, content and high-converting websites."
  },
  "/services": {
    title: "Digital Marketing Services | Get Into Feed",
    description: "Explore SEO, paid media, social content, web experiences, analytics and content systems from Get Into Feed."
  },
  "/work": {
    title: "Marketing Results & Case Studies | Get Into Feed",
    description: "See how Get Into Feed helps education, D2C and B2B brands improve marketing performance and lead quality."
  },
  "/about": {
    title: "About Get Into Feed | Digital Growth Agency",
    description: "Meet the thinking behind Get Into Feed, an independent digital growth agency built for ambitious Indian businesses."
  },
  "/careers": {
    title: "Careers at Get Into Feed | Join Our Team",
    description: "Explore digital marketing careers at Get Into Feed and apply to help ambitious brands grow with better work."
  },
  "/contact": {
    title: "Contact Get Into Feed | Start Your Growth Plan",
    description: "Tell Get Into Feed about your goals and receive a practical digital marketing growth plan for your brand."
  }
  "/blog": {
    title: "Digital Marketing Insights | Get Into Feed",
    description: "Practical insights on SEO, paid media, content, creative and marketing measurement."
  },
  "/awards": {
    title: "Awards and Recognition | Get Into Feed",
    description: "Celebrating national industry honors, enterprise SEO leadership, and Generative Engine Optimization (GEO) excellence."
  },
  "/faqs": {
    title: "Frequently Asked Questions (FAQs) | Get Into Feed",
    description: "Authoritative answers on Enterprise SEO, AI Search (GEO), Paid Media, Web CRO, contracts, SLAs, and pricing models."
  },
  "/privacy-policy": {
    title: "Privacy Policy | Get Into Feed",
    description: "DPDP Act 2023 and GDPR compliant privacy policy outlining data collection, processing, and protection standards."
  },
  "/terms-and-conditions": {
    title: "Terms & Conditions (Master Services Agreement) | Get Into Feed",
    description: "Terms and conditions governing agency contracts, deliverables, billing, and intellectual property."
  }
};

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function renderSeoPage(indexFile, requestPath) {
  const path = requestPath.replace(/\/$/, "") || "/";
  const sectionPath = path.startsWith("/services/") ? "/services" : path.startsWith("/work/") ? "/work" : path.startsWith("/blog/") ? "/blog" : path;
  const metadata = pageMetadata[sectionPath] || pageMetadata["/"];
  const canonical = `https://getintofeed.com${path === "/" ? "/" : path}`;
  let html = await readFile(indexFile, "utf8");

  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${escapeHtml(metadata.description)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${canonical}" />`);

  return { html, found: Boolean(pageMetadata[sectionPath]) };
}
