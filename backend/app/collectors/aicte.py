from typing import List, Dict, Any
from datetime import date, timedelta
from app.collectors.base import BaseCollector

class AICTECollector(BaseCollector):
    source_name = "AICTE Official Portal"

    def collect(self) -> List[Dict[str, Any]]:
        today = date.today()
        return [
            self.create_record(
                id="aicte-pragati-women",
                name="AICTE Pragati Scholarship Scheme for Female Students",
                provider="All India Council for Technical Education (AICTE)",
                amount=50000.0,
                deadline=(today + timedelta(days=30)).isoformat(),
                category="Girls",
                sector="Government",
                state="All India",
                max_income=800000.0,
                min_cgpa=6.0,
                official_website="https://www.aicte-india.org/schemes/students-development-schemes",
                official_apply_url="https://scholarships.gov.in",
                summary="Supporting girl students to pursue technical education in AICTE approved diploma and degree institutions.",
                overview="Empowers young women to pursue degree and diploma technical education by providing financial assistance towards college fees and learning materials.",
                logo="👩‍💻",
                for_women=True,
                benefits=[
                    "₹50,000 per annum for maximum 4 years for first year degree students",
                    "Amount can be utilized for college fee payment, books, equipment, and soft skill training"
                ],
                eligibility=[
                    "Girl candidate admitted to 1st year of Degree/Diploma course in AICTE approved institution",
                    "Maximum two girl children per family eligible",
                    "Family income should not be more than ₹8 Lakh per annum"
                ],
                documents=[
                    "Class 10th and 12th Marksheet",
                    "Annual Family Income Certificate",
                    "Admission Letter issued by Directorate of Technical Education",
                    "Aadhaar seeded bank account details"
                ],
                branches=["Computer Science", "Electronics", "Information Technology", "Mechanical", "Electrical"],
                education_levels=["Undergraduate", "Diploma"]
            ),
            self.create_record(
                id="aicte-saksham-disability",
                name="AICTE Saksham Scholarship Scheme for Specially-Abled Students",
                provider="All India Council for Technical Education (AICTE)",
                amount=50000.0,
                deadline=(today + timedelta(days=45)).isoformat(),
                category="Merit",
                sector="Government",
                state="All India",
                max_income=800000.0,
                min_cgpa=0.0,
                official_website="https://www.aicte-india.org",
                official_apply_url="https://scholarships.gov.in",
                summary="Scholarship program specifically designed for specially-abled students pursuing technical degree or diploma courses.",
                overview="Encourages specially-abled students to pursue technical education without financial barriers.",
                logo="♿",
                for_disability=True,
                benefits=[
                    "₹50,000 per annum towards fees, purchase of laptop, software, assistive devices"
                ],
                eligibility=[
                    "Specially-abled student having disability of not less than 40%",
                    "Admitted to 1st year degree/diploma course in AICTE approved institute",
                    "Family income less than ₹8 Lakh per annum"
                ],
                documents=[
                    "Disability Certificate issued by competent medical authority",
                    "Income Certificate",
                    "Admission Proof"
                ],
                branches=["All branches"],
                education_levels=["Undergraduate", "Diploma"]
            ),
            self.create_record(
                id="aicte-swanath-scheme",
                name="AICTE Swanath Scholarship Scheme",
                provider="All India Council for Technical Education (AICTE)",
                amount=50000.0,
                deadline=(today + timedelta(days=20)).isoformat(),
                category="Need-based",
                sector="Government",
                state="All India",
                max_income=800000.0,
                min_cgpa=0.0,
                official_website="https://www.aicte-india.org",
                official_apply_url="https://scholarships.gov.in",
                summary="Assistance to Orphans, children whose parents died due to Covid-19, and wards of Armed Forces martyrs.",
                overview="Financial assistance and support to vulnerable students pursuing higher technical education.",
                logo="🛡️",
                benefits=[
                    "₹50,000 per annum for tuition fee reimbursement and incidentals"
                ],
                eligibility=[
                    "Student should be Orphan OR parents died due to Covid-19 OR ward of Armed Forces/Paramilitary martyred in action",
                    "Family income less than ₹8 Lakh per annum",
                    "Enrolled in AICTE approved college"
                ],
                documents=[
                    "Death certificate of parents / Martyr certificate",
                    "Income certificate",
                    "College bonafide certificate"
                ],
                branches=["All branches"],
                education_levels=["Undergraduate", "Diploma"]
            )
        ]
