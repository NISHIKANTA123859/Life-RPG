from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=True, default="Hero")
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    character = relationship("Character", back_populates="user", uselist=False, cascade="all, delete-orphan")
    quests = relationship("Quest", back_populates="user", cascade="all, delete-orphan")
    quest_completions = relationship("QuestCompletion", back_populates="user", cascade="all, delete-orphan")
    user_achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    inventory_items = relationship("Inventory", back_populates="user", cascade="all, delete-orphan")
    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")


class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    class_name = Column(String(50), nullable=False, default="Scholar")
    
    # Progression
    level = Column(Integer, default=1, nullable=False)
    current_xp = Column(Integer, default=0, nullable=False)
    required_xp = Column(Integer, default=100, nullable=False)
    total_xp = Column(Integer, default=0, nullable=False)
    gold = Column(Integer, default=250, nullable=False)
    
    # Streaks
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    last_completion_date = Column(Date, nullable=True)

    # Attributes (0 - 100)
    intellect = Column(Integer, default=50, nullable=False)
    strength = Column(Integer, default=50, nullable=False)
    health = Column(Integer, default=50, nullable=False)
    mind = Column(Integer, default=50, nullable=False)
    discipline = Column(Integer, default=50, nullable=False)
    endurance = Column(Integer, default=50, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="character")
