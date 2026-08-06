from sqlalchemy import Column, String, Numeric, Boolean, Text, Date, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(String(100), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    provider = Column(String(255), nullable=False)
    logo = Column(String(50), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), default="₹")
    deadline = Column(Date, nullable=False)
    category = Column(String(100), nullable=False)
    sector = Column(String(50), nullable=False)
    state = Column(String(100), default="All India")
    max_income = Column(Numeric(12, 2), nullable=False)
    min_cgpa = Column(Numeric(4, 2), nullable=False)
    for_women = Column(Boolean, default=False)
    for_minority = Column(Boolean, default=False)
    for_disability = Column(Boolean, default=False)
    official_website = Column(String(500), nullable=True)
    official_apply_url = Column(String(500), nullable=True)
    source_collector = Column(String(100), default="official_source")
    summary = Column(Text, nullable=True)
    overview = Column(Text, nullable=True)
    
    # Serialized JSON lists
    benefits = Column(Text, nullable=True)          # JSON list of strings
    eligibility = Column(Text, nullable=True)       # JSON list of strings
    documents = Column(Text, nullable=True)         # JSON list of strings
    branches = Column(Text, nullable=True)          # JSON list of strings
    education_levels = Column(Text, nullable=True)  # JSON list of strings
    selection_process = Column(Text, nullable=True) # JSON list of strings
    
    status = Column(String(50), default="Active")   # "Active" or "Inactive"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

    saved_by = relationship("SavedScholarship", back_populates="scholarship", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="scholarship", cascade="all, delete-orphan")
