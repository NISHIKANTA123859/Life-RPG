"""Achievement routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Character
from app.models.achievement import Achievement, UserAchievement
from app.models.quest import QuestCompletion
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/achievements", tags=["achievements"])


def _get_progress(ach: Achievement, user_id: int, character: Character, db: Session) -> tuple[int, int]:
    """Calculate current progress toward an achievement."""
    req_type = ach.requirement_type
    req_val = ach.requirement_value

    if req_type == "quests_completed":
        current = db.query(QuestCompletion).filter(QuestCompletion.user_id == user_id).count()
    elif req_type == "streak":
        current = character.current_streak
    elif req_type == "level":
        current = character.level
    elif req_type == "gold":
        current = character.gold
    elif req_type == "total_xp":
        current = character.total_xp
    elif hasattr(character, req_type):
        current = getattr(character, req_type)
    else:
        current = 0

    return min(current, req_val), req_val


from app.services.achievement_service import check_and_unlock_achievements


@router.get("")
def list_achievements(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    character = db.query(Character).filter(Character.user_id == user.id).first()
    if character:
        check_and_unlock_achievements(db, user.id, character)
        db.commit()

    all_achievements = db.query(Achievement).order_by(Achievement.id).all()
    
    unlocked_map = {}
    for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all():
        unlocked_map[ua.achievement_id] = ua.unlocked_at

    result = []
    for ach in all_achievements:
        is_unlocked = ach.id in unlocked_map
        progress, progress_max = _get_progress(ach, user.id, character, db) if character else (0, ach.requirement_value)
        
        result.append({
            "id": ach.id,
            "key": ach.key,
            "icon": ach.icon,
            "name": ach.name,
            "description": ach.description,
            "desc": ach.description,
            "rarity": ach.rarity,
            "xp_reward": ach.xp_reward,
            "xp": ach.xp_reward,
            "requirement_type": ach.requirement_type,
            "requirement_value": ach.requirement_value,
            "unlocked": is_unlocked,
            "progress": progress,
            "progressMax": progress_max,
            "date": unlocked_map[ach.id].strftime("%b %d, %Y") if is_unlocked else None,
        })

    return result
