from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ActivityResponse(BaseModel):
    id: int
    type: str
    icon: str
    title: str
    detail: str
    xp: int
    gold: int
    color: str
    created_at: datetime

    class Config:
        from_attributes = True
