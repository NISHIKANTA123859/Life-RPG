"""
ML Predictor Module — loads trained scikit-learn Pipeline from life_rpg_recommender.pkl
and provides completion probability predictions.
"""
import os
import logging
import joblib
import pandas as pd

logger = logging.getLogger("life_rpg.ml")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "life_rpg_recommender.pkl")

_MODEL = None

def load_ml_model():
    """Load trained scikit-learn model once on demand."""
    global _MODEL
    if _MODEL is not None:
        return _MODEL

    if os.path.exists(MODEL_PATH):
        try:
            _MODEL = joblib.load(MODEL_PATH)
            logger.info(f"Loaded ML model from {MODEL_PATH}")
        except Exception as e:
            logger.error(f"Failed to load ML model from {MODEL_PATH}: {e}")
            _MODEL = None
    else:
        logger.warning(f"ML model file not found at {MODEL_PATH}")
        _MODEL = None

    return _MODEL


def predict_quest_likelihood(
    quest_category: str,
    difficulty: str,
    estimated_time: int = 30,
    completion_rate: float = 0.8,
    streak: int = 7,
    avg_xp: int = 60,
    hour: int = 14,
    previous_completed: int = 1,
) -> dict:
    """
    Predict quest completion likelihood using the trained RandomForest ML pipeline.
    Returns dict: {"probability": float, "prediction": int, "ml_available": bool}
    """
    model = load_ml_model()
    if model is None:
        # Graceful fallback when model is not available
        return {
            "probability": 0.75,
            "prediction": 1,
            "ml_available": False,
            "source": "fallback",
        }

    try:
        input_df = pd.DataFrame([{
            "quest_category": quest_category,
            "difficulty": difficulty,
            "estimated_time": estimated_time,
            "completion_rate": completion_rate,
            "streak": streak,
            "avg_xp": avg_xp,
            "hour": hour,
            "previous_completed": previous_completed,
        }])

        # Predict probability of completion (class 1)
        probabilities = model.predict_proba(input_df)
        prob = float(probabilities[0][1]) if len(probabilities[0]) > 1 else float(probabilities[0][0])
        prediction = int(model.predict(input_df)[0])

        return {
            "probability": round(prob, 4),
            "prediction": prediction,
            "ml_available": True,
            "source": "ml_model",
        }
    except Exception as e:
        logger.error(f"ML prediction error: {e}")
        return {
            "probability": 0.75,
            "prediction": 1,
            "ml_available": False,
            "source": "fallback_error",
        }
