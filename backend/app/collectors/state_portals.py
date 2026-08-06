from typing import List, Dict, Any
from datetime import date, timedelta
from app.collectors.base import BaseCollector

class StatePortalsCollector(BaseCollector):
    source_name = "State Government Portals"

    def collect(self) -> List[Dict[str, Any]]:
        today = date.today()
        return [
            self.create_record(
                id="mahadbt-post-matric-ebc",
                name="Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)",
                provider="Government of Maharashtra (MahaDBT)",
                amount=60000.0,
                deadline=(today + timedelta(days=22)).isoformat(),
                category="Need-based",
                sector="Government",
                state="Maharashtra",
                max_income=800000.0,
                min_cgpa=5.5,
                official_website="https://mahadbt.maharashtra.gov.in",
                official_apply_url="https://mahadbt.maharashtra.gov.in/ApplicantRegistration/RegisterUser",
                summary="50% to 100% tuition and exam fee reimbursement for Economically Backward Class students in Maharashtra.",
                overview="Financial aid provided by Directorate of Higher and Technical Education, Maharashtra to EBC students pursuing professional courses.",
                logo="🏛️",
                benefits=[
                    "50% tuition fee reimbursement for private un-aided colleges",
                    "100% tuition fee waiver for government institutions",
                    "Hostel maintenance allowance up to ₹10,000 per year"
                ],
                eligibility=[
                    "Domicile of Maharashtra state",
                    "Family income up to ₹8.0 Lakh per annum",
                    "Admitted under CAP round for professional degrees"
                ],
                documents=[
                    "Maharashtra Domicile Certificate",
                    "Income Certificate issued by Tehsildar",
                    "CAP Allotment Letter",
                    "Previous Year Marksheets"
                ],
                branches=["Engineering", "Pharmacy", "Management", "Architecture", "Medicine"],
                education_levels=["Undergraduate", "Postgraduate", "Diploma"]
            ),
            self.create_record(
                id="ssp-karnataka-post-matric",
                name="Karnataka State Scholarship Portal (SSP) Post-Matric Fee Reimbursement",
                provider="Government of Karnataka (SSP)",
                amount=45000.0,
                deadline=(today + timedelta(days=18)).isoformat(),
                category="Need-based",
                sector="Government",
                state="Karnataka",
                max_income=250000.0,
                min_cgpa=6.0,
                official_website="https://ssp.postmatric.karnataka.gov.in",
                official_apply_url="https://ssp.postmatric.karnataka.gov.in",
                summary="Integrated fee reimbursement scheme for OBC, SC, ST and Minority students in Karnataka.",
                overview="Centralized portal by Govt of Karnataka providing fee structure reimbursement directly to student accounts.",
                logo="🌾",
                benefits=[
                    "College fee reimbursement directly disbursed via e-KYC DBT",
                    "Hostel fee assistance under Vidyasiri scheme"
                ],
                eligibility=[
                    "Student must be a resident of Karnataka",
                    "Family annual income below ₹2.5 Lakh",
                    "Secured admission in Karnataka state university/college"
                ],
                documents=[
                    "SATS ID / Student Aadhaar Number",
                    "Caste & Income Certificate (RD Number)",
                    "Fee Receipt"
                ],
                branches=["All branches"],
                education_levels=["Undergraduate", "Postgraduate", "Diploma"]
            ),
            self.create_record(
                id="up-scholarship-post-matric",
                name="UP Post Matric Scholarship & Fee Reimbursement Scheme",
                provider="Social Welfare Department, Uttar Pradesh",
                amount=55000.0,
                deadline=(today + timedelta(days=32)).isoformat(),
                category="Need-based",
                sector="Government",
                state="Uttar Pradesh",
                max_income=200000.0,
                min_cgpa=5.0,
                official_website="https://scholarship.up.gov.in",
                official_apply_url="https://scholarship.up.gov.in/RegistrationNew.aspx",
                summary="Financial scholarship for General, OBC, SC, ST students domiciled in Uttar Pradesh.",
                overview="Comprehensive state assistance for students studying in UP schools, colleges, and technical universities.",
                logo="🏛️",
                benefits=[
                    "Non-refundable fee reimbursement up to ₹55,000 per year",
                    "Monthly stipend support"
                ],
                eligibility=[
                    "Domicile of Uttar Pradesh",
                    "Family annual income not exceeding ₹2.0 Lakh (₹2.5 Lakh for SC/ST)",
                    "Enrolled in UP recognized institution"
                ],
                documents=[
                    "UP Domicile Certificate",
                    "Income Proof",
                    "High School Marksheet",
                    "Bank Account linked with Aadhaar"
                ],
                branches=["All branches"],
                education_levels=["Intermediate", "Undergraduate", "Postgraduate", "Diploma"]
            )
        ]
