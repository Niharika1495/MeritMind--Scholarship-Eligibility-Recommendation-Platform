from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class StudentDocument(Base):
    __tablename__ = "student_documents"

    id = Column(String(100), primary_key=True, index=True)
    student_id = Column(String(100), ForeignKey("students.id"), nullable=False)
    doc_type = Column(String(100), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    mime_type = Column(String(100), default="application/pdf")
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="documents")
