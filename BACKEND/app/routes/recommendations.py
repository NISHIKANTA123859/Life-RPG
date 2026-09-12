"""
Recommendations router — ML-powered quest recommendations.

Provides GET /api/recommendations which mirrors GET /api/recommendations
from the intelligence router. This module is the canonical recommendation
entry point that the frontend QuestIntelligence page calls.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.auth_service import get_current_user
from app.ml.recommender import get_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("")
def list_recommendations(
    limit: int = 5,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get ML-powered quest recommendations personalised to the current user.

    The recommendation pipeline:
        training_data.csv → train.py → model.pkl → predict.py
        → recommender.py → this endpoint → React frontend
    """
    return get_recommendations(db, user.id, limit=limit)
