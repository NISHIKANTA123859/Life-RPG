from typing import List, Optional
from pydantic import BaseModel


class RecommendationResponse(BaseModel):
    icon: str
    title: str
    category: str
    likelihood: int
    xp: int
    gold: int
    reason: str
    difficulty: str
    color: str


class InsightItem(BaseModel):
    label: str
    value: str
    color: str


class WeeklyCompletion(BaseModel):
    week: str
    completed: int
    total: int


class RadarDataPoint(BaseModel):
    subject: str
    A: int
    fullMark: int = 100


class InsightsResponse(BaseModel):
    insights: List[InsightItem]
    weekly_completion: List[WeeklyCompletion]
    category_radar: List[RadarDataPoint]
