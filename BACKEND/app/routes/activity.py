"""Activity history routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.activity import Activity
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/activity", tags=["activity"])


@router.get("")
def list_activities(
    limit: int = 50,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    activities = (
        db.query(Activity)
        .filter(Activity.user_id == user.id)
        .order_by(Activity.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": a.id,
            "type": a.type,
            "icon": a.icon,
            "title": a.title,
            "detail": a.detail,
            "xp": a.xp,
            "gold": a.gold,
            "color": a.color,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in activities
    ]
