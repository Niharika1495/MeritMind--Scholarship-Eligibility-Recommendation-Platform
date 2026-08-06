from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.student import Student
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationOut
from app.schemas.scholarship import to_scholarship_out
from app.api.deps import get_current_user
from typing import List

router = APIRouter(prefix="/applications", tags=["applications"])

@router.get("", response_model=List[ApplicationOut])
def list_applications(current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    apps = db.query(Application).filter(Application.student_id == current_user.id).all()
    
    out = []
    for a in apps:
        out.append(
            ApplicationOut(
                id=a.id,
                scholarshipId=a.scholarship_id,
                status=a.status,
                appliedAt=a.created_at.date().isoformat() if hasattr(a.created_at, "date") else "2026-08-01",
                scholarship=to_scholarship_out(a.scholarship)
            )
        )
    return out

from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationStatusUpdate

VALID_STATUSES = [
    "Saved", "Applying", "Applied", "Under Review",
    "Documents Submitted", "Interview Scheduled",
    "Selected", "Rejected", "Offer Accepted"
]

@router.post("", response_model=ApplicationOut)
def apply_scholarship(app_in: ApplicationCreate, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Application).filter(
        Application.student_id == current_user.id,
        Application.scholarship_id == app_in.scholarshipId
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You are already tracking this scholarship application."
        )
        
    initial_status = app_in.status if app_in.status in VALID_STATUSES else "Applied"
    db_app = Application(
        student_id=current_user.id,
        scholarship_id=app_in.scholarshipId,
        status=initial_status
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    
    return ApplicationOut(
        id=db_app.id,
        scholarshipId=db_app.scholarship_id,
        status=db_app.status,
        appliedAt=db_app.created_at.date().isoformat() if hasattr(db_app.created_at, "date") else "2026-08-01",
        scholarship=to_scholarship_out(db_app.scholarship)
    )

@router.put("/{id}/status", response_model=ApplicationOut)
def update_application_status(id: int, status_in: ApplicationStatusUpdate, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Application).filter(
        Application.id == id,
        Application.student_id == current_user.id
    ).first()
    
    if not existing:
        raise HTTPException(status_code=404, detail="Application not found.")
        
    if status_in.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")
        
    existing.status = status_in.status
    db.commit()
    db.refresh(existing)
    
    return ApplicationOut(
        id=existing.id,
        scholarshipId=existing.scholarship_id,
        status=existing.status,
        appliedAt=existing.created_at.date().isoformat() if hasattr(existing.created_at, "date") else "2026-08-01",
        scholarship=to_scholarship_out(existing.scholarship)
    )

@router.delete("/{id}")
def cancel_application(id: int, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Application).filter(
        Application.id == id,
        Application.student_id == current_user.id
    ).first()
    
    if not existing:
        raise HTTPException(status_code=404, detail="Application not found.")
        
    db.delete(existing)
    db.commit()
    return {"message": "Application tracker cancelled successfully."}
