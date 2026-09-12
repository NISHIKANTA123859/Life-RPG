"""
Seed the database with default data.
Usage: cd BACKEND && python -m app.seed
"""
import logging
from app.database import engine, Base, SessionLocal
from app.models import *  # noqa: F401,F403
from app.models.user import User, Character
from app.models.quest import Quest
from app.models.achievement import Achievement
from app.models.shop import ShopItem, Inventory
from app.models.skill import Skill, UserSkill
from app.models.activity import Activity
from app.services.auth_service import hash_password
from app.services.game_engine import (
    required_xp_for_level,
    DIFFICULTY_REWARDS,
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    CATEGORY_ATTRIBUTE_MAP,
)
from app.utils.seed_data import (
    SEED_ACHIEVEMENTS,
    SEED_SHOP_ITEMS,
    SEED_SKILLS,
    SEED_DEMO_QUESTS,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("life_rpg.seed")


def seed():
    """Create tables and populate with seed data."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Tables created.")

    db = SessionLocal()
    try:
        # Seed achievements
        existing_keys = {a.key for a in db.query(Achievement).all()}
        added_count = 0
        for ach_data in SEED_ACHIEVEMENTS:
            if ach_data["key"] not in existing_keys:
                db.add(Achievement(**ach_data))
                added_count += 1
        db.commit()
        logger.info(f"✅ Achievements: {added_count} new, {len(existing_keys)} existing.")

        # Seed shop items
        existing_names = {s.name for s in db.query(ShopItem).all()}
        added_count = 0
        for item_data in SEED_SHOP_ITEMS:
            if item_data["name"] not in existing_names:
                db.add(ShopItem(**item_data))
                added_count += 1
        db.commit()
        logger.info(f"✅ Shop items: {added_count} new, {len(existing_names)} existing.")

        # Seed skills
        existing_skill_keys = {s.key for s in db.query(Skill).all()}
        added_count = 0
        for skill_data in SEED_SKILLS:
            if skill_data["key"] not in existing_skill_keys:
                db.add(Skill(**skill_data))
                added_count += 1
        db.commit()
        logger.info(f"✅ Skills: {added_count} new, {len(existing_skill_keys)} existing.")

        # Seed demo user if no users exist
        if db.query(User).count() == 0:
            logger.info("No users found. Creating demo hero...")
            demo_user = User(
                email="aria@liferpg.gg",
                password_hash=hash_password("password123"),
            )
            db.add(demo_user)
            db.flush()

            demo_char = Character(
                user_id=demo_user.id,
                name="Aria Thornwood",
                class_name="Scholar",
                level=24,
                current_xp=8420,
                required_xp=required_xp_for_level(24),
                total_xp=45000,
                gold=3740,
                current_streak=14,
                longest_streak=14,
                intellect=78,
                strength=45,
                health=62,
                mind=85,
                discipline=70,
                endurance=53,
            )
            db.add(demo_char)
            db.flush()

            # Add demo quests
            for qdata in SEED_DEMO_QUESTS:
                rewards = DIFFICULTY_REWARDS.get(qdata["difficulty"], DIFFICULTY_REWARDS["Easy"])
                cat = qdata["category"]
                attr_key = CATEGORY_ATTRIBUTE_MAP.get(cat, "intellect")
                attr_short = {"intellect": "INT", "strength": "STR", "health": "HLT", "mind": "MND", "discipline": "DIS", "endurance": "END"}
                
                quest = Quest(
                    user_id=demo_user.id,
                    name=qdata["name"],
                    category=cat,
                    category_color=CATEGORY_COLORS.get(cat, "#8B5CF6"),
                    icon=CATEGORY_ICONS.get(cat, "⚔️"),
                    difficulty=qdata["difficulty"],
                    due_date=qdata.get("due_date"),
                    estimated_time=qdata.get("estimated_time"),
                    xp_reward=rewards["xp"],
                    gold_reward=rewards["gold"],
                    attribute=f"{attr_short.get(attr_key, 'INT')} +{rewards['attr']}",
                    attribute_reward=rewards["attr"],
                )
                db.add(quest)

            # Give demo user some owned shop items
            shop_items = db.query(ShopItem).filter(ShopItem.name.in_(["Scholar's Crown", "Focus Crystal", "Tome of Algorithms"])).all()
            for item in shop_items:
                inv = Inventory(
                    user_id=demo_user.id,
                    shop_item_id=item.id,
                    equipped=True if item.slot else False,
                    slot=item.slot,
                )
                db.add(inv)

            # Unlock some skills for demo user
            starter_skills = db.query(Skill).filter(Skill.xp_required <= 500).all()
            for skill in starter_skills:
                us = UserSkill(
                    user_id=demo_user.id,
                    skill_id=skill.id,
                    state="unlocked" if skill.xp_required <= 200 else "available",
                )
                db.add(us)

            # Add some activity history
            from datetime import datetime, timedelta
            activities_data = [
                {"type": "quest", "icon": "🧠", "title": "Completed: Study Advanced Algorithms", "detail": "+250 XP, +100 Gold, +3 INT", "xp": 250, "gold": 100, "color": "#22D3EE"},
                {"type": "achievement", "icon": "🔥", "title": "Achievement Unlocked: Consistent", "detail": "Maintain a 7-day quest streak.", "xp": 150, "gold": 0, "color": "#F5B92C"},
                {"type": "level", "icon": "⬆️", "title": "Level Up! Now Level 24", "detail": "Unlocked new abilities at level 24", "xp": 0, "gold": 0, "color": "#F5B92C"},
                {"type": "quest", "icon": "💪", "title": "Completed: Morning Workout", "detail": "+120 XP, +50 Gold, +2 STR", "xp": 120, "gold": 50, "color": "#F0466B"},
                {"type": "purchase", "icon": "👑", "title": "Purchased: Scholar's Crown", "detail": "-800 Gold", "xp": 0, "gold": -800, "color": "#F5B92C"},
            ]
            for i, adata in enumerate(activities_data):
                activity = Activity(
                    user_id=demo_user.id,
                    created_at=datetime.utcnow() - timedelta(hours=i * 6),
                    **adata,
                )
                db.add(activity)

            db.commit()
            logger.info("✅ Demo hero 'Aria Thornwood' created with quests, inventory, skills, and activity history.")
            logger.info("   Login: aria@liferpg.gg / password123")
        else:
            logger.info(f"ℹ️  {db.query(User).count()} user(s) already exist. Skipping demo user creation.")

        logger.info("🎮 Seed complete!")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
