import json
import logging
from datetime import date
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.scholarship import Scholarship

logger = logging.getLogger("meritmind.processor")

def normalize_value(val: str, mapping: Dict[str, str], default: str) -> str:
    if not val:
        return default
    v_clean = val.strip().title()
    return mapping.get(v_clean, val.strip())

STATE_MAP = {
    "All India": "All India",
    "Pan India": "All India",
    "India": "All India",
    "Mah": "Maharashtra",
    "Kar": "Karnataka",
    "Up": "Uttar Pradesh",
    "U.P.": "Uttar Pradesh",
    "Dl": "Delhi",
    "Ne": "North Eastern States"
}

CATEGORY_MAP = {
    "Need Based": "Need-based",
    "Financial Need": "Need-based",
    "Girl": "Girls",
    "Women": "Girls",
    "Female": "Girls",
    "Minorities": "Minority"
}

EDUCATION_MAP = {
    "Ug": "Undergraduate",
    "Pg": "Postgraduate",
    "Degree": "Undergraduate",
    "Master": "Postgraduate",
    "Phd": "PhD"
}

def clean_record(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Cleans, normalizes, and validates a scholarship record dictionary.
    """
    cleaned = dict(raw)
    
    # State normalization
    cleaned["state"] = STATE_MAP.get(cleaned.get("state", "All India"), cleaned.get("state", "All India"))
    
    # Category normalization
    cleaned["category"] = CATEGORY_MAP.get(cleaned.get("category", "Merit"), cleaned.get("category", "Merit"))
    
    # Currency normalization
    cleaned["currency"] = cleaned.get("currency", "₹") or "₹"
    
    # Ensure deadline is formatted ISO string
    dl = cleaned.get("deadline")
    if isinstance(dl, date):
        cleaned["deadline"] = dl.isoformat()
    elif not dl:
        cleaned["deadline"] = (date.today() + timedelta(days=30)).isoformat()
        
    # Serialize list fields to JSON strings for DB storage
    for list_field in ["benefits", "eligibility", "documents", "branches", "education_levels", "selection_process"]:
        val = cleaned.get(list_field, [])
        if isinstance(val, list):
            cleaned[list_field] = json.dumps(val)
        elif not val:
            cleaned[list_field] = json.dumps([])
            
    return cleaned

def process_and_upsert_scholarships(db: Session, records: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Processes, cleans, deduplicates, and upserts raw collector records into MySQL database.
    Marks expired scholarships as Inactive.
    """
    inserted = 0
    updated = 0
    expired = 0
    today = date.today()

    seen_ids = set()

    for raw in records:
        rec = clean_record(raw)
        sid = rec["id"]
        
        if sid in seen_ids:
            continue
        seen_ids.add(sid)

        # Check deadline status
        rec_deadline = date.fromisoformat(rec["deadline"]) if isinstance(rec["deadline"], str) else rec["deadline"]
        is_expired = rec_deadline < today
        rec_status = "Inactive" if is_expired else rec.get("status", "Active")
        
        if is_expired:
            expired += 1

        existing = db.query(Scholarship).filter(Scholarship.id == sid).first()

        if existing:
            existing.name = rec["name"]
            existing.provider = rec["provider"]
            existing.logo = rec.get("logo", "🏛️")
            existing.amount = rec["amount"]
            existing.currency = rec["currency"]
            existing.deadline = rec_deadline
            existing.category = rec["category"]
            existing.sector = rec["sector"]
            existing.state = rec["state"]
            existing.max_income = rec["max_income"]
            existing.min_cgpa = rec["min_cgpa"]
            existing.for_women = rec.get("for_women", False)
            existing.for_minority = rec.get("for_minority", False)
            existing.for_disability = rec.get("for_disability", False)
            existing.official_website = rec.get("official_website", "")
            existing.official_apply_url = rec.get("official_apply_url", rec.get("official_website", ""))
            existing.source_collector = rec.get("source_collector", "official_source")
            existing.summary = rec.get("summary", "")
            existing.overview = rec.get("overview", "")
            existing.benefits = rec.get("benefits")
            existing.eligibility = rec.get("eligibility")
            existing.documents = rec.get("documents")
            existing.branches = rec.get("branches")
            existing.education_levels = rec.get("education_levels")
            existing.selection_process = rec.get("selection_process")
            existing.status = rec_status
            updated += 1
        else:
            db_s = Scholarship(
                id=sid,
                name=rec["name"],
                provider=rec["provider"],
                logo=rec.get("logo", "🏛️"),
                amount=rec["amount"],
                currency=rec["currency"],
                deadline=rec_deadline,
                category=rec["category"],
                sector=rec["sector"],
                state=rec["state"],
                max_income=rec["max_income"],
                min_cgpa=rec["min_cgpa"],
                for_women=rec.get("for_women", False),
                for_minority=rec.get("for_minority", False),
                for_disability=rec.get("for_disability", False),
                official_website=rec.get("official_website", ""),
                official_apply_url=rec.get("official_apply_url", rec.get("official_website", "")),
                source_collector=rec.get("source_collector", "official_source"),
                summary=rec.get("summary", ""),
                overview=rec.get("overview", ""),
                benefits=rec.get("benefits"),
                eligibility=rec.get("eligibility"),
                documents=rec.get("documents"),
                branches=rec.get("branches"),
                education_levels=rec.get("education_levels"),
                selection_process=rec.get("selection_process"),
                status=rec_status
            )
            db.add(db_s)
            inserted += 1

    # Check database for any older scholarships whose deadline passed
    all_active = db.query(Scholarship).filter(Scholarship.status == "Active").all()
    for s in all_active:
        if s.deadline and s.deadline < today:
            s.status = "Inactive"
            expired += 1

    db.commit()

    logger.info(f"Scholarship Processing Done: Inserted {inserted}, Updated {updated}, Expired {expired}")
    return {
        "inserted": inserted,
        "updated": updated,
        "expired": expired,
        "total_processed": len(records)
    }
