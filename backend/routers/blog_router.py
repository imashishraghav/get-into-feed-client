from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
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

# --- COMMENTS & MODERATION ---

@router.post("/{slug}/comments", response_model=schemas.CommentResponse, status_code=status.HTTP_201_CREATED)
def submit_comment(slug: str, comment_in: schemas.CommentCreate, db: Session = Depends(get_db)):
    comment = models.Comment(
        post_slug=slug,
        author_name=comment_in.author_name,
        author_email=comment_in.author_email,
        website=comment_in.website,
        comment_text=comment_in.comment_text,
        status="pending"
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@router.get("/{slug}/comments", response_model=List[schemas.CommentResponse])
def get_approved_comments(slug: str, db: Session = Depends(get_db)):
    return db.query(models.Comment).filter(
        models.Comment.post_slug == slug,
        models.Comment.status == "approved"
    ).order_by(models.Comment.created_at.desc()).all()

@router.get("/admin/comments", response_model=List[schemas.CommentResponse])
def get_all_comments_admin(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Comment)
    if status_filter and status_filter != "all":
        query = query.filter(models.Comment.status == status_filter)
    return query.order_by(models.Comment.created_at.desc()).all()

@router.patch("/admin/comments/{comment_id}/status", response_model=schemas.CommentResponse)
def update_comment_status(
    comment_id: int,
    status_update: schemas.CommentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment.status = status_update.status
    db.commit()
    db.refresh(comment)
    return comment

# --- REACTIONS ---

@router.post("/{slug}/react")
def add_reaction(slug: str, req: schemas.ReactionRequest, db: Session = Depends(get_db)):
    reaction = db.query(models.BlogReaction).filter(
        models.BlogReaction.post_slug == slug,
        models.BlogReaction.reaction_type == req.reaction_type
    ).first()
    if reaction:
        reaction.count += 1
    else:
        reaction = models.BlogReaction(post_slug=slug, reaction_type=req.reaction_type, count=1)
        db.add(reaction)
    db.commit()
    
    all_reactions = db.query(models.BlogReaction).filter(models.BlogReaction.post_slug == slug).all()
    return {r.reaction_type: r.count for r in all_reactions}
