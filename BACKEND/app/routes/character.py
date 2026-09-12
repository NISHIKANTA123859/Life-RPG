"""
Character routes: fetch character data and computed stats.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Character
from app.models.quest import QuestCompletion
from app.services.auth_service import get_current_user
from app.services.xp_service import xp_progress_percent, xp_to_next_level

router = APIRouter(prefix="/api/character", tags=["character"])


def _char_dict(char: Character) -> dict:
    return {
        "id": char.id,
        "user_id": char.user_id,
        "name": char.name,
        "class_name": char.class_name,
        "level": char.level,
        "current_xp": char.current_xp,
        "required_xp": char.required_xp,
        "total_xp": char.total_xp,
        "gold": char.gold,
        "current_streak": char.current_streak,
        "longest_streak": char.longest_streak,
        "last_completion_date": (
            char.last_completion_date.isoformat() if char.last_completion_date else None
        ),
        # Frontend aliases
        "currentXP": char.current_xp,
        "maxXP": char.required_xp,
        "streak": char.current_streak,
        # Attributes
        "intellect": char.intellect,
        "strength": char.strength,
        "health": char.health,
        "mind": char.mind,
        "discipline": char.discipline,
        "endurance": char.endurance,
        # Computed
        "xp_progress_pct": xp_progress_percent(char),
        "xp_to_next": xp_to_next_level(char),
    }


@router.get("")
def get_character(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the current user's character."""
    char = db.query(Character).filter(Character.user_id == user.id).first()
    if not char:
        raise HTTPException(status_code=404, detail="Character not found")
    return _char_dict(char)


@router.get("/stats")
def get_character_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return extended character stats including quest completion counts."""
    char = db.query(Character).filter(Character.user_id == user.id).first()
    if not char:
        raise HTTPException(status_code=404, detail="Character not found")

    total_completions = (
        db.query(QuestCompletion)
        .filter(QuestCompletion.user_id == user.id)
        .count()
    )

    base = _char_dict(char)
    base.update(
        {
            "quests_completed": total_completions,
            "total_gold_earned": char.gold,
        }
    )
    return base
