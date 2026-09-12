"""
Activity logging service.

Centralises creation of Activity log entries so that routes
and other services don't duplicate the ORM instantiation logic.
"""
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.activity import Activity


def log_activity(
    db: Session,
    user_id: int,
    *,
    type: str,
    icon: str,
    title: str,
    detail: str = "",
    xp: int = 0,
    gold: int = 0,
    color: str = "#8B5CF6",
    commit: bool = False,
) -> Activity:
    """
    Create and persist (add to session) an Activity record.

    Args:
        db:      SQLAlchemy session
        user_id: ID of the user this activity belongs to
        type:    Category string — e.g. "quest", "level", "achievement", "purchase"
        icon:    Emoji or icon string
        title:   Short headline for the activity feed
        detail:  Supporting detail / reward string
        xp:      XP delta (positive = earned, 0 = no change)
        gold:    Gold delta (positive = earned, negative = spent)
        color:   Hex accent colour for the frontend card
        commit:  If True, immediately commit the session (use sparingly)

    Returns the newly created Activity ORM object.
    """
    activity = Activity(
        user_id=user_id,
        type=type,
        icon=icon,
        title=title,
        detail=detail,
        xp=xp,
        gold=gold,
        color=color,
        created_at=datetime.utcnow(),
    )
    db.add(activity)
    if commit:
        db.commit()
        db.refresh(activity)
    return activity


def get_recent_activities(db: Session, user_id: int, limit: int = 50) -> list[Activity]:
    """Return the most recent `limit` activities for a user, newest first."""
    return (
        db.query(Activity)
        .filter(Activity.user_id == user_id)
        .order_by(Activity.created_at.desc())
        .limit(limit)
        .all()
    )


def activity_to_dict(activity: Activity) -> dict:
    """Serialise an Activity ORM object to a frontend-ready dict."""
    return {
        "id": activity.id,
        "type": activity.type,
        "icon": activity.icon,
        "title": activity.title,
        "detail": activity.detail,
        "xp": activity.xp,
        "gold": activity.gold,
        "color": activity.color,
        "created_at": activity.created_at.isoformat() if activity.created_at else None,
    }
