from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    scholarship_id = Column(String(100), ForeignKey("scholarships.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="Applied")  # "Applied", "Under Review", "Documents Verified", "Selected", "Rejected"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("Student", back_populates="applications")
    scholarship = relationship("Scholarship", back_populates="applications")
