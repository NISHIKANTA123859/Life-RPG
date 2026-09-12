"""
Tasks router — canonical alias for the quest board endpoints.

The frontend uses /api/tasks/* for quest operations.
This module re-exports the quests router under that prefix so imports
from either `app.routes.tasks` or `app.routes.quests` work identically.
"""
from app.routes.quests import router  # noqa: F401 — re-export

__all__ = ["router"]
