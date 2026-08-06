import json
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.student import Student
from app.models.scholarship import Scholarship
from app.api.deps import get_current_user
from app.api.recommendations import calculate_match
from app.schemas.scholarship import to_scholarship_out

router = APIRouter(prefix="/advisor", tags=["advisor"])

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat_advisor(
    req: ChatRequest,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        raise HTTPException(status_code=400, detail="Please complete your student profile first.")

    user_msg = req.message.strip().lower()

    # Query active scholarships and calculate real match scores
    all_scholarships = db.query(Scholarship).filter(Scholarship.status == "Active").all()

    eligible_scholarships = []
    ineligible_scholarships = []

    for s in all_scholarships:
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
        if fit["is_eligible"]:
            eligible_scholarships.append(s_out)
        else:
            ineligible_scholarships.append(s_out)

    eligible_scholarships.sort(key=lambda x: x["match"], reverse=True)

    # Contextual Intent Engine (Deterministic & Grounded on Verified DB Data)
    if "suit" in user_msg or "best" in user_msg or "recommend" in user_msg or "match" in user_msg:
        if not eligible_scholarships:
            reply = "Currently, no active scholarships match 100% of your eligibility criteria. Try updating your profile CGPA or family income details to unlock new matches."
        else:
            top_3 = eligible_scholarships[:3]
            lines = [f"Based on your profile ({profile.course_name or 'Undergraduate'}, CGPA {profile.grades_value or 0}, Income ₹{int(profile.income or 0):,}), here are top verified scholarships for you:\n"]
            for idx, s in enumerate(top_3, 1):
                lines.append(f"{idx}. **{s['name']}** ({s['provider']})\n   - **Award**: ₹{int(s['amount']):,}/year | **Match**: {s['match']}%\n   - **Deadline**: {s['deadline']}\n   - **Why you match**: {', '.join(s['reasons'][:2])}\n")
            reply = "\n".join(lines)

    elif "why am i eligible" in user_msg or "why eligible" in user_msg:
        if not eligible_scholarships:
            reply = "You are currently not eligible for active scholarships in the catalog due to specific criteria restrictions."
        else:
            s = eligible_scholarships[0]
            reply = (
                f"You are eligible for **{s['name']}** because:\n"
                f"- Your academic performance ({profile.grades_value or 0} CGPA) meets or exceeds the required {s['minCgpa']} CGPA.\n"
                f"- Your annual family income (₹{int(profile.income or 0):,}) is within the allowed limit of ₹{int(s['maxIncome']):,}.\n"
                f"- Your domicile ({profile.state or 'All India'}) and category ({profile.category or 'General'}) satisfy the eligibility criteria."
            )

    elif "why am i not eligible" in user_msg or "not eligible" in user_msg or "ineligible" in user_msg:
        if not ineligible_scholarships:
            reply = "Great news! You are eligible for all active scholarships currently listed in MeritMind."
        else:
            s = ineligible_scholarships[0]
            reply = (
                f"For instance, you are currently not eligible for **{s['name']}** because:\n"
                f"- **Reason**: {s.get('ineligibleReason', 'Eligibility criteria mismatch')}\n"
                f"- **Rule Breakdown**:\n" +
                "\n".join([f"  • {c['rule']}: {c['detail']}" for c in s.get('ruleChecks', []) if not c['passed']])
            )

    elif "document" in user_msg or "documents" in user_msg or "vault" in user_msg or "upload" in user_msg:
        if eligible_scholarships:
            s = eligible_scholarships[0]
            docs = s.get('documents', ["Class 10th & 12th Marksheets", "Income Certificate", "Bonafide Student Certificate", "Aadhaar Card"])
            reply = (
                f"For scholarships like **{s['name']}**, you typically need to upload:\n" +
                "\n".join([f"- {d}" for d in docs]) +
                "\n\nYou can safely store all these documents in your **MeritMind Document Vault** for easy reference."
            )
        else:
            reply = "Standard required documents include Aadhaar Card, Income Certificate, Bonafide Student Certificate, Class 10/12 Marksheets, and Caste/Category Certificate."

    elif "close" in user_msg or "deadline" in user_msg or "soon" in user_msg or "expir" in user_msg:
        closing_soon = sorted(all_scholarships, key=lambda x: x.deadline)[:3]
        lines = ["Here are the scholarships closing earliest:\n"]
        for idx, s in enumerate(closing_soon, 1):
            lines.append(f"{idx}. **{s.name}** – Deadline: **{s.deadline}** (Provider: {s.provider})")
        reply = "\n".join(lines)

    elif "improve" in user_msg or "profile" in user_msg or "score" in user_msg:
        reply = (
            "To maximize your scholarship match scores and unlock higher grant tiers:\n"
            "1. **Complete Academic Marks**: Ensure your exact CGPA/Percentage is updated.\n"
            "2. **Add Certifications & Projects**: Add relevant technical skills, hackathons, and certifications in your profile.\n"
            "3. **Upload Key Documents**: Keep your Income Certificate and Bonafide Certificate saved in your Document Vault."
        )

    else:
        top_match = eligible_scholarships[0] if eligible_scholarships else None
        if top_match:
            reply = (
                f"Hello {current_user.name}! I am your MeritMind AI Advisor.\n"
                f"Based on your profile, your top matching scholarship is **{top_match['name']}** ({top_match['match']}% Match, Award ₹{int(top_match['amount']):,}/year).\n\n"
                "You can ask me questions like:\n"
                "- *Which scholarships suit me best?*\n"
                "- *Why am I eligible or not eligible?*\n"
                "- *Which scholarships close soon?*\n"
                "- *What documents do I need to prepare?*"
            )
        else:
            reply = (
                f"Hello {current_user.name}! I am your MeritMind AI Advisor.\n"
                "You can ask me questions about scholarship eligibility, required documents, upcoming deadlines, and profile improvements!"
            )

    return {
        "reply": reply,
        "eligibleCount": len(eligible_scholarships),
        "totalCatalogCount": len(all_scholarships)
    }
