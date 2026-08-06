from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class SavedScholarship(Base):
    __tablename__ = "saved_scholarships"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    scholarship_id = Column(String(100), ForeignKey("scholarships.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="saved_scholarships")
    scholarship = relationship("Scholarship", back_populates="saved_by")
