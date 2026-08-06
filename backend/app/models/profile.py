from sqlalchemy import Column, Integer, String, Boolean, Date, Numeric, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Personal Info
    gender = Column(String(50), nullable=True)
    dob = Column(Date, nullable=True)
    mobile = Column(String(15), nullable=True)
    
    # Address
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    city_town_village = Column(String(100), nullable=True)
    pin_code = Column(String(10), nullable=True)

    # Academic
    education_level = Column(String(100), nullable=True)
    course_name = Column(String(100), nullable=True)
    specialization = Column(String(100), nullable=True)
    institution_name = Column(String(255), nullable=True)
    university_board = Column(String(255), nullable=True)
    current_year_semester = Column(String(100), nullable=True)
    grading_scale = Column(String(20), nullable=True)  # "CGPA" or "Percentage"
    grades_value = Column(Numeric(5, 2), nullable=True)

    # Eligibility
    income = Column(Numeric(12, 2), nullable=True)
    category = Column(String(50), nullable=True)
    minority_status = Column(Boolean, default=False)
    disability_status = Column(Boolean, default=False)
    nationality = Column(String(100), default="Indian")
    aadhaar_available = Column(Boolean, default=True)

    # Optional / Achievements
    skills = Column(Text, nullable=True)  # JSON serialized array of strings
    certifications = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    research_papers = Column(Text, nullable=True)
    publications = Column(Text, nullable=True)
    competitions = Column(Text, nullable=True)
    olympiads = Column(Text, nullable=True)
    hackathons = Column(Text, nullable=True)
    internships = Column(Text, nullable=True)
    extracurriculars = Column(Text, nullable=True)
    sports_achievements = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("Student", back_populates="profile")
