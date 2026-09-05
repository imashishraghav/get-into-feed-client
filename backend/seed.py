import json
from database import SessionLocal, engine, Base
import models, auth

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Super Admin
    admin = db.query(models.User).filter(models.User.email == "admin@getintofeed.com").first()
    if not admin:
        admin = models.User(
            email="admin@getintofeed.com",
            hashed_password=auth.get_password_hash("admin12345"),
            full_name="Growth Director",
            role="superadmin",
            is_active=True
        )
        db.add(admin)
        print("✅ Seeded default Super Admin (admin@getintofeed.com / admin12345)")

    # 2. Services
    existing_services = db.query(models.Service).count()
    if existing_services == 0:
        services_data = [
            {
                "slug": "content-marketing",
                "title": "High-Retention Content Marketing Engine",
                "tagline": "Organic Attention at Scale",
                "description": "We produce thumb-stopping hooks, founder authority content, and viral video scripts engineered to hijack attention.",
                "outcome": "Dominant organic reach across Instagram Reels, YouTube Shorts, and LinkedIn.",
                "bottleneck": "99% of brands post boring, generic graphics that get zero engagement.",
                "case_metric": "+340% Higher Organic Engagement",
                "case_brand": "Modern Consumer D2C Portfolio",
                "icon": "Edit3",
                "order": 1
            },
            {
                "slug": "ads-campaign",
                "title": "Performance Paid Media & ROAS Scaling",
                "tagline": "Profitable Customer Acquisition",
                "description": "Full-funnel Meta & Google Ads architecture with continuous creative testing and conversion rate optimization.",
                "outcome": "Predictable lead pipelines and profitable customer acquisition costs.",
                "bottleneck": "Unstructured campaigns that burn budget on cold audiences with zero retargeting.",
                "case_metric": "4.6x Average ROAS Scaled",
                "case_brand": "Apparel & Health Tech Brands",
                "icon": "Megaphone",
                "order": 2
            },
            {
                "slug": "reels",
                "title": "Viral Reels & Short-Form Video Engine",
                "tagline": "Vertical Video Domination",
                "description": "Fast-paced vertical videos, trending sound sync, kinetic captions, and viral hook scripting.",
                "outcome": "Millions of targeted impressions with zero paid ad spend.",
                "bottleneck": "Videos that lose viewer retention in the first 3 seconds.",
                "case_metric": "3.2M+ Viral Reel Impressions",
                "case_brand": "Hospitality & Fitness Brands",
                "icon": "Clapperboard",
                "order": 3
            },
            {
                "slug": "social-media",
                "title": "Omnichannel Social Media Authority",
                "tagline": "Community & Brand Loyalty",
                "description": "Daily community management, aesthetic curation, tone-of-voice crafting, and influencer collaborations.",
                "outcome": "A rabid brand following that converts into repeat customers.",
                "bottleneck": "Inconsistent posting without clear visual narrative.",
                "case_metric": "+185% Follower Growth in 90 Days",
                "case_brand": "Beverage & Lifestyle Brands",
                "icon": "Users",
                "order": 4
            },
            {
                "slug": "growth",
                "title": "High-Speed Web Development & CRO",
                "tagline": "Sub-Second Conversion Funnels",
                "description": "Jamstack & Next.js web experiences engineered for sub-second load times and maximum checkout conversions.",
                "outcome": "Double the conversion rate from existing traffic.",
                "bottleneck": "Slow, clunky WordPress pages that lose 50% of mobile clicks before load.",
                "case_metric": "0.4s Global Load Time",
                "case_brand": "Fintech & SaaS Startups",
                "icon": "Code",
                "order": 5
            }
        ]
        for s in services_data:
            db.add(models.Service(**s))
        print(f"✅ Seeded {len(services_data)} Core Services")

    # 3. Portfolio & Case Studies
    existing_projects = db.query(models.Project).count()
    if existing_projects == 0:
        p1 = models.Project(
            slug="velour-d2c-growth",
            title="Scaling Velour Luxury Apparel from ₹10L to ₹1.2Cr/mo",
            client="Velour India",
            category="D2C",
            year="2026",
            summary="Complete paid ads overhaul, viral short-form batching, and high-converting landing pages.",
            metric_highlight="4.8x ROAS / ₹1.2Cr Monthly Run-rate",
            services_provided="Performance Ads, Viral Reels, Creative Direction",
            is_featured=True
        )
        db.add(p1)
        db.flush()
        cs1 = models.CaseStudy(
            project_id=p1.id,
            challenge="High customer acquisition costs on Meta and stagnant organic social presence.",
            strategy="Built 3-second hook variations and launched an educational carousel engine.",
            execution="Produced 30 bespoke reels per month and restructured Meta ad account into a 3-tier funnel.",
            results="+380% revenue increase with CAC reduced by 42% in 90 days.",
            client_quote="GetIntoFeed turned our social feed into our highest-revenue customer engine.",
            quote_author="Rahul Mehta",
            quote_role="Founder & CEO"
        )
        db.add(cs1)
        print("✅ Seeded initial Portfolio & Case Studies")

    # 4. Blog Posts
    existing_blogs = db.query(models.BlogPost).count()
    if existing_blogs == 0:
        cat = models.BlogCategory(name="Paid Growth", slug="paid-growth")
        db.add(cat)
        db.flush()
        post = models.BlogPost(
            slug="2026-geo-engine-scaling",
            title="The 2026 Generative Engine Optimization (GEO) Playbook",
            excerpt="How AI search models like SearchGPT and Gemini are rewriting organic discovery and brand attribution.",
            content="Search has fundamentally shifted from ten blue links to direct AI answers. In this comprehensive guide, we dissect how next-gen creative agencies structure brand entity graphs, video transcripts, and semantic authority.",
            category_id=cat.id,
            author_name="Ashish Raghav",
            reading_time="6 min read",
            is_published=True
        )
        db.add(post)
        print("✅ Seeded initial Blog Articles")

    db.commit()
    db.close()
    print("🎉 Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
