"""Skill tree routes: list skills and unlock."""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Character
from app.models.skill import Skill, UserSkill
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/skills", tags=["skills"])


@router.get("")
def list_skills(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all skills with user's state for each."""
    all_skills = db.query(Skill).order_by(Skill.tree, Skill.id).all()
    user_skills = {
        us.skill_id: us.state
        for us in db.query(UserSkill).filter(UserSkill.user_id == user.id).all()
    }

    result = []
    for skill in all_skills:
        state = user_skills.get(skill.id, "locked")
        result.append({
            "id": skill.id,
            "skill_id": skill.id,
            "tree": skill.tree,
            "key": skill.key,
            "name": skill.name,
            "icon": skill.icon,
            "xp_required": skill.xp_required,
            "bonus": skill.bonus,
            "parent_key": skill.parent_key,
            "state": state,
        })

    return result


@router.post("/{skill_id}/unlock")
def unlock_skill(skill_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Unlock a skill if the user meets XP requirements."""
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    character = db.query(Character).filter(Character.user_id == user.id).first()
    if not character:
        raise HTTPException(status_code=400, detail="No character found")

    # Check if already unlocked
    existing = db.query(UserSkill).filter(
        UserSkill.user_id == user.id, UserSkill.skill_id == skill_id
    ).first()
    if existing and existing.state in ("unlocked", "mastered"):
        raise HTTPException(status_code=400, detail="Skill already unlocked")

    # Check XP requirement
    if character.total_xp < skill.xp_required:
        raise HTTPException(status_code=400, detail=f"Need {skill.xp_required} total XP. You have {character.total_xp}.")

    # Check parent skill is unlocked
    if skill.parent_key:
        parent = db.query(Skill).filter(Skill.key == skill.parent_key).first()
        if parent:
            parent_state = db.query(UserSkill).filter(
                UserSkill.user_id == user.id, UserSkill.skill_id == parent.id
            ).first()
            if not parent_state or parent_state.state not in ("unlocked", "mastered"):
                raise HTTPException(status_code=400, detail=f"Must unlock '{parent.name}' first")

    if existing:
        existing.state = "unlocked"
        existing.unlocked_at = datetime.utcnow()
    else:
        us = UserSkill(
            user_id=user.id,
            skill_id=skill_id,
            state="unlocked",
            unlocked_at=datetime.utcnow(),
        )
        db.add(us)

    db.commit()
    return {"success": True, "skill_name": skill.name, "state": "unlocked"}
