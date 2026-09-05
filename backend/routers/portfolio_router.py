from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("", response_model=List[schemas.ProjectResponse])
def get_projects(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Project).filter(models.Project.is_published == True)
    if category and category != "All":
        query = query.filter(models.Project.category == category)
    return query.order_by(models.Project.created_at.desc()).all()

@router.get("/{slug}", response_model=schemas.ProjectResponse)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    proj = db.query(models.Project).filter(models.Project.slug == slug).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj
