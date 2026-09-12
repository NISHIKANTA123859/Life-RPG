"""
Database connection setup.
Tries PostgreSQL first; falls back to SQLite automatically when Postgres is
not reachable (useful for local development without Docker).
"""
import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.base import Base  # noqa: F401 — ensure Base is importable here

load_dotenv()

logger = logging.getLogger("life_rpg.database")
logging.basicConfig(level=logging.INFO)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/life_rpg",
)
SQLITE_FALLBACK_URL = os.getenv(
    "SQLITE_FALLBACK_URL",
    "sqlite:///./life_rpg.db",
)

engine = None
try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        logger.info(f"Using SQLite database: {DATABASE_URL}")
    else:
        # Test PostgreSQL connectivity with a short timeout
        test_engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 3})
        with test_engine.connect():
            pass
        engine = test_engine
        logger.info(f"Connected to PostgreSQL: {DATABASE_URL.split('@')[-1]}")
except Exception as exc:
    logger.warning(
        f"Could not connect to PostgreSQL ({exc}). Falling back to SQLite: {SQLITE_FALLBACK_URL}"
    )
    engine = create_engine(
        SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency — yields a database session and closes it on exit."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
