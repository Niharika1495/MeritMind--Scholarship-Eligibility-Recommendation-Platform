from typing import List, Dict, Any
from datetime import date, timedelta
from app.collectors.base import BaseCollector

class UGCCollector(BaseCollector):
    source_name = "UGC Official Portal"

    def collect(self) -> List[Dict[str, Any]]:
        today = date.today()
        return [
            self.create_record(
                id="ugc-ishan-uday-ner",
                name="UGC Ishan Uday Special Scholarship Scheme for North Eastern Region",
                provider="University Grants Commission (UGC)",
                amount=94000.0,
                deadline=(today + timedelta(days=35)).isoformat(),
                category="Merit",
                sector="Government",
                state="North Eastern States",
                max_income=450000.0,
                min_cgpa=6.5,
                official_website="https://www.ugc.ac.in",
                official_apply_url="https://scholarships.gov.in",
                summary="Special scholarship for students domicile of North Eastern Region pursuing general or technical degree courses.",
                overview="Promotes higher education in the North East region by offering 10,000 fresh scholarships every year.",
                logo="🏔️",
                benefits=[
                    "₹5,400 per month for general degree courses",
                    "₹7,800 per month for technical/medical/professional courses"
                ],
                eligibility=[
                    "Domicile of North Eastern States (Assam, Arunachal, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim)",
                    "Passed Class 12th from recognized board",
                    "Annual family income less than ₹4.5 Lakh"
                ],
                documents=[
                    "Domicile Certificate of NER State",
                    "Income Certificate",
                    "Class 12th Marksheet",
                    "Aadhaar card"
                ],
                branches=["All branches"],
                education_levels=["Undergraduate"]
            ),
            self.create_record(
                id="ugc-single-girl-child-pg",
                name="Post-Graduate Indira Gandhi Scholarship for Single Girl Child",
                provider="University Grants Commission (UGC)",
                amount=36200.0,
                deadline=(today + timedelta(days=28)).isoformat(),
                category="Girls",
                sector="Government",
                state="All India",
                max_income=1000000.0,
                min_cgpa=6.0,
                official_website="https://www.ugc.ac.in",
                official_apply_url="https://scholarships.gov.in",
                summary="Supporting single girl child in families to pursue post-graduate education in non-professional streams.",
                overview="Compensates costs of higher education for single girl children in families.",
                logo="🎓",
                for_women=True,
                benefits=[
                    "₹3,620 per month for 2 years (duration of PG course)"
                ],
                eligibility=[
                    "Girl child who is the only child of her parents",
                    "Admitted to 1st year PG regular non-professional master's program",
                    "Age should not be more than 30 years at admission"
                ],
                documents=[
                    "Affidavit on ₹50 stamp paper stating single girl child status",
                    "UG Marksheet",
                    "PG Admission Bonafide certificate"
                ],
                branches=["Arts", "Science", "Commerce", "Humanities"],
                education_levels=["Postgraduate"]
            )
        ]
