from typing import Optional
from pydantic import BaseModel, computed_field

class AchievementResponse(BaseModel):
    id: int
    key: str
    icon: str
    name: str
    description: str
    rarity: str
    xp_reward: int
    requirement_type: str
    requirement_value: int
    unlocked: bool = False
    progress: int = 0
    progressMax: int = 1
    date: Optional[str] = None

    @computed_field
    @property
    def desc(self) -> str:
        return self.description

    @computed_field
    @property
    def xp(self) -> int:
        return self.xp_reward

    class Config:
        from_attributes = True
