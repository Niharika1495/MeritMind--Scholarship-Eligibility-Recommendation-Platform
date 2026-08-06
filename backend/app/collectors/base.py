from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseCollector(ABC):
    """
    Abstract Base Collector for MeritMind official source collectors.
    Every source must inherit from BaseCollector and implement collect().
    """
    source_name: str = "BaseCollector"

    @abstractmethod
    def collect(self) -> List[Dict[str, Any]]:
        """
        Fetches or extracts scholarship records from the official source.
        Returns a list of dictionaries adhering to the MeritMind scholarship schema.
        """
        pass

    def create_record(
        self,
        id: str,
        name: str,
        provider: str,
        amount: float,
        deadline: str,
        category: str,
        sector: str,
        state: str,
        max_income: float,
        min_cgpa: float,
        official_website: str,
        official_apply_url: str,
        summary: str,
        overview: str = "",
        logo: str = "🏛️",
        currency: str = "₹",
        for_women: bool = False,
        for_minority: bool = False,
        for_disability: bool = False,
        benefits: List[str] = None,
        eligibility: List[str] = None,
        documents: List[str] = None,
        branches: List[str] = None,
        education_levels: List[str] = None,
        selection_process: List[str] = None
    ) -> Dict[str, Any]:
        return {
            "id": id,
            "name": name,
            "provider": provider,
            "amount": float(amount),
            "deadline": str(deadline),
            "category": category,
            "sector": sector,
            "state": state,
            "max_income": float(max_income),
            "min_cgpa": float(min_cgpa),
            "official_website": official_website,
            "official_apply_url": official_apply_url,
            "summary": summary,
            "overview": overview or summary,
            "logo": logo,
            "currency": currency,
            "for_women": for_women,
            "for_minority": for_minority,
            "for_disability": for_disability,
            "benefits": benefits or ["Financial assistance for tuition & fees"],
            "eligibility": eligibility or ["Must meet academic & income criteria"],
            "documents": documents or ["Aadhaar Card", "Income Certificate", "Marksheet"],
            "branches": branches or ["All branches"],
            "education_levels": education_levels or ["Undergraduate"],
            "selection_process": selection_process or [
                "Eligibility verification against student profile",
                "Official portal document review",
                "Selection and disbursement by provider"
            ],
            "source_collector": self.source_name,
            "status": "Active"
        }
