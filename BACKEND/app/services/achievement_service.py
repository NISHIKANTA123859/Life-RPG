"""Achievement auto-unlock service. Checks conditions after quest completions."""
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.user import Character
from app.models.quest import QuestCompletion
from app.models.achievement import Achievement, UserAchievement
from app.models.activity import Activity


def check_and_unlock_achievements(db: Session, user_id: int, character: Character) -> list[dict]:
    """Check all achievement conditions and unlock any newly earned ones. Returns list of newly unlocked."""
    all_achievements = db.query(Achievement).all()
    already_unlocked_ids = {
        ua.achievement_id
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    }

    total_completions = db.query(QuestCompletion).filter(QuestCompletion.user_id == user_id).count()

    newly_unlocked = []

    for ach in all_achievements:
        if ach.id in already_unlocked_ids:
            continue

        unlocked = False
        if ach.requirement_type == "quests_completed":
            unlocked = total_completions >= ach.requirement_value
        elif ach.requirement_type == "streak":
            unlocked = character.current_streak >= ach.requirement_value
        elif ach.requirement_type == "level":
            unlocked = character.level >= ach.requirement_value
        elif ach.requirement_type == "gold":
            unlocked = character.gold >= ach.requirement_value
        elif ach.requirement_type == "intellect":
            unlocked = character.intellect >= ach.requirement_value
        elif ach.requirement_type == "strength":
            unlocked = character.strength >= ach.requirement_value
        elif ach.requirement_type == "health":
            unlocked = character.health >= ach.requirement_value
        elif ach.requirement_type == "mind":
            unlocked = character.mind >= ach.requirement_value
        elif ach.requirement_type == "discipline":
            unlocked = character.discipline >= ach.requirement_value
        elif ach.requirement_type == "endurance":
            unlocked = character.endurance >= ach.requirement_value
        elif ach.requirement_type == "total_xp":
            unlocked = character.total_xp >= ach.requirement_value

        if unlocked:
            ua = UserAchievement(
                user_id=user_id,
                achievement_id=ach.id,
                unlocked_at=datetime.utcnow(),
            )
            db.add(ua)

            # Log activity
            activity = Activity(
                user_id=user_id,
                type="achievement",
                icon=ach.icon,
                title=f"Achievement Unlocked: {ach.name}",
                detail=ach.description,
                xp=ach.xp_reward,
                gold=0,
                color="#F5B92C",
            )
            db.add(activity)

            # Bonus XP from achievement
            character.current_xp += ach.xp_reward
            character.total_xp += ach.xp_reward

            newly_unlocked.append({
                "id": ach.id,
                "key": ach.key,
                "name": ach.name,
                "icon": ach.icon,
                "description": ach.description,
                "rarity": ach.rarity,
                "xp_reward": ach.xp_reward,
            })

    return newly_unlocked
