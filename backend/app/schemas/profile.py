from pydantic import BaseModel
from typing import List, Optional

class ProfileSchema(BaseModel):
    name: str
    gender: str
    dob: str  # ISO date string (YYYY-MM-DD)
    mobile: str
    email: str

    # Address Info
    state: str
    district: str
    cityTownVillage: str
    pinCode: str

    # Academic Info
    educationLevel: str
    courseName: str
    specialization: str
    institutionName: str
    universityBoard: str
    currentYearSemester: str
    gradingScale: str  # "CGPA" or "Percentage"
    gradesValue: float

    # Eligibility Info
    income: float
    category: str
    minorityStatus: bool
    disabilityStatus: bool
    nationality: str
    aadhaarAvailable: bool

    # Optional / Achievements
    skills: List[str] = []
    certifications: str = ""
    projects: str = ""
    researchPapers: str = ""
    publications: str = ""
    competitions: str = ""
    olympiads: str = ""
    hackathons: str = ""
    internships: str = ""
    extracurriculars: str = ""
    sportsAchievements: str = ""

    class Config:
        from_attributes = True
        populate_by_name = True
