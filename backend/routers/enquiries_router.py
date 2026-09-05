from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])

@router.post("", response_model=schemas.EnquiryResponse, status_code=status.HTTP_201_CREATED)
def create_enquiry(enquiry_in: schemas.EnquiryCreate, db: Session = Depends(get_db)):
    enquiry = models.Enquiry(**enquiry_in.dict())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry

@router.get("", response_model=List[schemas.EnquiryResponse])
def list_enquiries(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Enquiry)
    if status_filter:
        query = query.filter(models.Enquiry.status == status_filter)
    return query.order_by(models.Enquiry.created_at.desc()).all()

@router.patch("/{enquiry_id}", response_model=schemas.EnquiryResponse)
def update_enquiry(
    enquiry_id: int,
    enquiry_update: schemas.EnquiryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    if enquiry_update.status is not None:
        enquiry.status = enquiry_update.status
    if enquiry_update.internal_notes is not None:
        enquiry.internal_notes = enquiry_update.internal_notes
    db.commit()
    db.refresh(enquiry)
    return enquiry
