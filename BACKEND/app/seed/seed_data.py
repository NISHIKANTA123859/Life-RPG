"""
Seed script — populates the database with achievements, shop items, and skills.

Usage:
    # From the BACKEND directory (with venv active):
    python -m app.seed.seed_data

    # Or from Python:
    from app.seed.seed_data import run_seed
    run_seed()
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.database import engine, Base, SessionLocal

# Ensure all models are registered before create_all
from app.models import *  # noqa: F401,F403


# ── Achievement definitions ───────────────────────────────────────────
ACHIEVEMENTS = [
    # Beginner
    {"key": "FIRST_QUEST",    "name": "First Step",         "icon": "⚔️",  "description": "Complete your very first quest.",                   "rarity": "Common",    "xp_reward": 50,  "requirement_type": "quests_completed", "requirement_value": 1},
    {"key": "QUEST_10",       "name": "Apprentice",         "icon": "🗡️",  "description": "Complete 10 quests.",                              "rarity": "Common",    "xp_reward": 100, "requirement_type": "quests_completed", "requirement_value": 10},
    {"key": "QUEST_25",       "name": "Journeyman",         "icon": "🏹",  "description": "Complete 25 quests.",                              "rarity": "Uncommon",  "xp_reward": 200, "requirement_type": "quests_completed", "requirement_value": 25},
    {"key": "QUEST_50",       "name": "Veteran Hero",       "icon": "🛡️",  "description": "Complete 50 quests.",                              "rarity": "Rare",      "xp_reward": 350, "requirement_type": "quests_completed", "requirement_value": 50},
    {"key": "QUEST_100",      "name": "Legendary Slayer",   "icon": "🔱",  "description": "Complete 100 quests.",                             "rarity": "Epic",      "xp_reward": 600, "requirement_type": "quests_completed", "requirement_value": 100},
    # Streaks
    {"key": "STREAK_3",       "name": "Consistent",         "icon": "🔥",  "description": "Maintain a 3-day streak.",                         "rarity": "Common",    "xp_reward": 75,  "requirement_type": "streak",           "requirement_value": 3},
    {"key": "STREAK_7",       "name": "Weekly Warrior",     "icon": "🌟",  "description": "Maintain a 7-day streak.",                         "rarity": "Uncommon",  "xp_reward": 150, "requirement_type": "streak",           "requirement_value": 7},
    {"key": "STREAK_30",      "name": "Iron Will",          "icon": "💎",  "description": "Maintain a 30-day streak.",                        "rarity": "Legendary", "xp_reward": 500, "requirement_type": "streak",           "requirement_value": 30},
    # Levels
    {"key": "LEVEL_5",        "name": "Rising Star",        "icon": "⭐",  "description": "Reach level 5.",                                   "rarity": "Common",    "xp_reward": 100, "requirement_type": "level",            "requirement_value": 5},
    {"key": "LEVEL_10",       "name": "Seasoned Adventurer","icon": "🌙",  "description": "Reach level 10.",                                  "rarity": "Uncommon",  "xp_reward": 200, "requirement_type": "level",            "requirement_value": 10},
    {"key": "LEVEL_25",       "name": "Legendary Hero",     "icon": "👑",  "description": "Reach level 25.",                                  "rarity": "Legendary", "xp_reward": 750, "requirement_type": "level",            "requirement_value": 25},
    # Gold
    {"key": "GOLD_500",       "name": "Coin Collector",     "icon": "💰",  "description": "Accumulate 500 Gold.",                             "rarity": "Common",    "xp_reward": 50,  "requirement_type": "gold",             "requirement_value": 500},
    {"key": "GOLD_2000",      "name": "Wealthy Adventurer", "icon": "💎",  "description": "Accumulate 2,000 Gold.",                           "rarity": "Rare",      "xp_reward": 200, "requirement_type": "gold",             "requirement_value": 2000},
    # Attributes
    {"key": "INTELLECT_75",   "name": "Scholar Supreme",    "icon": "🧠",  "description": "Raise Intellect to 75.",                           "rarity": "Rare",      "xp_reward": 300, "requirement_type": "intellect",        "requirement_value": 75},
    {"key": "STRENGTH_75",    "name": "Iron Fist",          "icon": "💪",  "description": "Raise Strength to 75.",                            "rarity": "Rare",      "xp_reward": 300, "requirement_type": "strength",         "requirement_value": 75},
    {"key": "HEALTH_75",      "name": "Vitality Master",    "icon": "❤️",  "description": "Raise Health to 75.",                              "rarity": "Rare",      "xp_reward": 300, "requirement_type": "health",           "requirement_value": 75},
    {"key": "MIND_75",        "name": "Mindful Champion",   "icon": "🧘",  "description": "Raise Mind to 75.",                                "rarity": "Rare",      "xp_reward": 300, "requirement_type": "mind",             "requirement_value": 75},
    {"key": "DISCIPLINE_75",  "name": "Iron Discipline",    "icon": "📝",  "description": "Raise Discipline to 75.",                          "rarity": "Rare",      "xp_reward": 300, "requirement_type": "discipline",       "requirement_value": 75},
    {"key": "ENDURANCE_75",   "name": "Endurance Legend",   "icon": "🏃",  "description": "Raise Endurance to 75.",                           "rarity": "Rare",      "xp_reward": 300, "requirement_type": "endurance",        "requirement_value": 75},
    # XP milestones
    {"key": "XP_1000",        "name": "XP Hunter",          "icon": "✨",  "description": "Earn 1,000 total XP.",                             "rarity": "Common",    "xp_reward": 100, "requirement_type": "total_xp",         "requirement_value": 1000},
    {"key": "XP_10000",       "name": "XP Legend",          "icon": "🌌",  "description": "Earn 10,000 total XP.",                            "rarity": "Epic",      "xp_reward": 500, "requirement_type": "total_xp",         "requirement_value": 10000},
]

# ── Shop item definitions ─────────────────────────────────────────────
SHOP_ITEMS = [
    # Equipment
    {"name": "Iron Sword",       "icon": "⚔️",  "description": "A sturdy blade for the aspiring hero.",       "price": 150,  "rarity": "Common",    "category": "Equipment", "bonus": "+5 Strength",  "slot": "Weapon",   "level_required": 1},
    {"name": "Scholar's Tome",   "icon": "📖",  "description": "Rare knowledge inscribed on ancient pages.",  "price": 200,  "rarity": "Common",    "category": "Equipment", "bonus": "+5 Intellect", "slot": "Off-hand", "level_required": 1},
    {"name": "Monk's Robe",      "icon": "🧘",  "description": "Grants inner peace and mental fortitude.",    "price": 175,  "rarity": "Common",    "category": "Equipment", "bonus": "+5 Mind",      "slot": "Body",     "level_required": 1},
    {"name": "Steel Shield",     "icon": "🛡️",  "description": "Deflects attacks and boosts resilience.",    "price": 250,  "rarity": "Uncommon",  "category": "Equipment", "bonus": "+8 Health",    "slot": "Off-hand", "level_required": 3},
    {"name": "Ranger's Hood",    "icon": "🏹",  "description": "Lightweight and focused for long journeys.", "price": 220,  "rarity": "Uncommon",  "category": "Equipment", "bonus": "+5 Endurance", "slot": "Head",     "level_required": 3},
    {"name": "Dragon Gauntlets", "icon": "🐉",  "description": "Forged from dragonscale. Immense power.",   "price": 600,  "rarity": "Epic",      "category": "Equipment", "bonus": "+15 Strength", "slot": "Weapon",   "level_required": 10},
    {"name": "Crown of Wisdom",  "icon": "👑",  "description": "Worn only by the greatest scholars.",        "price": 800,  "rarity": "Legendary", "category": "Equipment", "bonus": "+20 Intellect","slot": "Head",     "level_required": 15},
    # Boosts
    {"name": "XP Potion",        "icon": "🧪",  "description": "Doubles XP earned for your next quest.",     "price": 100,  "rarity": "Common",    "category": "Boosts",    "bonus": "2× XP (next quest)",    "slot": None, "level_required": 1},
    {"name": "Gold Rush Scroll", "icon": "📜",  "description": "Earn 50% more gold for your next 3 quests.","price": 250,  "rarity": "Uncommon",  "category": "Boosts",    "bonus": "+50% Gold (3 quests)",  "slot": None, "level_required": 5},
    {"name": "Elixir of Focus",  "icon": "⚗️",  "description": "Adds +10 to all attribute gains today.",    "price": 350,  "rarity": "Rare",      "category": "Boosts",    "bonus": "+10 All Attrs (1 day)", "slot": None, "level_required": 8},
    # Cosmetics
    {"name": "Flame Aura",       "icon": "🔥",  "description": "Wraps your avatar in a fierce fire aura.",  "price": 300,  "rarity": "Rare",      "category": "Cosmetics", "bonus": "Fire Aura Effect",     "slot": None, "level_required": 5},
    {"name": "Galaxy Cloak",     "icon": "🌌",  "description": "A shimmering cosmic cloak.",                 "price": 500,  "rarity": "Epic",      "category": "Cosmetics", "bonus": "Cosmic Cloak Effect",  "slot": "Body","level_required": 12},
]

# ── Skill definitions ─────────────────────────────────────────────────
SKILLS = [
    # Intellect tree
    {"tree": "Intellect", "key": "study_basics",    "name": "Study Basics",    "icon": "📚", "xp_required": 0,    "bonus": "+3 Intellect",    "parent_key": None},
    {"tree": "Intellect", "key": "deep_reading",    "name": "Deep Reading",    "icon": "📖", "xp_required": 200,  "bonus": "+5 Intellect",    "parent_key": "study_basics"},
    {"tree": "Intellect", "key": "programming",     "name": "Programming",     "icon": "💻", "xp_required": 500,  "bonus": "+8 Intellect",    "parent_key": "deep_reading"},
    {"tree": "Intellect", "key": "machine_learning","name": "Machine Learning","icon": "🤖", "xp_required": 1500, "bonus": "+12 Intellect",   "parent_key": "programming"},
    # Strength tree
    {"tree": "Strength",  "key": "basic_workout",   "name": "Basic Workout",   "icon": "🏋️", "xp_required": 0,    "bonus": "+3 Strength",     "parent_key": None},
    {"tree": "Strength",  "key": "weightlifting",   "name": "Weightlifting",   "icon": "💪", "xp_required": 300,  "bonus": "+6 Strength",     "parent_key": "basic_workout"},
    {"tree": "Strength",  "key": "powerlifting",    "name": "Powerlifting",    "icon": "🏆", "xp_required": 900,  "bonus": "+10 Strength",    "parent_key": "weightlifting"},
    # Mind tree
    {"tree": "Mind",      "key": "meditation_I",    "name": "Meditation I",    "icon": "🧘", "xp_required": 0,    "bonus": "+3 Mind",         "parent_key": None},
    {"tree": "Mind",      "key": "mindfulness",     "name": "Mindfulness",     "icon": "☯️", "xp_required": 400,  "bonus": "+6 Mind",         "parent_key": "meditation_I"},
    {"tree": "Mind",      "key": "zen_mastery",     "name": "Zen Mastery",     "icon": "🌸", "xp_required": 1200, "bonus": "+10 Mind",        "parent_key": "mindfulness"},
    # Endurance tree
    {"tree": "Endurance", "key": "cardio_basics",   "name": "Cardio Basics",   "icon": "🏃", "xp_required": 0,    "bonus": "+3 Endurance",    "parent_key": None},
    {"tree": "Endurance", "key": "long_distance",   "name": "Long Distance",   "icon": "🚴", "xp_required": 350,  "bonus": "+6 Endurance",    "parent_key": "cardio_basics"},
    {"tree": "Endurance", "key": "marathon",        "name": "Marathon",        "icon": "🥇", "xp_required": 1000, "bonus": "+10 Endurance",   "parent_key": "long_distance"},
]


def run_seed():
    """Create tables and populate seed data. Safe to run multiple times (idempotent)."""
    from app.models.achievement import Achievement, UserAchievement
    from app.models.shop import ShopItem, Inventory
    from app.models.skill import Skill, UserSkill

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ── Achievements ─────────────────────────────────────────────
        existing_ach_keys = {a.key for a in db.query(Achievement.key).all()}
        for ach_data in ACHIEVEMENTS:
            if ach_data["key"] not in existing_ach_keys:
                db.add(Achievement(**ach_data))
        db.flush()

        # ── Shop items ───────────────────────────────────────────────
        existing_item_names = {i.name for i in db.query(ShopItem.name).all()}
        for item_data in SHOP_ITEMS:
            if item_data["name"] not in existing_item_names:
                db.add(ShopItem(**item_data))
        db.flush()

        # ── Skills ───────────────────────────────────────────────────
        existing_skill_keys = {s.key for s in db.query(Skill.key).all()}
        for skill_data in SKILLS:
            if skill_data["key"] not in existing_skill_keys:
                db.add(Skill(**skill_data))

        db.commit()
        print("✅ Seed data applied successfully.")
    except Exception as exc:
        db.rollback()
        print(f"❌ Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
