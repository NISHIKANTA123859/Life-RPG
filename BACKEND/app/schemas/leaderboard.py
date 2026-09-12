from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    rank: int
    name: str
    class_name: str
    level: int
    total_xp: int
    quests_completed: int
    avatar_color: str = "#8B5CF6"
    is_self: bool = False
