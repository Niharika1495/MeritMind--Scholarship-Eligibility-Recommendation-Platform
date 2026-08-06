from typing import List, Dict, Any
from datetime import date, timedelta
from app.collectors.base import BaseCollector

class UniversityCollector(BaseCollector):
    source_name = "Official University Portals"

    def collect(self) -> List[Dict[str, Any]]:
        today = date.today()
        return [
            self.create_record(
                id="du-vc-student-financial-aid",
                name="University of Delhi Vice Chancellor Financial Support Scheme",
                provider="University of Delhi (DU)",
                amount=40000.0,
                deadline=(today + timedelta(days=21)).isoformat(),
                category="Need-based",
                sector="Government",
                state="Delhi",
                max_income=400000.0,
                min_cgpa=6.0,
                official_website="https://www.du.ac.in",
                official_apply_url="https://www.du.ac.in/index.php?page=financial-support-scheme",
                summary="Need-based fee waiver scheme for full-time undergraduate and postgraduate students at Delhi University.",
                overview="DU Vice Chancellor initiative offering up to 100% fee waiver for students from economically weaker sections.",
                logo="🏛️",
                benefits=[
                    "100% fee waiver for family income up to ₹4 Lakh",
                    "50% fee waiver for family income between ₹4 Lakh to ₹8 Lakh"
                ],
                eligibility=[
                    "Bona fide student of Delhi University department or college",
                    "Annual family income less than ₹8 Lakh",
                    "No active backlogs in previous semester"
                ],
                documents=[
                    "Family Income Certificate issued by SDM",
                    "Latest semester marksheet",
                    "Fee receipt of DU college"
                ],
                branches=["Arts", "Science", "Commerce", "Law", "Computer Science"],
                education_levels=["Undergraduate", "Postgraduate"]
            ),
            self.create_record(
                id="iit-merit-cum-means-aid",
                name="IIT Merit-cum-Means (MCM) Scholarship",
                provider="Indian Institutes of Technology (IITs)",
                amount=90000.0,
                deadline=(today + timedelta(days=50)).isoformat(),
                category="Merit",
                sector="Government",
                state="All India",
                max_income=500000.0,
                min_cgpa=7.0,
                official_website="https://www.iitb.ac.in",
                official_apply_url="https://www.iitb.ac.in/academic/scholarship",
                summary="Tuition fee waiver and pocket allowance for undergraduate engineering students across IIT campuses.",
                overview="Offered to top 25% of admitted B.Tech / Dual Degree students meeting academic and family income criteria.",
                logo="⚙️",
                benefits=[
                    "Full tuition fee waiver (₹1.0 Lakh per semester)",
                    "Pocket allowance of ₹1,000 per month"
                ],
                eligibility=[
                    "Enrolled in B.Tech / Dual Degree / BS at an IIT",
                    "Annual family income less than ₹5.0 Lakh",
                    "Minimum CPI/CGPA of 7.0 with no backlogs"
                ],
                documents=[
                    "Parental Income Certificate / ITR return",
                    "JEE Advanced Rank card",
                    "Semester CPI transcript"
                ],
                branches=["Engineering", "Computer Science", "Electrical", "Mechanical", "Chemical"],
                education_levels=["Undergraduate"]
            )
        ]
