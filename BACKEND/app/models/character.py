"""
Character model — separated for clean module structure.
The Character class lives in app.models.user for backward compatibility,
but this module re-exports it so routes/services can import from either path.
"""
from app.models.user import Character  # noqa: F401

__all__ = ["Character"]
