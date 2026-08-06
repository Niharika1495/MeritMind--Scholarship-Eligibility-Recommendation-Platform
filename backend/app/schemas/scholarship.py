from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ScholarshipBase(BaseModel):
    id: str
    name: str
    provider: str
    logo: str
    amount: float
    currency: str = "₹"
    deadline: str
    category: str
    sector: str
    state: str
    maxIncome: float
    minCgpa: float
    forWomen: bool
    forMinority: bool
    forDisability: bool
    official: str
    officialApplyUrl: Optional[str] = ""
    sourceCollector: Optional[str] = "official_source"
    tags: List[str] = []
    summary: str
    overview: str
    benefits: List[str] = []
    eligibility: List[str] = []
    documents: List[str] = []
    branches: List[str] = []
    educationLevels: List[str] = []
    successProbability: int = 75
    addedAt: str = ""
    timeline: List[Dict[str, Any]] = []
    selectionProcess: List[str] = []
    faqs: List[Dict[str, Any]] = []
    status: str = "Active"

class ScholarshipOut(ScholarshipBase):
    match: int = 0
    isEligible: bool = True
    ineligibleReason: str = ""
    ruleChecks: List[Dict[str, Any]] = []
    matchTier: str = "Eligible"
    reasons: List[str] = []
    missing: List[str] = []
    deadlinePriority: str = "Open"

    class Config:
        from_attributes = True
        populate_by_name = True

import json
from datetime import date

def to_scholarship_out(db_s, match=0, reasons=None, missing=None, deadline_priority=None, is_eligible=True, ineligible_reason="", rule_checks=None, match_tier="Eligible") -> dict:
    if reasons is None:
        reasons = []
    if missing is None:
        missing = []
    if rule_checks is None:
        rule_checks = []
    
    def safe_json(val):
        if not val:
            return []
        if isinstance(val, list):
            return val
        try:
            return json.loads(val)
        except Exception:
            return []

    # Calculate deadline priority if not explicitly provided
    if not deadline_priority:
        try:
            s_dl = db_s.deadline if isinstance(db_s.deadline, date) else date.fromisoformat(str(db_s.deadline))
            days = (s_dl - date.today()).days
            if days <= 7:
                deadline_priority = "Urgent"
            elif days <= 30:
                deadline_priority = "Closing Soon"
            else:
                deadline_priority = "Open"
        except Exception:
            deadline_priority = "Open"

    def ensure_url_prefix(url_val: str) -> str:
        if not url_val:
            return "https://scholarships.gov.in"
        u = str(url_val).strip()
        if not (u.startswith("http://") or u.startswith("https://")):
            return f"https://{u}"
        return u

    official_link = ensure_url_prefix(db_s.official_website)
    apply_url = ensure_url_prefix(getattr(db_s, "official_apply_url", None) or db_s.official_website)

    selection_proc = safe_json(getattr(db_s, "selection_process", None))
    if not selection_proc:
        selection_proc = [
            "Automated eligibility screening against your profile",
            "Institute verification of academic credentials",
            f"Final selection decision by {db_s.provider}"
        ]

    return {
        "id": db_s.id,
        "name": db_s.name,
        "provider": db_s.provider,
        "logo": db_s.logo or "🔷",
        "amount": float(db_s.amount),
        "currency": db_s.currency,
        "deadline": db_s.deadline.isoformat() if hasattr(db_s.deadline, "isoformat") else str(db_s.deadline),
        "category": db_s.category,
        "sector": db_s.sector,
        "state": db_s.state,
        "maxIncome": float(db_s.max_income),
        "minCgpa": float(db_s.min_cgpa),
        "forWomen": db_s.for_women,
        "forMinority": db_s.for_minority,
        "forDisability": db_s.for_disability,
        "official": official_link,
        "officialApplyUrl": apply_url,
        "sourceCollector": getattr(db_s, "source_collector", "official_source") or "official_source",
        "tags": [db_s.sector, db_s.category] + (["Women in Tech"] if db_s.for_women else []) + (["High Value"] if float(db_s.amount) >= 50000 else []),
        "summary": db_s.summary or "",
        "overview": db_s.overview or "",
        "benefits": safe_json(db_s.benefits),
        "eligibility": safe_json(db_s.eligibility),
        "documents": safe_json(db_s.documents),
        "branches": safe_json(db_s.branches),
        "educationLevels": safe_json(db_s.education_levels),
        "successProbability": int(getattr(db_s, "success_probability", 75)) if hasattr(db_s, "success_probability") else 75,
        "addedAt": db_s.created_at.isoformat().split("T")[0] if hasattr(db_s.created_at, "isoformat") else "",
        "timeline": [
            { "label": "Applications open", "date": (db_s.created_at.date().isoformat() if hasattr(db_s.created_at, "date") else "2026-08-01"), "done": True },
            { "label": "Document verification", "date": (db_s.deadline.isoformat() if hasattr(db_s.deadline, "isoformat") else str(db_s.deadline)), "done": False },
            { "label": "Last date to apply", "date": (db_s.deadline.isoformat() if hasattr(db_s.deadline, "isoformat") else str(db_s.deadline)), "done": False }
        ],
        "selectionProcess": selection_proc,
        "faqs": [
            { "q": "Can I hold another scholarship?", "a": "Yes, one private and one government scholarship can usually be held concurrently." }
        ],
        "status": db_s.status,
        "match": match if is_eligible else 0,
        "isEligible": is_eligible,
        "ineligibleReason": ineligible_reason,
        "ruleChecks": rule_checks,
        "matchTier": match_tier if is_eligible else "Not Eligible",
        "reasons": reasons,
        "missing": missing,
        "deadlinePriority": deadline_priority
    }
