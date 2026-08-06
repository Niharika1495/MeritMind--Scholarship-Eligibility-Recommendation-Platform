from typing import List, Dict, Any
from datetime import date, timedelta
from app.collectors.base import BaseCollector

class NSPCollector(BaseCollector):
    source_name = "National Scholarship Portal (NSP)"

    def collect(self) -> List[Dict[str, Any]]:
        today = date.today()
        return [
            self.create_record(
                id="nsp-merit-cum-means",
                name="NSP Merit-cum-Means Scholarship for Professional & Technical Courses",
                provider="Ministry of Minority Affairs",
                amount=50000.0,
                deadline=(today + timedelta(days=25)).isoformat(),
                category="Minority",
                sector="Government",
                state="All India",
                max_income=250000.0,
                min_cgpa=5.0,
                official_website="https://scholarships.gov.in",
                official_apply_url="https://scholarships.gov.in/fresh/newApplicant",
                summary="Financial assistance for poor and meritorious students from minority communities to pursue professional and technical courses.",
                overview="Scheme aims to support students from Muslim, Christian, Sikh, Buddhist, Parsi and Jain communities to pursue undergraduate and postgraduate technical degrees.",
                logo="🏛️",
                for_minority=True,
                benefits=[
                    "Course fee reimbursement up to ₹20,000 per year",
                    "Maintenance allowance of ₹1,000 per month for hostellers",
                    "Maintenance allowance of ₹500 per month for day scholars"
                ],
                eligibility=[
                    "Secured not less than 50% marks in the previous final examination",
                    "Annual family income from all sources does not exceed ₹2.5 Lakh",
                    "Belongs to a notified minority community in India"
                ],
                documents=[
                    "Community certificate",
                    "Income certificate issued by competent authority",
                    "Marksheet of previous qualifying exam",
                    "Fee receipts of current academic year"
                ],
                branches=["Computer Science", "Electronics", "Mechanical", "Civil", "Information Technology"],
                education_levels=["Undergraduate", "Postgraduate"]
            ),
            self.create_record(
                id="nsp-post-matric-sc",
                name="Post Matric Scholarship for SC Students",
                provider="Ministry of Social Justice and Empowerment",
                amount=35000.0,
                deadline=(today + timedelta(days=40)).isoformat(),
                category="Merit",
                sector="Government",
                state="All India",
                max_income=250000.0,
                min_cgpa=0.0,
                official_website="https://scholarships.gov.in",
                official_apply_url="https://scholarships.gov.in/fresh/newApplicant",
                summary="Centrally sponsored scheme for Scheduled Caste students studying at post-matriculation or post-secondary stage.",
                overview="Provides financial support to SC students to enable them to complete post-secondary education.",
                logo="🏛️",
                benefits=[
                    "Full tuition fee waiver",
                    "Monthly maintenance allowance up to ₹1,200",
                    "Study tour allowance & thesis typing support"
                ],
                eligibility=[
                    "Student must belong to Scheduled Caste (SC)",
                    "Family income must be below ₹2.5 Lakh per annum",
                    "Enrolled in a recognized post-matriculation institution"
                ],
                documents=[
                    "Cast certificate",
                    "Income proof",
                    "Bank passbook linked with Aadhaar",
                    "Institution verification form"
                ],
                branches=["All branches"],
                education_levels=["Intermediate", "Undergraduate", "Postgraduate", "Diploma"]
            ),
            self.create_record(
                id="nsp-central-sector-csss",
                name="Central Sector Scheme of Scholarships for College and University Students",
                provider="Department of Higher Education (MHRD)",
                amount=20000.0,
                deadline=(today + timedelta(days=15)).isoformat(),
                category="Merit",
                sector="Government",
                state="All India",
                max_income=450000.0,
                min_cgpa=7.5,
                official_website="https://scholarships.gov.in",
                official_apply_url="https://scholarships.gov.in/fresh/newApplicant",
                summary="Financial support for top 80th percentile students in Class 12 board exams pursuing higher education.",
                overview="Targeted at meritorious students from low-income families to meet day-to-day expenses while pursuing college studies.",
                logo="🎓",
                benefits=[
                    "₹10,000 per annum for undergraduate studies for first 3 years",
                    "₹20,000 per annum at postgraduate level"
                ],
                eligibility=[
                    "Above 80th percentile of successful candidates in Class 12",
                    "Pursuing regular course in a recognized college/university",
                    "Family income less than ₹4.5 Lakh per annum"
                ],
                documents=[
                    "Class 12 Marksheet",
                    "Income Certificate",
                    "Admission fee receipt"
                ],
                branches=["All branches"],
                education_levels=["Undergraduate", "Postgraduate"]
            )
        ]
