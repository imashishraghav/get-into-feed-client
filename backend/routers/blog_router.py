from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/blog", tags=["Blog"])

@router.get("", response_model=List[schemas.BlogPostResponse])
def get_posts(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.BlogPost).filter(models.BlogPost.is_published == True)
    if search:
        query = query.filter(models.BlogPost.title.ilike(f"%{search}%") | models.BlogPost.content.ilike(f"%{search}%"))
    return query.order_by(models.BlogPost.published_at.desc()).all()

@router.get("/{slug}", response_model=schemas.BlogPostResponse)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(models.BlogPost).filter(models.BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post
