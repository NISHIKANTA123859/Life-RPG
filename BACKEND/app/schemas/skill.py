from typing import Optional
from pydantic import BaseModel


class SkillResponse(BaseModel):
    id: int
    tree: str
    key: str
    name: str
    icon: str
    xp_required: int
    bonus: str
    parent_key: Optional[str] = None

    class Config:
        from_attributes = True


class UserSkillResponse(BaseModel):
    id: int
    skill_id: int
    tree: str
    key: str
    name: str
    icon: str
    xp_required: int
    bonus: str
    parent_key: Optional[str] = None
    state: str  # mastered, unlocked, available, locked

    class Config:
        from_attributes = True
