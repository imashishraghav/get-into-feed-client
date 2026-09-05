from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="admin")  # superadmin, admin, editor
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    tagline = Column(String(255))
    description = Column(Text, nullable=False)
    outcome = Column(Text)
    bottleneck = Column(Text)
    icon = Column(String(50), default="Flame")
    framework_json = Column(Text)  # JSON string of 4 steps
    deliverables_json = Column(Text)  # JSON string of bullet points
    tools_json = Column(Text)  # JSON string of tools
    case_metric = Column(String(100))
    case_brand = Column(String(100))
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    client = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # D2C, Performance Ads, Creative Video, Branding, SEO
    year = Column(String(20), default="2026")
    thumbnail = Column(String(500))
    hero_image = Column(String(500))
    summary = Column(Text, nullable=False)
    metric_highlight = Column(String(100))
    services_provided = Column(Text)  # comma separated
    is_featured = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case_study = relationship("CaseStudy", back_populates="project", uselist=False, cascade="all, delete-orphan")

class CaseStudy(Base):
    __tablename__ = "case_studies"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), unique=True, nullable=False)
    challenge = Column(Text, nullable=False)
    strategy = Column(Text, nullable=False)
    execution = Column(Text, nullable=False)
    results = Column(Text, nullable=False)
    client_quote = Column(Text)
    quote_author = Column(String(255))
    quote_role = Column(String(255))
    gallery_images = Column(Text)  # comma or JSON separated
    video_url = Column(String(500))

    project = relationship("Project", back_populates="case_study")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    logo_url = Column(String(500))
    industry = Column(String(100))
    website = Column(String(255))
    is_featured = Column(Boolean, default=True)
    order = Column(Integer, default=0)

class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(255), nullable=False)
    client_title = Column(String(255))
    company = Column(String(255), nullable=False)
    quote = Column(Text, nullable=False)
    avatar_url = Column(String(500))
    rating = Column(Float, default=5.0)
    metric_highlight = Column(String(100))
    is_featured = Column(Boolean, default=True)
    order = Column(Integer, default=0)

class BlogCategory(Base):
    __tablename__ = "blog_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)

    posts = relationship("BlogPost", back_populates="category")

class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    featured_image = Column(String(500))
    category_id = Column(Integer, ForeignKey("blog_categories.id"))
    author_name = Column(String(100), default="Ashish Raghav")
    author_role = Column(String(100), default="Growth Director")
    reading_time = Column(String(50), default="5 min read")
    is_published = Column(Boolean, default=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    seo_title = Column(String(255))
    seo_description = Column(Text)

    category = relationship("BlogCategory", back_populates="posts")

class Enquiry(Base):
    __tablename__ = "enquiries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(100), nullable=False)
    company = Column(String(255))
    website = Column(String(255))
    service_interest = Column(String(150), default="Content & Paid Growth")
    budget_range = Column(String(100), default="₹25k - ₹50k/mo")
    message = Column(Text)
    status = Column(String(50), default="new")  # new, contacted, qualified, converted, archived
    internal_notes = Column(Text)
    source = Column(String(100), default="Website Intake")
    created_at = Column(DateTime, default=datetime.utcnow)

class TeamMember(Base):
    __tablename__ = "team_members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    bio = Column(Text)
    photo_url = Column(String(500))
    order = Column(Integer, default=0)
    linkedin = Column(String(255))

class JobOpening(Base):
    __tablename__ = "job_openings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department = Column(String(100), nullable=False)
    location = Column(String(100), default="Remote / Hybrid (India)")
    type = Column(String(50), default="Full-Time")
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MediaAsset(Base):
    __tablename__ = "media_assets"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50))
    file_size = Column(Integer)
    uploaded_by = Column(String(100), default="Admin")
    created_at = Column(DateTime, default=datetime.utcnow)

class SiteSetting(Base):
    __tablename__ = "site_settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text, nullable=False)
    description = Column(String(255))
