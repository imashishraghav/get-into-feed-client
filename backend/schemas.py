from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Token
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "admin"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Service
class ServiceBase(BaseModel):
    slug: str
    title: str
    tagline: Optional[str] = None
    description: str
    outcome: Optional[str] = None
    bottleneck: Optional[str] = None
    icon: Optional[str] = "Flame"
    framework_json: Optional[str] = None
    deliverables_json: Optional[str] = None
    tools_json: Optional[str] = None
    case_metric: Optional[str] = None
    case_brand: Optional[str] = None
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Project & Case Study
class CaseStudyBase(BaseModel):
    challenge: str
    strategy: str
    execution: str
    results: str
    client_quote: Optional[str] = None
    quote_author: Optional[str] = None
    quote_role: Optional[str] = None
    gallery_images: Optional[str] = None
    video_url: Optional[str] = None

class ProjectBase(BaseModel):
    slug: str
    title: str
    client: str
    category: str
    year: Optional[str] = "2026"
    thumbnail: Optional[str] = None
    hero_image: Optional[str] = None
    summary: str
    metric_highlight: Optional[str] = None
    services_provided: Optional[str] = None
    is_featured: Optional[bool] = False
    is_published: Optional[bool] = True

class ProjectCreate(ProjectBase):
    case_study: Optional[CaseStudyBase] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    case_study: Optional[CaseStudyBase] = None
    class Config:
        from_attributes = True

# Enquiry
class EnquiryCreate(BaseModel):
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    website: Optional[str] = None
    service_interest: Optional[str] = "Content & Paid Growth"
    budget_range: Optional[str] = "₹25k - ₹50k/mo"
    message: Optional[str] = None
    source: Optional[str] = "Website Inquiry"

class EnquiryUpdate(BaseModel):
    status: Optional[str] = None
    internal_notes: Optional[str] = None

class EnquiryResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    company: Optional[str]
    website: Optional[str]
    service_interest: Optional[str]
    budget_range: Optional[str]
    message: Optional[str]
    status: str
    internal_notes: Optional[str]
    source: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# Blog
class BlogPostBase(BaseModel):
    slug: str
    title: str
    excerpt: str
    content: str
    featured_image: Optional[str] = None
    category_id: Optional[int] = None
    author_name: Optional[str] = "Ashish Raghav"
    author_role: Optional[str] = "Growth Director"
    reading_time: Optional[str] = "5 min read"
    is_published: Optional[bool] = True
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: int
    published_at: datetime
    class Config:
        from_attributes = True

# Blog Comments & Moderation
class CommentCreate(BaseModel):
    author_name: str
    author_email: str
    comment_text: str
    website: Optional[str] = None

class CommentUpdate(BaseModel):
    status: str  # approved, rejected, spam, pending

class CommentResponse(BaseModel):
    id: int
    post_slug: str
    author_name: str
    comment_text: str
    website: Optional[str]
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class ReactionRequest(BaseModel):
    reaction_type: str  # love, fire, clap, insightful
