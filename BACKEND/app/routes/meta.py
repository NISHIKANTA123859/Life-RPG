"""Meta routes: daily-progress, streak, and seed."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Character
from app.models.quest import Quest
from app.services.auth_service import get_current_user
from app.seed.seed_data import run_seed

router = APIRouter(prefix="/api", tags=["meta"])


@router.get("/daily-progress")
def get_daily_progress(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Calculate daily completion stats for active user."""
    quests = db.query(Quest).filter(Quest.user_id == user.id).all()
    total = len(quests)
    completed = len([q for q in quests if q.status == "completed"])
    remaining = total - completed
    percentage = round((completed / total) * 100) if total > 0 else 0

    return {
        "completed": completed,
        "total": total,
        "remaining": remaining,
        "percentage": percentage,
        "completed_quests": completed,
        "total_quests": total,
    }


@router.get("/streak")
def get_streak(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get streak statistics for active user."""
    character = db.query(Character).filter(Character.user_id == user.id).first()
    if not character:
        return {"current_streak": 0, "longest_streak": 0, "streak": 0}

    return {
        "current_streak": character.current_streak,
        "longest_streak": character.longest_streak,
        "streak": character.current_streak,
    }


@router.post("/seed")
def seed_database():
    """Trigger seed data population (achievements, shop items, skills, and default hero)."""
    run_seed()
    return {"message": "Database seeded successfully"}
