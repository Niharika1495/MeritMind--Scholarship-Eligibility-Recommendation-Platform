from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.student import Student
from app.models.scholarship import Scholarship
from app.schemas.scholarship import to_scholarship_out
from app.api.deps import get_current_user
from typing import List, Dict, Any
import json
from datetime import date

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

def calculate_match(s: Scholarship, p, db: Session) -> dict:
    rule_checks = []
    
    # Extract student profile attributes
    student_edu = (p.education_level or "Undergraduate").strip()
    student_course = (p.course_name or "").strip()
    student_specialization = (p.specialization or "").strip()
    student_category = (p.category or "General").strip()
    student_gender = (p.gender or "").strip()
    student_state = (p.state or "").strip()
    student_income = float(p.income or 0)
    
    cgpa = float(p.grades_value or 0)
    if getattr(p, "grading_scale", None) == "Percentage":
        cgpa = cgpa / 10.0
        
    student_disability = bool(p.disability_status)
    student_minority = bool(p.minority_status)

    # 1. Education Level Rule
    s_edu = []
    if s.education_levels:
        try:
            s_edu = json.loads(s.education_levels) if isinstance(s.education_levels, str) else s.education_levels
        except Exception:
            s_edu = []
    passed_edu = not s_edu or student_edu in s_edu or ("Undergraduate" in s_edu and student_edu in ["Undergraduate", "UG"])
    rule_checks.append({
        "rule": "Education Level",
        "label": f"Education Level ({student_edu})",
        "passed": passed_edu,
        "detail": f"Requires: {', '.join(s_edu)}" if s_edu else "Open to all levels"
    })
    
    # 2. Course / Branch Rule
    s_branches = []
    if s.branches:
        try:
            s_branches = json.loads(s.branches) if isinstance(s.branches, str) else s.branches
        except Exception:
            s_branches = []
    passed_branch = (
        not s_branches or
        "All branches" in s_branches or
        student_specialization in s_branches or
        any(b.lower() in student_course.lower() for b in s_branches) or
        student_edu in ["School", "Intermediate"]
    )
    rule_checks.append({
        "rule": "Course / Branch",
        "label": f"Course/Branch ({student_specialization or student_course or 'General'})",
        "passed": passed_branch,
        "detail": f"Targeted branches: {', '.join(s_branches[:3])}" if s_branches else "All branches eligible"
    })
    
    # 3. Social Category Rule
    s_cat = (s.category or "Merit").strip()
    passed_category = True
    cat_reason = ""
    
    s_name_upper = s.name.upper()
    if s_cat.upper() in ["SC", "SCHEDULED CASTE"] or "SC ONLY" in s_name_upper or "FOR SC" in s_name_upper:
        passed_category = student_category.upper() in ["SC", "SCHEDULED CASTE"]
        cat_reason = "Reserved for SC Category"
    elif s_cat.upper() in ["ST", "SCHEDULED TRIBE"] or "FOR ST" in s_name_upper:
        passed_category = student_category.upper() in ["ST", "SCHEDULED TRIBE"]
        cat_reason = "Reserved for ST Category"
    elif s_cat.upper() in ["OBC", "OBC-NCL"] or "FOR OBC" in s_name_upper:
        passed_category = student_category.upper() in ["OBC", "OBC-NCL"]
        cat_reason = "Reserved for OBC Category"
    elif s_cat.upper() in ["EWS"] or "FOR EWS" in s_name_upper:
        passed_category = student_category.upper() in ["EWS"]
        cat_reason = "Reserved for EWS Category"
        
    rule_checks.append({
        "rule": "Social Category",
        "label": f"Category ({student_category})",
        "passed": passed_category,
        "detail": cat_reason if not passed_category else f"Eligible for {student_category} category"
    })

    # 4. Gender Rule
    passed_gender = True
    gender_reason = ""
    if s.for_women or s_cat == "Girls" or "WOMEN" in s_name_upper or "GIRL" in s_name_upper or "FEMALE" in s_name_upper:
        passed_gender = student_gender.lower() in ["female", "girl", "woman"]
        gender_reason = "Women Only"
    rule_checks.append({
        "rule": "Gender",
        "label": f"Gender ({student_gender or 'Not specified'})",
        "passed": passed_gender,
        "detail": gender_reason if not passed_gender else "Eligible"
    })

    # 5. State Domicile Rule
    s_state = (s.state or "All India").strip()
    passed_state = (s_state == "All India" or s_state.lower() == student_state.lower())
    rule_checks.append({
        "rule": "State Domicile",
        "label": f"State Residency ({student_state or 'All India'})",
        "passed": passed_state,
        "detail": f"Restricted to {s_state}" if not passed_state else "All India eligible"
    })

    # 6. Family Income Rule
    passed_income = student_income <= float(s.max_income)
    rule_checks.append({
        "rule": "Family Income",
        "label": f"Income (₹{int(student_income):,})",
        "passed": passed_income,
        "detail": f"Max limit ₹{float(s.max_income)/100000:.1f}L" if s.max_income >= 100000 else f"Max limit ₹{int(s.max_income)}"
    })

    # 7. Academic CGPA / Grade Rule
    passed_grades = cgpa >= float(s.min_cgpa)
    rule_checks.append({
        "rule": "Academic Benchmark",
        "label": f"CGPA ({cgpa:.1f})",
        "passed": passed_grades,
        "detail": f"Required benchmark: {s.min_cgpa} CGPA"
    })

    # 8. Disability Status Rule
    passed_disability = not s.for_disability or student_disability
    rule_checks.append({
        "rule": "Disability Status",
        "label": "Disability Status",
        "passed": passed_disability,
        "detail": "Requires Disability Certificate" if s.for_disability and not student_disability else "Eligible"
    })

    # 9. Minority Status Rule
    passed_minority = not s.for_minority or student_minority or student_category.lower() == "minority"
    rule_checks.append({
        "rule": "Minority Status",
        "label": "Minority Status",
        "passed": passed_minority,
        "detail": "Requires Certified Minority Proof" if s.for_minority and not passed_minority else "Eligible"
    })

    # Evaluate Mandatory Eligibility
    failed_checks = [c for c in rule_checks if not c["passed"]]
    is_eligible = len(failed_checks) == 0

    if not is_eligible:
        first_fail = failed_checks[0]
        if first_fail["rule"] == "Social Category":
            ineligible_reason = cat_reason or f"Reserved for {s_cat} Category"
        elif first_fail["rule"] == "Gender":
            ineligible_reason = "Women Only"
        elif first_fail["rule"] == "State Domicile":
            ineligible_reason = f"State Restriction ({s.state} only)"
        elif first_fail["rule"] == "Family Income":
            ineligible_reason = "Income Above Limit"
        elif first_fail["rule"] == "Academic Benchmark":
            ineligible_reason = f"CGPA Requirement Not Met ({s.min_cgpa}+ required)"
        elif first_fail["rule"] == "Education Level":
            ineligible_reason = "Education Level Mismatch"
        elif first_fail["rule"] == "Course / Branch":
            ineligible_reason = "Course Not Eligible"
        elif first_fail["rule"] == "Disability Status":
            ineligible_reason = "Requires Disability Status"
        elif first_fail["rule"] == "Minority Status":
            ineligible_reason = "Requires Minority Status"
        else:
            ineligible_reason = "Eligibility Criteria Not Satisfied"

        return {
            "is_eligible": False,
            "match": 0,
            "match_tier": "Not Eligible",
            "ineligible_reason": ineligible_reason,
            "rule_checks": rule_checks,
            "reasons": [],
            "missing": [c["detail"] for c in failed_checks[:4]]
        }

    # IF ALL 9 MANDATORY CHECKS PASS -> CALCULATE WEIGHTED MATCH SCORE
    cgpa_diff = max(0, cgpa - float(s.min_cgpa))
    academic_score = min(30, 20 + int(cgpa_diff * 3.5))

    income_ratio = min(1.0, student_income / float(s.max_income)) if float(s.max_income) > 0 else 0.5
    income_score = int(20 * (1.0 - (income_ratio * 0.5)))

    ach_count = len(getattr(p, "certifications", "") or "") + len(getattr(p, "hackathons", "") or "")
    ach_score = min(10, 5 + min(5, ach_count))

    skills_raw = p.skills
    skills_list = json.loads(skills_raw) if isinstance(skills_raw, str) and skills_raw else (skills_raw or [])
    skills_score = min(10, 5 + min(5, len(skills_list)))

    projects_score = 8 if (getattr(p, "projects", "") or "").strip() else 4
    certs_score = 5 if (getattr(p, "certifications", "") or "").strip() else 2
    research_score = 5 if (getattr(p, "research_papers", "") or "").strip() else 2
    strength_score = 5
    deadline_score = 5

    raw_total = academic_score + income_score + ach_score + skills_score + projects_score + certs_score + research_score + strength_score + deadline_score
    weighted_match = max(60, min(100, raw_total))

    if weighted_match >= 95:
        match_tier = "Highly Recommended"
    elif weighted_match >= 80:
        match_tier = "Excellent Match"
    elif weighted_match >= 70:
        match_tier = "Good Match"
    else:
        match_tier = "Average Match"

    reasons = [
        "Meets all mandatory eligibility criteria",
        f"Cleared benchmark ({s.min_cgpa} CGPA) with {cgpa:.1f} CGPA",
        f"Income (₹{int(student_income):,}) fits cap of ₹{float(s.max_income)/100000:.1f}L"
    ]

    return {
        "is_eligible": True,
        "match": weighted_match,
        "match_tier": match_tier,
        "ineligible_reason": "",
        "rule_checks": rule_checks,
        "reasons": reasons,
        "missing": []
    }

@router.get("")
def get_recommendations(current_user: Student = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.profile
    if not profile:
        return []
        
    all_s = db.query(Scholarship).filter(Scholarship.status == "Active").all()
    
    recommendations = []
    for s in all_s:
        fit = calculate_match(s, profile, db)
        s_out = to_scholarship_out(
            s,
            match=fit["match"],
            reasons=fit["reasons"],
            missing=fit["missing"],
            is_eligible=fit["is_eligible"],
            ineligible_reason=fit["ineligible_reason"],
            rule_checks=fit["rule_checks"],
            match_tier=fit["match_tier"]
        )
        rec = {
            "scholarship": s_out,
            "checks": fit["rule_checks"],
            "missing": fit["missing"]
        }
        recommendations.append(rec)
        
    # FOR YOU PAGE / RECOMMENDATIONS: EXCLUSIVELY INCLUDE ELIGIBLE SCHOLARSHIPS!
    eligible_recs = [r for r in recommendations if r["scholarship"]["isEligible"]]
    eligible_sorted = sorted(eligible_recs, key=lambda x: x["scholarship"]["match"], reverse=True)
    
    top_picks = eligible_sorted[:3]
    highly_rec = eligible_sorted[3:9]
    recent_s = sorted(eligible_recs, key=lambda x: x["scholarship"]["addedAt"], reverse=True)[:4]
    
    today = date.today()
    expiring = []
    for r in eligible_recs:
        try:
            s_deadline = date.fromisoformat(r["scholarship"]["deadline"])
            days_left = (s_deadline - today).days
            if 0 <= days_left <= 30:
                expiring.append(r)
        except Exception:
            pass
    expiring_sorted = sorted(expiring, key=lambda x: x["scholarship"]["deadline"])
    
    # Improve category: eligible items that have some missing non-mandatory polish recommendations
    improve = [r for r in eligible_recs if r["missing"]]
    improve_sorted = sorted(improve, key=lambda x: x["scholarship"]["match"], reverse=True)[:6]
    
    return [
        {
            "id": "top",
            "title": "Top matches",
            "caption": "Your strongest eligible picks, ranked by compatibility fit.",
            "items": top_picks
        },
        {
            "id": "highly",
            "title": "Highly recommended",
            "caption": "100% eligible scholarships worth applying for this week.",
            "items": highly_rec
        },
        {
            "id": "recent",
            "title": "Recently added",
            "caption": "Fresh listings collected from official sources.",
            "items": recent_s
        },
        {
            "id": "expiring",
            "title": "Expiring soon",
            "caption": "Closing within the next 30 days.",
            "items": expiring_sorted
        },
        {
            "id": "improve",
            "title": "Strengthen your profile",
            "caption": "Tips to boost your application odds.",
            "items": improve_sorted
        }
    ]
