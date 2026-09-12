"""Leaderboard routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User, Character
from app.models.quest import QuestCompletion
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

CLASS_COLORS = {
    "Scholar": "#22D3EE",
    "Warrior": "#F0466B",
    "Ranger": "#34D399",
    "Monk": "#F5B92C",
}


@router.get("")
def get_leaderboard(
    period: str = "all",
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get leaderboard. period can be: all, monthly, weekly."""
    characters = db.query(Character).order_by(Character.total_xp.desc()).limit(20).all()

    result = []
    for rank, char in enumerate(characters, 1):
        completions = db.query(QuestCompletion).filter(QuestCompletion.user_id == char.user_id).count()
        result.append({
            "rank": rank,
            "name": char.name,
            "class_name": char.class_name,
            "level": char.level,
            "total_xp": char.total_xp,
            "quests_completed": completions,
            "avatar_color": CLASS_COLORS.get(char.class_name, "#8B5CF6"),
            "is_self": char.user_id == user.id,
        })

    return result
