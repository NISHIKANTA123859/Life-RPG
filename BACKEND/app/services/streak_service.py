"""
Streak tracking service.

Handles daily quest-completion streaks — incrementing, resetting, and
tracking the longest streak a character has achieved.
"""
from datetime import date
from app.models.user import Character


def update_streak(character: Character) -> int:
    """
    Update character streak based on last completion date.

    Rules:
    - No prior completion  → streak = 1
    - Completed today      → streak unchanged (idempotent)
    - Completed yesterday  → streak += 1
    - Gap > 1 day          → streak resets to 1

    Always updates `last_completion_date` to today.
    Returns the new current streak.
    """
    today = date.today()

    if character.last_completion_date is None:
        character.current_streak = 1
    elif character.last_completion_date == today:
        pass  # already counted today — nothing to change
    elif (today - character.last_completion_date).days == 1:
        character.current_streak += 1
    else:
        # Streak broken
        character.current_streak = 1

    character.last_completion_date = today
    if character.current_streak > character.longest_streak:
        character.longest_streak = character.current_streak

    return character.current_streak


def streak_bonus_multiplier(streak: int) -> float:
    """
    Return an XP multiplier based on active streak length.

    Milestones:
        < 3 days   → 1.00× (no bonus)
        3–6 days   → 1.10× (+10 %)
        7–13 days  → 1.25× (+25 %)
        14–29 days → 1.50× (+50 %)
        30+ days   → 2.00× (+100 %)
    """
    if streak >= 30:
        return 2.0
    if streak >= 14:
        return 1.5
    if streak >= 7:
        return 1.25
    if streak >= 3:
        return 1.1
    return 1.0


def streak_label(streak: int) -> str:
    """Human-readable streak label for the frontend."""
    if streak == 0:
        return "No streak"
    if streak == 1:
        return "🔥 1-day streak"
    return f"🔥 {streak}-day streak"
