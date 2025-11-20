from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.activity import ActivityType

class ActivityBase(BaseModel):
    user_id: int
    plant_id: Optional[int]
    diagnosis_id: Optional[int]
    activity_type: ActivityType
    title: Optional[str]

class ActivityCreate(ActivityBase):
    pass

class ActivityOut(ActivityBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
