from typing import List, Dict, Any
from datetime import date, timedelta
from app.collectors.base import BaseCollector

class FoundationsCollector(BaseCollector):
    source_name = "Philanthropic Foundations"

    def collect(self) -> List[Dict[str, Any]]:
        today = date.today()
        return [
            self.create_record(
                id="reliance-undergraduate-scholarship",
                name="Reliance Foundation Undergraduate Scholarships",
                provider="Reliance Foundation",
                amount=200000.0,
                deadline=(today + timedelta(days=40)).isoformat(),
                category="Merit",
                sector="Private",
                state="All India",
                max_income=1500000.0,
                min_cgpa=7.5,
                official_website="https://www.scholarships.reliancefoundation.org",
                official_apply_url="https://www.scholarships.reliancefoundation.org",
                summary="Prestigious scholarship program offering ₹2 Lakh grants for undergraduate students in India.",
                overview="Aims to empower India's brightest youth pursuing degree programs in any discipline. Selection includes an online aptitude test.",
                logo="🌐",
                benefits=[
                    "Up to ₹2,000,000 grant over the duration of the degree course",
                    "Leadership development workshops and alumni networking opportunities"
                ],
                eligibility=[
                    "First-year undergraduate student enrolled in any full-time degree program",
                    "Passed Class 12th with minimum 60% aggregate",
                    "Household income under ₹15 Lakh (preference for income under ₹2.5 Lakh)"
                ],
                documents=[
                    "Class 10th and 12th Marksheets",
                    "Official Household Income Certificate",
                    "Bonafide Student Certificate from College",
                    "Aptitude test score card"
                ],
                branches=["All branches"],
                education_levels=["Undergraduate"]
            ),
            self.create_record(
                id="tata-capital-pankh-scholarship",
                name="Tata Capital Pankh Scholarship Scheme",
                provider="Tata Capital",
                amount=80000.0,
                deadline=(today + timedelta(days=26)).isoformat(),
                category="Need-based",
                sector="Private",
                state="All India",
                max_income=400000.0,
                min_cgpa=6.0,
                official_website="https://www.tatacapital.com",
                official_apply_url="https://www.tatacapital.com/csr/pankh-scholarship.html",
                summary="Supporting deserving students from economically weaker sections to fulfill their academic aspirations.",
                overview="Tata Capital initiative helping school and college students pay tuition and educational fees.",
                logo="💎",
                benefits=[
                    "Up to 80% of tuition fee or max ₹80,000 per year"
                ],
                eligibility=[
                    "Enrolled in undergraduate degree or diploma program",
                    "Secured at least 60% marks in previous class",
                    "Annual family income less than ₹4.0 Lakh"
                ],
                documents=[
                    "Income Proof",
                    "Marksheet of qualifying exam",
                    "College fee receipt",
                    "Photo ID card"
                ],
                branches=["All branches"],
                education_levels=["Undergraduate", "Diploma"]
            ),
            self.create_record(
                id="ongc-super-30-merit",
                name="ONGC Merit Scholarship for SC/ST and OBC Students",
                provider="ONGC Foundation",
                amount=48000.0,
                deadline=(today + timedelta(days=33)).isoformat(),
                category="Merit",
                sector="Private",
                state="All India",
                max_income=450000.0,
                min_cgpa=6.5,
                official_website="https://www.ongcindia.com",
                official_apply_url="https://ongcscholar.org/",
                summary="Support for meritorious engineering, MBBS, Master's in Geology/Geophysics and MBA students.",
                overview="Financial award of ₹48,000 per year given to 2,000 deserving students across India.",
                logo="🔥",
                for_minority=True,
                benefits=[
                    "₹4,000 per month (₹48,000 annually) direct transfer"
                ],
                eligibility=[
                    "Enrolled in 1st year B.Tech, MBBS, MBA, or M.Sc in Geology/Geophysics",
                    "Minimum 60% marks in Class 12 / Graduation",
                    "Family annual income below ₹4.5 Lakh"
                ],
                documents=[
                    "Caste Certificate (SC/ST/OBC)",
                    "Income Certificate",
                    "Class 12th & Graduation marksheets"
                ],
                branches=["Engineering", "Computer Science", "Geology", "Management", "Medicine"],
                education_levels=["Undergraduate", "Postgraduate"]
            )
        ]
