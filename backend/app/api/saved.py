from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.student import Student
from app.models.saved import SavedScholarship
from app.api.deps import get_current_user
from typing import List

router = APIRouter(prefix="/saved", tags=["saved"])

@router.get("", response_model=List[str])
def list_saved(current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    saved = db.query(SavedScholarship).filter(SavedScholarship.student_id == current_user.id).all()
    return [s.scholarship_id for s in saved]

@router.post("/{id}", response_model=List[str])
def add_saved(id: str, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(SavedScholarship).filter(
        SavedScholarship.student_id == current_user.id,
        SavedScholarship.scholarship_id == id
    ).first()
    
    if not existing:
        db_s = SavedScholarship(student_id=current_user.id, scholarship_id=id)
        db.add(db_s)
        db.commit()
        
    saved = db.query(SavedScholarship).filter(SavedScholarship.student_id == current_user.id).all()
    return [s.scholarship_id for s in saved]

@router.delete("/{id}", response_model=List[str])
def remove_saved(id: str, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(SavedScholarship).filter(
        SavedScholarship.student_id == current_user.id,
        SavedScholarship.scholarship_id == id
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        
    saved = db.query(SavedScholarship).filter(SavedScholarship.student_id == current_user.id).all()
    return [s.scholarship_id for s in saved]

@router.delete("", response_model=List[str])
def clear_saved(current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(SavedScholarship).filter(SavedScholarship.student_id == current_user.id).delete()
    db.commit()
    return []
