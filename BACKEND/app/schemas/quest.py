from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, computed_field

class QuestCreate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None # frontend uses title
    description: Optional[str] = ""
    category: str = "Intellect"
    difficulty: str = "Easy" # Easy, Medium, Hard, Epic
    due_date: Optional[str] = None
    deadline: Optional[str] = None # frontend uses deadline
    estimated_time: Optional[str] = None
    attribute: Optional[str] = None
    xp_reward: Optional[int] = None
    gold_reward: Optional[int] = None
    attribute_reward: Optional[int] = None

class QuestUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    due_date: Optional[str] = None
    deadline: Optional[str] = None
    status: Optional[str] = None

class QuestResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = ""
    category: str
    category_color: str
    icon: str
    difficulty: str
    due_date: Optional[str] = None
    estimated_time: Optional[str] = None
    xp_reward: int
    gold_reward: int
    attribute: str
    attribute_reward: int
    status: str
    completed_at: Optional[datetime] = None
    created_at: datetime

    # Frontend aliases
    @computed_field
    @property
    def title(self) -> str:
        return self.name

    @computed_field
    @property
    def categoryColor(self) -> str:
        return self.category_color

    @computed_field
    @property
    def deadline(self) -> str:
        return self.due_date or "No deadline"

    @computed_field
    @property
    def xp(self) -> int:
        return self.xp_reward

    @computed_field
    @property
    def gold(self) -> int:
        return self.gold_reward

    @computed_field
    @property
    def completed(self) -> bool:
        return self.status == "completed"

    class Config:
        from_attributes = True

class QuestCompleteResponse(BaseModel):
    success: bool
    quest_id: int
    xp_earned: int
    gold_earned: int
    attribute: str
    attribute_gain: int
    new_xp: int
    new_gold: int
    new_level: int
    level_up: bool
    streak: int
    new_achievements: List[dict] = []
