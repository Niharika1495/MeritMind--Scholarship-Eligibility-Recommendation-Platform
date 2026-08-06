from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.profile import ProfileSchema
from app.models.student import Student
from app.models.profile import StudentProfile
from app.api.deps import get_current_user
from typing import Optional
import json
from datetime import datetime

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("", response_model=Optional[ProfileSchema])
def read_profile(current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.profile
    if not profile:
        return None
    
    skills_list = []
    if profile.skills:
        try:
            skills_list = json.loads(profile.skills)
        except Exception:
            skills_list = []
            
    dob_str = profile.dob.isoformat() if profile.dob else ""

    return ProfileSchema(
        name=current_user.name,
        gender=profile.gender or "",
        dob=dob_str,
        mobile=profile.mobile or "",
        email=current_user.email,
        state=profile.state or "",
        district=profile.district or "",
        cityTownVillage=profile.city_town_village or "",
        pinCode=profile.pin_code or "",
        educationLevel=profile.education_level or "",
        courseName=profile.course_name or "",
        specialization=profile.specialization or "",
        institutionName=profile.institution_name or "",
        universityBoard=profile.university_board or "",
        currentYearSemester=profile.current_year_semester or "",
        gradingScale=profile.grading_scale or "CGPA",
        gradesValue=float(profile.grades_value) if profile.grades_value else 0.0,
        income=float(profile.income) if profile.income else 0.0,
        category=profile.category or "",
        minorityStatus=profile.minority_status or False,
        disabilityStatus=profile.disability_status or False,
        nationality=profile.nationality or "Indian",
        aadhaarAvailable=profile.aadhaar_available or False,
        skills=skills_list,
        certifications=profile.certifications or "",
        projects=profile.projects or "",
        researchPapers=profile.research_papers or "",
        publications=profile.publications or "",
        competitions=profile.competitions or "",
        olympiads=profile.olympiads or "",
        hackathons=profile.hackathons or "",
        internships=profile.internships or "",
        extracurriculars=profile.extracurriculars or "",
        sportsAchievements=profile.sports_achievements or ""
    )

@router.put("", response_model=ProfileSchema)
def update_profile(profile_in: ProfileSchema, current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.profile
    
    parsed_dob = None
    if profile_in.dob:
        try:
            parsed_dob = datetime.strptime(profile_in.dob, "%Y-%m-%d").date()
        except Exception:
            parsed_dob = None

    skills_json = json.dumps(profile_in.skills)

    if not profile:
        profile = StudentProfile(
            student_id=current_user.id,
            gender=profile_in.gender,
            dob=parsed_dob,
            mobile=profile_in.mobile,
            state=profile_in.state,
            district=profile_in.district,
            city_town_village=profile_in.cityTownVillage,
            pin_code=profile_in.pinCode,
            education_level=profile_in.educationLevel,
            course_name=profile_in.courseName,
            specialization=profile_in.specialization,
            institution_name=profile_in.institutionName,
            university_board=profile_in.universityBoard,
            current_year_semester=profile_in.currentYearSemester,
            grading_scale=profile_in.gradingScale,
            grades_value=profile_in.gradesValue,
            income=profile_in.income,
            category=profile_in.category,
            minority_status=profile_in.minorityStatus,
            disability_status=profile_in.disabilityStatus,
            nationality=profile_in.nationality,
            aadhaar_available=profile_in.aadhaarAvailable,
            skills=skills_json,
            certifications=profile_in.certifications,
            projects=profile_in.projects,
            research_papers=profile_in.researchPapers,
            publications=profile_in.publications,
            competitions=profile_in.competitions,
            olympiads=profile_in.olympiads,
            hackathons=profile_in.hackathons,
            internships=profile_in.internships,
            extracurriculars=profile_in.extracurriculars,
            sports_achievements=profile_in.sportsAchievements
        )
        db.add(profile)
    else:
        profile.gender = profile_in.gender
        profile.dob = parsed_dob
        profile.mobile = profile_in.mobile
        profile.state = profile_in.state
        profile.district = profile_in.district
        profile.city_town_village = profile_in.cityTownVillage
        profile.pin_code = profile_in.pinCode
        profile.education_level = profile_in.educationLevel
        profile.course_name = profile_in.courseName
        profile.specialization = profile_in.specialization
        profile.institution_name = profile_in.institutionName
        profile.university_board = profile_in.universityBoard
        profile.current_year_semester = profile_in.currentYearSemester
        profile.grading_scale = profile_in.gradingScale
        profile.grades_value = profile_in.gradesValue
        profile.income = profile_in.income
        profile.category = profile_in.category
        profile.minority_status = profile_in.minorityStatus
        profile.disability_status = profile_in.disabilityStatus
        profile.nationality = profile_in.nationality
        profile.aadhaar_available = profile_in.aadhaarAvailable
        profile.skills = skills_json
        profile.certifications = profile_in.certifications
        profile.projects = profile_in.projects
        profile.research_papers = profile_in.researchPapers
        profile.publications = profile_in.publications
        profile.competitions = profile_in.competitions
        profile.olympiads = profile_in.olympiads
        profile.hackathons = profile_in.hackathons
        profile.internships = profile_in.internships
        profile.extracurriculars = profile_in.extracurriculars
        profile.sports_achievements = profile_in.sportsAchievements

    current_user.name = profile_in.name
    db.add(current_user)
    
    db.commit()
    return profile_in
