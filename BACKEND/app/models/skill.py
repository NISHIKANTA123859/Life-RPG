from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    tree = Column(String(50), nullable=False) # Intellect, Strength, Mind
    key = Column(String(50), unique=True, nullable=False) # e.g. programming, python
    name = Column(String(100), nullable=False)
    icon = Column(String(20), nullable=False, default="⚡")
    xp_required = Column(Integer, default=0, nullable=False)
    bonus = Column(String(100), nullable=False, default="+5 Stat")
    parent_key = Column(String(50), nullable=True) # key of parent skill

    # Relationships
    user_skills = relationship("UserSkill", back_populates="skill", cascade="all, delete-orphan")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    state = Column(String(20), nullable=False, default="locked") # mastered, unlocked, available, locked
    unlocked_at = Column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),
    )

    # Relationships
    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")
