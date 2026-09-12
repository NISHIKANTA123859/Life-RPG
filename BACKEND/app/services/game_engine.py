"""Core game engine: XP curves, levelling, streaks, quest completion logic."""
from datetime import date, datetime
from sqlalchemy.orm import Session

from app.models.user import Character
from app.models.quest import Quest, QuestCompletion
from app.models.activity import Activity


# ── XP Curve ─────────────────────────────────────────────────────────
def required_xp_for_level(level: int) -> int:
    """Non-linear XP requirement: 100 * level^2."""
    return 100 * (level ** 2)


# ── Difficulty → Rewards ─────────────────────────────────────────────
DIFFICULTY_REWARDS = {
    "Easy":   {"xp": 60,  "gold": 20,  "attr": 1},
    "Medium": {"xp": 120, "gold": 50,  "attr": 2},
    "Hard":   {"xp": 250, "gold": 100, "attr": 3},
    "Epic":   {"xp": 500, "gold": 200, "attr": 5},
}

# ── Category → Attribute mapping ─────────────────────────────────────
CATEGORY_ATTRIBUTE_MAP = {
    "Intellect":  "intellect",
    "Strength":   "strength",
    "Health":     "health",
    "Mind":       "mind",
    "Discipline": "discipline",
    "Endurance":  "endurance",
}

# ── Category → Color ─────────────────────────────────────────────────
CATEGORY_COLORS = {
    "Intellect":  "#22D3EE",
    "Strength":   "#F0466B",
    "Health":     "#34D399",
    "Mind":       "#8B5CF6",
    "Discipline": "#F5B92C",
    "Endurance":  "#F97316",
}

# ── Category → Icon ──────────────────────────────────────────────────
CATEGORY_ICONS = {
    "Intellect":  "🧠",
    "Strength":   "💪",
    "Health":     "❤️",
    "Mind":       "🧘",
    "Discipline": "📝",
    "Endurance":  "🏃",
}


def update_streak(character: Character) -> int:
    """Update character streak based on last completion date. Returns new streak."""
    today = date.today()
    if character.last_completion_date is None:
        character.current_streak = 1
    elif character.last_completion_date == today:
        pass  # already completed today
    elif (today - character.last_completion_date).days == 1:
        character.current_streak += 1
    elif (today - character.last_completion_date).days > 1:
        character.current_streak = 1  # streak broken
    
    character.last_completion_date = today
    if character.current_streak > character.longest_streak:
        character.longest_streak = character.current_streak
    return character.current_streak


def apply_xp_and_level(character: Character, xp_earned: int) -> bool:
    """Add XP to character and handle levelling. Returns True if levelled up."""
    character.current_xp += xp_earned
    character.total_xp += xp_earned
    levelled_up = False
    while character.current_xp >= character.required_xp:
        character.current_xp -= character.required_xp
        character.level += 1
        character.required_xp = required_xp_for_level(character.level)
        levelled_up = True
    return levelled_up


def complete_quest(db: Session, quest: Quest, character: Character) -> dict:
    """
    Complete a quest: award XP, gold, attribute points; update streak; log activity.
    Returns a result dict with all changes.
    """
    if quest.status == "completed":
        raise ValueError("Quest already completed")

    rewards = DIFFICULTY_REWARDS.get(quest.difficulty, DIFFICULTY_REWARDS["Easy"])
    xp_earned = quest.xp_reward or rewards["xp"]
    gold_earned = quest.gold_reward or rewards["gold"]
    attr_gain = quest.attribute_reward or rewards["attr"]

    # Mark quest completed
    quest.status = "completed"
    quest.completed_at = datetime.utcnow()

    # Record completion
    completion = QuestCompletion(
        quest_id=quest.id,
        user_id=character.user_id,
        xp_earned=xp_earned,
        gold_earned=gold_earned,
    )
    db.add(completion)

    # Award gold
    character.gold += gold_earned

    # Award XP and check level up
    level_up = apply_xp_and_level(character, xp_earned)

    # Update streak
    streak = update_streak(character)

    # Award attribute points
    attr_key = CATEGORY_ATTRIBUTE_MAP.get(quest.category, "intellect")
    current_val = getattr(character, attr_key, 50)
    new_val = min(100, current_val + attr_gain)
    setattr(character, attr_key, new_val)

    # Log activity
    activity = Activity(
        user_id=character.user_id,
        type="quest",
        icon=quest.icon or "⚔️",
        title=f"Completed: {quest.name}",
        detail=f"+{xp_earned} XP, +{gold_earned} Gold, +{attr_gain} {attr_key.upper()}",
        xp=xp_earned,
        gold=gold_earned,
        color=CATEGORY_COLORS.get(quest.category, "#8B5CF6"),
    )
    db.add(activity)

    if level_up:
        level_activity = Activity(
            user_id=character.user_id,
            type="level",
            icon="⬆️",
            title=f"Level Up! Now Level {character.level}",
            detail=f"Unlocked new abilities at level {character.level}",
            xp=0,
            gold=0,
            color="#F5B92C",
        )
        db.add(level_activity)

    # Build attribute label matching frontend format e.g. "INT +3"
    attr_short_map = {
        "intellect": "INT", "strength": "STR", "health": "HLT",
        "mind": "MND", "discipline": "DIS", "endurance": "END",
    }
    attribute_label = f"{attr_short_map.get(attr_key, 'INT')} +{attr_gain}"

    return {
        "success": True,
        "message": "Quest completed successfully",
        "quest_id": quest.id,
        "xp_earned": xp_earned,
        "gold_earned": gold_earned,
        "attribute": attribute_label,
        "attribute_gain": attr_gain,
        "new_xp": character.current_xp,
        "new_gold": character.gold,
        "new_level": character.level,
        "level_up": level_up,
        "streak": character.current_streak,
        "reward": {
            "xp": xp_earned,
            "gold": gold_earned,
            "attribute": attribute_label,
            "attribute_reward": attr_gain,
        },
        "character": {
            "level": character.level,
            "current_xp": character.current_xp,
            "gold": character.gold,
            "streak": character.current_streak,
            "current_streak": character.current_streak,
            "required_xp": character.required_xp,
            "intellect": character.intellect,
            "strength": character.strength,
            "health": character.health,
            "mind": character.mind,
            "discipline": character.discipline,
            "endurance": character.endurance,
        },
    }
