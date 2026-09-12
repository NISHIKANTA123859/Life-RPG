"""Authentication routes: register, login, me."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Character
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.services.game_engine import required_xp_for_level

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ── Class starting attributes ────────────────────────────────────────
CLASS_DEFAULTS = {
    "Scholar":  {"intellect": 70, "strength": 35, "health": 50, "mind": 60, "discipline": 55, "endurance": 40},
    "Warrior":  {"intellect": 40, "strength": 75, "health": 65, "mind": 45, "discipline": 55, "endurance": 70},
    "Ranger":   {"intellect": 55, "strength": 50, "health": 60, "mind": 55, "discipline": 75, "endurance": 65},
    "Monk":     {"intellect": 55, "strength": 50, "health": 65, "mind": 75, "discipline": 60, "endurance": 55},
}


def _char_to_dict(char: Character) -> dict:
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
        "currentXP": char.current_xp,
        "maxXP": char.required_xp,
        "streak": char.current_streak,
        "intellect": char.intellect,
        "strength": char.strength,
        "health": char.health,
        "mind": char.mind,
        "discipline": char.discipline,
        "endurance": char.endurance,
    }


@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if data.confirm_password and data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.flush()

    char_class = data.character_class or "Scholar"
    attrs = CLASS_DEFAULTS.get(char_class, CLASS_DEFAULTS["Scholar"])

    character = Character(
        user_id=user.id,
        name=data.name,
        class_name=char_class,
        level=1,
        current_xp=0,
        required_xp=required_xp_for_level(1),
        total_xp=0,
        gold=250,
        current_streak=0,
        longest_streak=0,
        **attrs,
    )
    db.add(character)
    db.commit()
    db.refresh(user)
    db.refresh(character)

    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
        character=_char_to_dict(character),
    )


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    character = db.query(Character).filter(Character.user_id == user.id).first()
    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
        character=_char_to_dict(character) if character else {},
    )


@router.get("/me")
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    character = db.query(Character).filter(Character.user_id == user.id).first()
    return {
        "user": UserResponse.model_validate(user).model_dump(),
        "character": _char_to_dict(character) if character else None,
    }
