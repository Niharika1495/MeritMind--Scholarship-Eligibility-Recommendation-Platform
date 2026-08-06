from pydantic import BaseModel
from typing import Optional
from app.schemas.scholarship import ScholarshipBase

class ApplicationCreate(BaseModel):
    scholarshipId: str
    status: Optional[str] = "Applied"

class ApplicationStatusUpdate(BaseModel):
    status: str

class ApplicationOut(BaseModel):
    id: int
    scholarshipId: str
    status: str
    appliedAt: str
    scholarship: Optional[ScholarshipBase] = None

    class Config:
        from_attributes = True
        populate_by_name = True
