from pydantic import BaseModel

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    read: bool
    createdAt: str

    class Config:
        from_attributes = True
        populate_by_name = True
