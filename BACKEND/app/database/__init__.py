"""
Database package.
Re-exports engine, SessionLocal, Base, and get_db from the root database module
so that both `app.database` and `app.database.connection` / `app.database.base`
import paths work correctly.
"""
from app.database.connection import engine, SessionLocal, get_db
from app.database.base import Base

__all__ = ["engine", "SessionLocal", "Base", "get_db"]
