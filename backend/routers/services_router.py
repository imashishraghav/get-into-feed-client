from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("", response_model=List[schemas.ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).filter(models.Service.is_published == True).order_by(models.Service.order.asc()).all()

@router.get("/{slug}", response_model=schemas.ServiceResponse)
def get_service_by_slug(slug: str, db: Session = Depends(get_db)):
    srv = db.query(models.Service).filter(models.Service.slug == slug).first()
    if not srv:
        raise HTTPException(status_code=404, detail="Service not found")
    return srv

@router.post("", response_model=schemas.ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    service_in: schemas.ServiceCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    srv = models.Service(**service_in.dict())
    db.add(srv)
    db.commit()
    db.refresh(srv)
    return srv
