"""
Application configuration using environment variables.
All settings are loaded from .env via python-dotenv.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # ── Project metadata ──────────────────────────────────────────────
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Life RPG API")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_PREFIX: str = os.getenv("API_V1_PREFIX", "/api")

    # ── Database ──────────────────────────────────────────────────────
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/life_rpg",
    )
    SQLITE_FALLBACK_URL: str = os.getenv(
        "SQLITE_FALLBACK_URL",
        "sqlite:///./life_rpg.db",
    )

    # ── JWT / Security ────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "super-secret-life-rpg-jwt-token-key-change-in-prod",
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )

    # ── CORS ──────────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8443",
    ]

    # ── ML ────────────────────────────────────────────────────────────
    ML_MODEL_PATH: str = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "ml", "life_rpg_recommender.pkl"
    )


settings = Settings()
