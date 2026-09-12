from typing import Optional, List
from pydantic import BaseModel, computed_field

class AttributeItem(BaseModel):
    stat: str
    subject: str
    value: int
    max: int = 100
    color: str

class CharacterResponse(BaseModel):
    id: int
    user_id: int
    name: str
    class_name: str
    
    level: int
    current_xp: int
    required_xp: int
    total_xp: int
    gold: int
    
    current_streak: int
    longest_streak: int
    
    intellect: int
    strength: int
    health: int
    mind: int
    discipline: int
    endurance: int

    # Frontend aliases and computed fields
    @computed_field
    @property
    def class_alias(self) -> str:
        return self.class_name

    @computed_field
    @property
    def currentXP(self) -> int:
        return self.current_xp

    @computed_field
    @property
    def maxXP(self) -> int:
        return self.required_xp

    @computed_field
    @property
    def streak(self) -> int:
        return self.current_streak

    @computed_field
    @property
    def combat_power(self) -> int:
        return (self.intellect + self.strength + self.health + self.mind + self.discipline + self.endurance) * 10 + self.level * 50

    class Config:
        from_attributes = True

class CharacterStatsResponse(BaseModel):
    character: CharacterResponse
    attributes: List[AttributeItem]
    radarData: List[dict]
    xp_history: List[dict]
    equipment: List[dict]
