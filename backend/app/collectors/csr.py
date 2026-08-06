from typing import List, Dict, Any
from datetime import date, timedelta
from app.collectors.base import BaseCollector

class CSRCollector(BaseCollector):
    source_name = "Corporate CSR Programs"

    def collect(self) -> List[Dict[str, Any]]:
        today = date.today()
        return [
            self.create_record(
                id="hdfc-badhte-kadam",
                name="HDFC Bank Parivartan's ECSS Scholarship",
                provider="HDFC Bank Parivartan",
                amount=75000.0,
                deadline=(today + timedelta(days=29)).isoformat(),
                category="Need-based",
                sector="Private",
                state="All India",
                max_income=600000.0,
                min_cgpa=5.5,
                official_website="https://www.hdfcbank.com",
                official_apply_url="https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility/parivartan",
                summary="Assisting students facing personal or financial crisis to continue higher education without dropping out.",
                overview="Educational Crisis Scholarship Support (ECSS) designed for students who are undergoing financial distress.",
                logo="🏦",
                benefits=[
                    "Up to ₹75,000 for undergraduate & postgraduate professional students"
                ],
                eligibility=[
                    "Students facing family financial crisis (job loss, medical emergency, death of earning member)",
                    "Passed previous exam with at least 55% marks",
                    "Annual family income not exceeding ₹6.0 Lakh"
                ],
                documents=[
                    "Proof of crisis (Medical bills / Death cert / Job termination notice)",
                    "Previous year marksheet",
                    "Income proof",
                    "Bank passbook"
                ],
                branches=["All branches"],
                education_levels=["Undergraduate", "Postgraduate", "Diploma"]
            ),
            self.create_record(
                id="kotak-kanya-scholarship",
                name="Kotak Kanya Scholarship for Girl Students",
                provider="Kotak Education Foundation",
                amount=150000.0,
                deadline=(today + timedelta(days=38)).isoformat(),
                category="Girls",
                sector="Private",
                state="All India",
                max_income=600000.0,
                min_cgpa=7.5,
                official_website="https://kotakeducation.org",
                official_apply_url="https://kotakeducation.org/kotak-kanya-scholarship/",
                summary="Financial support for meritorious girl students pursuing professional graduation from premier institutes.",
                overview="Empowers girl students from low-income families to complete professional degree education (Engineering, MBBS, Architecture, Law, Design).",
                logo="🌸",
                for_women=True,
                benefits=[
                    "Up to ₹1.5 Lakh per year towards tuition fee, hostel, books, laptop and transport"
                ],
                eligibility=[
                    "Meritorious girl students who have secured admission in 1st year professional degree courses in NIRF top institutions",
                    "Scored 85% or more in Class 12 board exams",
                    "Annual family income below ₹6.0 Lakh"
                ],
                documents=[
                    "Class 12th Marksheet (85%+ compulsory)",
                    "Income Certificate",
                    "NIRF college admission fee receipt",
                    "Bonafide certificate"
                ],
                branches=["Engineering", "Computer Science", "Architecture", "Law", "Medicine"],
                education_levels=["Undergraduate"]
            ),
            self.create_record(
                id="siemens-scholarship-program",
                name="Siemens Scholarship Program for Engineering Students",
                provider="Siemens India Foundation",
                amount=120000.0,
                deadline=(today + timedelta(days=42)).isoformat(),
                category="Merit",
                sector="Private",
                state="All India",
                max_income=200000.0,
                min_cgpa=6.0,
                official_website="https://www.siemens.co.in",
                official_apply_url="https://www.siemens.co.in/en/about_us/index/corporate-citizenship/siemens-scholarship-program.html",
                summary="Full financial tuition assistance, mentorship, and practical industrial training for 1st year engineering students.",
                overview="Covers 100% of college tuition fees and provides internships, soft skill workshops, and modern tech exposure.",
                logo="⚡",
                benefits=[
                    "100% tuition fee reimbursement",
                    "Book allowance of ₹10,000 per year",
                    "Siemens industry internship & placement mentorship"
                ],
                eligibility=[
                    "1st year student at government engineering college",
                    "Branch: Mechanical, Electrical, Computer Science, Electronics, Instrumentation",
                    "Family income not exceeding ₹2.0 Lakh per annum"
                ],
                documents=[
                    "Class 10th & 12th Marksheet",
                    "Government College Admission Letter",
                    "Income Certificate issued by Tehsildar"
                ],
                branches=["Mechanical", "Electrical", "Computer Science", "Electronics"],
                education_levels=["Undergraduate"]
            )
        ]
