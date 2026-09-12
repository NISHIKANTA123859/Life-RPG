"""Intelligence routes: ML recommendations and productivity insights."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.auth_service import get_current_user
from app.ml.recommender import get_recommendations
from app.services.insights_service import get_insights

router = APIRouter(prefix="/api", tags=["intelligence"])


@router.get("/recommendations")
def get_ml_recommendations(
    limit: int = 5,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get ML-powered quest recommendations."""
    return get_recommendations(db, user.id, limit=limit)


@router.get("/insights")
def get_quest_insights(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get productivity insights and analytics."""
    return get_insights(db, user.id)
