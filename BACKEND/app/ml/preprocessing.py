"""
ML preprocessing utilities.

Provides feature encoding and normalization helpers used by both
train.py (for model training) and predict.py (for inference).
"""
import numpy as np

# ── Encoding maps ─────────────────────────────────────────────────────
DIFFICULTY_MAP: dict[str, int] = {
    "Easy":   0,
    "Medium": 1,
    "Hard":   2,
    "Epic":   3,
}

CATEGORY_MAP: dict[str, int] = {
    "Intellect":  0,
    "Strength":   1,
    "Health":     2,
    "Mind":       3,
    "Discipline": 4,
    "Endurance":  5,
}

FEATURE_NAMES = [
    "difficulty_encoded",
    "category_encoded",
    "xp_reward",
    "user_streak",
    "category_familiarity",
]


def encode_features(
    difficulty: str,
    category: str,
    xp_reward: int,
    user_streak: int,
    category_familiarity: float,
) -> np.ndarray:
    """
    Encode raw input into the model's expected feature vector.

    Returns a (1, 5) numpy array ready for model.predict_proba().
    """
    return np.array([[
        DIFFICULTY_MAP.get(difficulty, 1),
        CATEGORY_MAP.get(category, 0),
        float(xp_reward),
        float(user_streak),
        float(category_familiarity),
    ]])


def normalize_xp(xp_reward: int, max_xp: int = 500) -> float:
    """Normalise XP reward to 0–1 range."""
    return min(xp_reward / max_xp, 1.0)


def clamp_probability(raw: float, lo: float = 0.05, hi: float = 0.98) -> float:
    """Clamp a raw probability into a sensible [lo, hi] range."""
    return max(lo, min(hi, raw))
