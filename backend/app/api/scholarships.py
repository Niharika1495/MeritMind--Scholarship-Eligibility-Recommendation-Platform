from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.scholarship import Scholarship
from app.models.student import Student
from app.schemas.scholarship import ScholarshipOut, to_scholarship_out
from app.api.recommendations import calculate_match
from app.core.security import decode_access_token
from typing import List, Optional
import json

router = APIRouter(prefix="/scholarships", tags=["scholarships"])

def get_optional_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[Student]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    email = decode_access_token(token)
    if not email:
        return None
    return db.query(Student).filter(Student.email == email).first()

@router.get("")
def list_scholarships(
    search: str = "",
    sort: str = "match",
    page: int = 1,
    pageSize: int = 6,
    categories: List[str] = Query([]),
    sectors: List[str] = Query([]),
    states: List[str] = Query([]),
    db: Session = Depends(get_db),
    current_user: Optional[Student] = Depends(get_optional_user)
):
    query = db.query(Scholarship).filter(Scholarship.status == "Active")
    
    if search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (Scholarship.name.like(term)) |
            (Scholarship.provider.like(term)) |
            (Scholarship.summary.like(term))
        )
        
    if categories:
        query = query.filter(Scholarship.category.in_(categories))
        
    if sectors:
        query = query.filter(Scholarship.sector.in_(sectors))

    if states:
        query = query.filter((Scholarship.state.in_(states)) | (Scholarship.state == "All India"))
        
    # Sorting
    if sort == "deadline":
        query = query.order_by(Scholarship.deadline.asc())
    elif sort == "amount":
        query = query.order_by(Scholarship.amount.desc())
    elif sort == "alpha":
        query = query.order_by(Scholarship.name.asc())
    elif sort == "newest":
        query = query.order_by(Scholarship.created_at.desc())
    else:
        query = query.order_by(Scholarship.amount.desc())
        
    total = query.count()
    start = (page - 1) * pageSize
    items = query.offset(start).limit(pageSize).all()
    
    serialized = []
    profile = current_user.profile if current_user else None

    for x in items:
        if profile:
            fit = calculate_match(x, profile, db)
            serialized.append(to_scholarship_out(
                x,
                match=fit["match"],
                reasons=fit["reasons"],
                missing=fit["missing"],
                is_eligible=fit["is_eligible"],
                ineligible_reason=fit["ineligible_reason"],
                rule_checks=fit["rule_checks"],
                match_tier=fit["match_tier"]
            ))
        else:
            serialized.append(to_scholarship_out(x))
    
    return {
        "items": serialized,
        "page": page,
        "pageSize": pageSize,
        "total": total,
        "hasMore": start + len(items) < total
    }

@router.get("/suggest")
def suggest_scholarships(term: str = "", db: Session = Depends(get_db)):
    t = term.strip().lower()
    if not t:
        return []
        
    # Query matching scholarships
    results = db.query(Scholarship).filter(
        (Scholarship.name.like(f"%{t}%")) |
        (Scholarship.provider.like(f"%{t}%")) |
        (Scholarship.category.like(f"%{t}%")) |
        (Scholarship.state.like(f"%{t}%"))
    ).limit(7).all()
    
    suggestions = []
    seen = set()
    
    for s in results:
        if s.name.lower().find(t) != -1 and s.name not in seen:
            suggestions.append({"value": s.name, "kind": "Scholarship"})
            seen.add(s.name)
        if s.provider.lower().find(t) != -1 and s.provider not in seen:
            suggestions.append({"value": s.provider, "kind": "Provider"})
            seen.add(s.provider)
        if s.category.lower().find(t) != -1 and s.category not in seen:
            suggestions.append({"value": s.category, "kind": "Category"})
            seen.add(s.category)
            
    return suggestions[:7]

@router.get("/facets")
def get_facets(db: Session = Depends(get_db)):
    all_s = db.query(Scholarship).all()
    
    providers = sorted(list(set(s.provider for s in all_s)))
    categories = sorted(list(set(s.category for s in all_s)))
    states = sorted(list(set(s.state for s in all_s)))
    
    all_branches = set()
    for s in all_s:
        if s.branches:
            try:
                branches_list = json.loads(s.branches)
                for b in branches_list:
                    all_branches.add(b)
            except Exception:
                pass
                
    return {
        "providers": providers,
        "categories": categories,
        "states": states,
        "branches": sorted(list(all_branches)),
        "sectors": ["Government", "Private"]
    }

@router.post("/trigger-collection")
def trigger_collection(db: Session = Depends(get_db)):
    from app.collectors.scheduler import run_all_collectors
    result = run_all_collectors()
    return result

@router.get("/collector-status")
def collector_status(db: Session = Depends(get_db)):
    active_count = db.query(Scholarship).filter(Scholarship.status == "Active").count()
    inactive_count = db.query(Scholarship).filter(Scholarship.status == "Inactive").count()
    total_count = db.query(Scholarship).count()
    
    collectors_list = [
        "National Scholarship Portal (NSP)",
        "AICTE Official Portal",
        "UGC Official Portal",
        "State Government Portals",
        "Official University Portals",
        "Philanthropic Foundations",
        "Corporate CSR Programs"
    ]
    
    return {
        "engine": "MeritMind Automatic Collector Engine",
        "active_scholarships": active_count,
        "inactive_scholarships": inactive_count,
        "total_scholarships": total_count,
        "active_collectors": collectors_list
    }

@router.get("/nl-search")
def natural_language_search(query: str = Query(""), db: Session = Depends(get_db)):
    q = query.strip().lower()
    
    extracted_states = []
    known_states = ["Maharashtra", "Karnataka", "Uttar Pradesh", "Delhi", "Tamil Nadu", "Kerala", "Assam", "West Bengal", "Gujarat"]
    for st in known_states:
        if st.lower() in q:
            extracted_states.append(st)

    extracted_categories = []
    if "girl" in q or "female" in q or "women" in q:
        extracted_categories.append("Girls")
    if "sc" in q or "st" in q or "minority" in q:
        extracted_categories.append("Minority")
    if "merit" in q or "cgpa" in q or "marks" in q:
        extracted_categories.append("Merit")
    if "need" in q or "income" in q or "poor" in q:
        extracted_categories.append("Need-based")

    # Search in database
    db_q = db.query(Scholarship).filter(Scholarship.status == "Active")
    if extracted_states:
        db_q = db_q.filter((Scholarship.state.in_(extracted_states)) | (Scholarship.state == "All India"))
    if extracted_categories:
        db_q = db_q.filter(Scholarship.category.in_(extracted_categories))

    # Keyword terms fallback
    terms = [w for w in q.split() if w not in ["scholarships", "scholarship", "for", "in", "below", "students", "and", "or", "to", "lakh", "income"]]
    if terms:
        for t in terms[:2]:
            db_q = db_q.filter(
                (Scholarship.name.like(f"%{t}%")) |
                (Scholarship.provider.like(f"%{t}%")) |
                (Scholarship.summary.like(f"%{t}%")) |
                (Scholarship.branches.like(f"%{t}%"))
            )

    results = db_q.limit(10).all()
    return {
        "query": query,
        "parsedFilters": {
            "states": extracted_states,
            "categories": extracted_categories,
            "keywords": terms
        },
        "items": [to_scholarship_out(s) for s in results]
    }

@router.get("/{id}")
def read_scholarship(id: str, db: Session = Depends(get_db), current_user: Optional[Student] = Depends(get_optional_user)):
    s = db.query(Scholarship).filter(Scholarship.id == id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scholarship not found")
        
    profile = current_user.profile if current_user else None
    if profile:
        fit = calculate_match(s, profile, db)
        return to_scholarship_out(
            s,
            match=fit["match"],
            reasons=fit["reasons"],
            missing=fit["missing"],
            is_eligible=fit["is_eligible"],
            ineligible_reason=fit["ineligible_reason"],
            rule_checks=fit["rule_checks"],
            match_tier=fit["match_tier"]
        )
    return to_scholarship_out(s)

@router.get("/{id}/related")
def read_related(id: str, db: Session = Depends(get_db)):
    base = db.query(Scholarship).filter(Scholarship.id == id).first()
    if not base:
        return []
        
    related = db.query(Scholarship).filter(
        (Scholarship.id != id) &
        ((Scholarship.category == base.category) | (Scholarship.sector == base.sector) | (Scholarship.state == base.state))
    ).limit(3).all()
    
    return [to_scholarship_out(x) for x in related]
