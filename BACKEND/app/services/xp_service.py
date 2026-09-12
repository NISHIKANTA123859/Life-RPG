"""
XP and levelling service.

Provides the canonical XP formula and helpers for awarding XP,
handling level-up cascades, and computing progress percentages.
"""
from app.models.user import Character


# ── Formula ───────────────────────────────────────────────────────────
def required_xp_for_level(level: int) -> int:
    """Non-linear XP requirement: 100 × level²."""
    return 100 * (level ** 2)


# ── Core XP award ─────────────────────────────────────────────────────
def award_xp(character: Character, xp_amount: int) -> dict:
    """
    Add `xp_amount` to character; handle level-up cascade.

    Returns a dict with:
        levelled_up (bool), levels_gained (int), new_level (int),
        new_xp (int), required_xp (int)
    """
    character.current_xp += xp_amount
    character.total_xp += xp_amount

    levels_gained = 0
    while character.current_xp >= character.required_xp:
        character.current_xp -= character.required_xp
        character.level += 1
        character.required_xp = required_xp_for_level(character.level)
        levels_gained += 1

    return {
        "levelled_up": levels_gained > 0,
        "levels_gained": levels_gained,
        "new_level": character.level,
        "new_xp": character.current_xp,
        "required_xp": character.required_xp,
    }


# ── Progress helpers ──────────────────────────────────────────────────
def xp_progress_percent(character: Character) -> float:
    """Return XP progress as a percentage (0.0 – 100.0)."""
    if character.required_xp <= 0:
        return 100.0
    return round(character.current_xp / character.required_xp * 100, 2)


def xp_to_next_level(character: Character) -> int:
    """Return XP needed to reach the next level."""
    return max(0, character.required_xp - character.current_xp)
