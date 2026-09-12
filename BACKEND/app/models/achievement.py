from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, nullable=False) # e.g. FIRST_QUEST, CONSISTENT
    name = Column(String(100), nullable=False)
    icon = Column(String(20), nullable=False, default="🏆")
    description = Column(Text, nullable=False)
    rarity = Column(String(20), nullable=False, default="Common") # Common, Uncommon, Rare, Epic, Legendary
    xp_reward = Column(Integer, default=50)
    requirement_type = Column(String(50), nullable=False) # quests_completed, streak, intellect, gold, level, category_quests
    requirement_value = Column(Integer, nullable=False, default=1)

    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")

    @property
    def title(self):
        return self.name

    @title.setter
    def title(self, value):
        self.name = value

    @property
    def category(self):
        return self.rarity

    @category.setter
    def category(self, value):
        self.rarity = value

    @property
    def target_value(self):
        return self.requirement_value

    @target_value.setter
    def target_value(self, value):
        self.requirement_value = value


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False, index=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    progress = Column(Integer, default=100)

    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),
    )

    # Relationships
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
