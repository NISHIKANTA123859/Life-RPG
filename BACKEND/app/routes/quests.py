"""Quest CRUD and completion routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User, Character
from app.models.quest import Quest
from app.schemas.quest import QuestCreate, QuestUpdate, QuestResponse, QuestCompleteResponse
from app.services.auth_service import get_current_user
from app.services.game_engine import (
    complete_quest,
    DIFFICULTY_REWARDS,
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    CATEGORY_ATTRIBUTE_MAP,
)
from app.services.achievement_service import check_and_unlock_achievements

router = APIRouter(prefix="/api/tasks", tags=["quests"])
quests_alias_router = APIRouter(prefix="/api/quests", tags=["quests"])


def _quest_to_dict(q: Quest) -> dict:
    """Convert a Quest ORM object to a frontend-compatible dict."""
    return {
        "id": q.id,
        "user_id": q.user_id,
        "name": q.name,
        "title": q.name,
        "description": q.description or "",
        "category": q.category,
        "category_color": q.category_color,
        "categoryColor": q.category_color,
        "icon": q.icon,
        "difficulty": q.difficulty,
        "due_date": q.due_date,
        "deadline": q.due_date or "No deadline",
        "estimated_time": q.estimated_time,
        "xp_reward": q.xp_reward,
        "gold_reward": q.gold_reward,
        "xp": q.xp_reward,
        "gold": q.gold_reward,
        "attribute": q.attribute,
        "attribute_reward": q.attribute_reward,
        "status": q.status,
        "completed": q.status == "completed",
        "completed_at": q.completed_at.isoformat() if q.completed_at else None,
        "created_at": q.created_at.isoformat() if q.created_at else None,
    }


@router.get("")
@quests_alias_router.get("")
def list_quests(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quests = db.query(Quest).filter(Quest.user_id == user.id).order_by(Quest.created_at.desc()).all()
    return [_quest_to_dict(q) for q in quests]


@router.post("")
@quests_alias_router.post("")
def create_quest(data: QuestCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    name = data.name or data.title or "New Quest"
    difficulty = data.difficulty or "Easy"
    rewards = DIFFICULTY_REWARDS.get(difficulty, DIFFICULTY_REWARDS["Easy"])
    category = data.category or "Intellect"

    # Prevent duplicate active quest
    existing = db.query(Quest).filter(
        Quest.user_id == user.id,
        Quest.name == name,
        Quest.status == "active"
    ).first()
    if existing:
        return {
            "success": False,
            "message": "Quest already exists",
            "quest": _quest_to_dict(existing)
        }

    # Build attribute label
    attr_key = CATEGORY_ATTRIBUTE_MAP.get(category, "intellect")
    attr_short = {"intellect": "INT", "strength": "STR", "health": "HLT", "mind": "MND", "discipline": "DIS", "endurance": "END"}
    attribute = data.attribute or f"{attr_short.get(attr_key, 'INT')} +{rewards['attr']}"

    quest = Quest(
        user_id=user.id,
        name=name,
        description=data.description or "",
        category=category,
        category_color=CATEGORY_COLORS.get(category, "#8B5CF6"),
        icon=CATEGORY_ICONS.get(category, "⚔️"),
        difficulty=difficulty,
        due_date=data.due_date or data.deadline,
        estimated_time=data.estimated_time,
        xp_reward=getattr(data, "xp_reward", None) or rewards["xp"],
        gold_reward=getattr(data, "gold_reward", None) or rewards["gold"],
        attribute=attribute,
        attribute_reward=getattr(data, "attribute_reward", None) or rewards["attr"],
    )
    db.add(quest)
    db.commit()
    db.refresh(quest)
    return _quest_to_dict(quest)


@router.get("/{quest_id}")
@quests_alias_router.get("/{quest_id}")
def get_quest(quest_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id, Quest.user_id == user.id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    return _quest_to_dict(quest)


@router.put("/{quest_id}")
@quests_alias_router.put("/{quest_id}")
def update_quest(quest_id: int, data: QuestUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id, Quest.user_id == user.id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    if data.name or data.title:
        quest.name = data.name or data.title
    if data.description is not None:
        quest.description = data.description
    if data.category:
        quest.category = data.category
        quest.category_color = CATEGORY_COLORS.get(data.category, quest.category_color)
    if data.difficulty:
        quest.difficulty = data.difficulty
    if data.due_date or data.deadline:
        quest.due_date = data.due_date or data.deadline
    if data.status:
        quest.status = data.status

    db.commit()
    db.refresh(quest)
    return _quest_to_dict(quest)


@router.delete("/{quest_id}")
@quests_alias_router.delete("/{quest_id}")
def delete_quest(quest_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id, Quest.user_id == user.id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    db.delete(quest)
    db.commit()
    return {"success": True, "message": "Quest deleted"}


@router.post("/{quest_id}/complete")
@quests_alias_router.post("/{quest_id}/complete")
def complete_quest_route(quest_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id, Quest.user_id == user.id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    if quest.status == "completed":
        raise HTTPException(status_code=400, detail="Quest already completed")

    character = db.query(Character).filter(Character.user_id == user.id).first()
    if not character:
        raise HTTPException(status_code=400, detail="No character found")

    result = complete_quest(db, quest, character)

    # Check achievements
    new_achievements = check_and_unlock_achievements(db, user.id, character)
    result["new_achievements"] = new_achievements

    db.commit()
    return result
