import fs from "fs";

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/);
  const imported = importMatch
    ? importMatch[1]
        .split(",")
        .map((s) => s.trim().split(/\s+as\s+/)[0].trim())
        .filter(Boolean)
    : [];

  const tags = [...content.matchAll(/<([A-Z]\w+)/g)].map((m) => m[1]);
  const uniqueTags = [...new Set(tags)];

  const missing = uniqueTags.filter(
    (t) =>
      !imported.includes(t) &&
      ![
        "AdminDashboard", "Link", "App", "ServiceDetail", "WorkDetail",
        "LocationDetail", "BlogArticle", "BlogPage", "EnterpriseHero",
        "ClientMarquee", "ServicesSection", "DigitalReportCard",
        "InteractiveRoiCalculator", "CaseStudiesSection", "AwardsShowcase",
        "TestimonialsSection", "RecentBlogFeed", "ContactAuditSection",
        "AboutPage", "CareersPage", "EnterpriseFooter", "AnnouncementBar",
        "Header", "ServicesHubPage", "FloatingLiveChat"
      ].includes(t)
  );

  console.log(`[${filePath}] Missing icons:`, missing);
}

checkFile("frontend/src/Admin.jsx");
checkFile("frontend/src/App.jsx");
checkFile("frontend/src/Blog.jsx");
checkFile("frontend/src/DetailPages.jsx");
