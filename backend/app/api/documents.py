import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.student import Student
from app.models.document import StudentDocument
from app.api.deps import get_current_user

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads", "vault")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[dict])
def list_documents(current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    docs = db.query(StudentDocument).filter(StudentDocument.student_id == str(current_user.id)).all()
    return [
        {
            "id": d.id,
            "docType": d.doc_type,
            "filename": d.filename,
            "fileSize": d.file_size,
            "mimeType": d.mime_type,
            "uploadedAt": d.uploaded_at.isoformat() if d.uploaded_at else ""
        }
        for d in docs
    ]

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    docType: str = Form(...),
    file: UploadFile = File(...),
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    valid_types = [
        "Aadhaar",
        "Income Certificate",
        "Bonafide Certificate",
        "Caste Certificate",
        "Disability Certificate",
        "Resume"
    ]
    
    doc_id = str(uuid.uuid4())
    safe_filename = f"{current_user.id}_{doc_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    contents = await file.read()
    file_size = len(contents)

    with open(file_path, "wb") as f:
        f.write(contents)

    # Check if document of docType already exists for student, replace if so
    existing = db.query(StudentDocument).filter(
        StudentDocument.student_id == str(current_user.id),
        StudentDocument.doc_type == docType
    ).first()

    if existing:
        if os.path.exists(existing.file_path):
            try:
                os.remove(existing.file_path)
            except Exception:
                pass
        existing.filename = file.filename
        existing.file_path = file_path
        existing.file_size = file_size
        existing.mime_type = file.content_type or "application/pdf"
        db.commit()
        db.refresh(existing)
        return {
            "id": existing.id,
            "docType": existing.doc_type,
            "filename": existing.filename,
            "fileSize": existing.file_size,
            "mimeType": existing.mime_type,
            "uploadedAt": existing.uploaded_at.isoformat() if existing.uploaded_at else ""
        }

    doc = StudentDocument(
        id=doc_id,
        student_id=str(current_user.id),
        doc_type=docType,
        filename=file.filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=file.content_type or "application/pdf"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "id": doc.id,
        "docType": doc.doc_type,
        "filename": doc.filename,
        "fileSize": doc.file_size,
        "mimeType": doc.mime_type,
        "uploadedAt": doc.uploaded_at.isoformat() if doc.uploaded_at else ""
    }

@router.delete("/{doc_id}", status_code=status.HTTP_200_OK)
def delete_document(doc_id: str, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(StudentDocument).filter(
        StudentDocument.id == doc_id,
        StudentDocument.student_id == str(current_user.id)
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

@router.get("/{doc_id}/download")
def download_document(doc_id: str, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(StudentDocument).filter(
        StudentDocument.id == doc_id,
        StudentDocument.student_id == str(current_user.id)
    ).first()

    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="Document file not found")

    return FileResponse(
        path=doc.file_path,
        filename=doc.filename,
        media_type=doc.mime_type or "application/octet-stream"
    )
