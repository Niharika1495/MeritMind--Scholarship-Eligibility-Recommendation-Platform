from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.student import Student
from app.models.notification import Notification
from app.schemas.notification import NotificationOut
from app.api.deps import get_current_user
from typing import List

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=List[NotificationOut])
def list_notifications(current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    # Auto-generate a warning notification if profile is not setup yet
    if not current_user.profile:
        exists = db.query(Notification).filter(
            Notification.student_id == current_user.id,
            Notification.type == "Reminder"
        ).first()
        if not exists:
            rem = Notification(
                student_id=current_user.id,
                title="Profile Incomplete",
                message="Your academic profile is incomplete. Finish profile setup to unlock matches.",
                type="Reminder",
                read=False
            )
            db.add(rem)
            db.commit()

    notes = db.query(Notification).filter(Notification.student_id == current_user.id).order_by(Notification.created_at.desc()).all()
    
    return [
        NotificationOut(
            id=n.id,
            title=n.title,
            message=n.message,
            type=n.type,
            read=n.read,
            createdAt=n.created_at.isoformat() if hasattr(n.created_at, "isoformat") else "2026-08-01T12:00:00Z"
        )
        for n in notes
    ]

@router.post("/{id}/read")
def mark_read(id: int, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Notification).filter(
        Notification.id == id,
        Notification.student_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found.")
        
    note.read = True
    db.commit()
    return {"message": "Notification marked as read."}
