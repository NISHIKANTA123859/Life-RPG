"""ML model inference: loads the trained model and predicts quest completion likelihood."""
import os
import logging
from typing import Optional

import numpy as np

logger = logging.getLogger("life_rpg.ml.predict")

_model = None
_model_path = os.path.join(os.path.dirname(__file__), "life_rpg_recommender.pkl")


def _load_model():
    """Lazy-load the ML model from the .pkl file."""
    global _model
    if _model is not None:
        return _model
    
    if not os.path.exists(_model_path):
        logger.warning(f"ML model not found at {_model_path}. Using fallback heuristic.")
        return None
    
    try:
        import joblib
        _model = joblib.load(_model_path)
        logger.info("ML model loaded successfully.")
        return _model
    except Exception as e:
        logger.error(f"Failed to load ML model: {e}")
        return None


# ── Feature encoding maps ────────────────────────────────────────────
DIFFICULTY_MAP = {"Easy": 0, "Medium": 1, "Hard": 2, "Epic": 3}
CATEGORY_MAP = {
    "Intellect": 0, "Strength": 1, "Health": 2,
    "Mind": 3, "Discipline": 4, "Endurance": 5,
}


def predict_completion_probability(
    difficulty: str,
    category: str,
    xp_reward: int,
    user_streak: int = 0,
    category_familiarity: float = 0.5,
) -> float:
    """
    Predict the probability that a user will complete a quest.
    
    Returns a float 0–100 representing percentage likelihood.
    """
    model = _load_model()
    
    if model is not None:
        try:
            features = np.array([[
                DIFFICULTY_MAP.get(difficulty, 1),
                CATEGORY_MAP.get(category, 0),
                xp_reward,
                user_streak,
                category_familiarity,
            ]])
            prob = model.predict_proba(features)[0][1]
            return round(prob * 100, 1)
        except Exception as e:
            logger.warning(f"Model prediction failed: {e}. Using heuristic fallback.")
    
    # Heuristic fallback when model is unavailable or fails
    base = 80
    diff_penalty = {"Easy": 0, "Medium": -8, "Hard": -18, "Epic": -25}
    score = base + diff_penalty.get(difficulty, -10)
    score += min(user_streak * 1.5, 15)  # streak bonus capped at +15
    score += (category_familiarity - 0.5) * 20  # familiarity bonus
    return round(max(10, min(98, score)), 1)
