from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True, default="")
    category = Column(String(50), nullable=False, default="Intellect")
    category_color = Column(String(20), default="#22D3EE")
    icon = Column(String(20), default="⚔️")
    difficulty = Column(String(20), nullable=False, default="Easy") # Easy, Medium, Hard, Epic
    
    due_date = Column(String(100), nullable=True) # e.g. "Today, 11:59 PM"
    estimated_time = Column(String(50), nullable=True) # e.g. "30 mins"
    
    xp_reward = Column(Integer, nullable=False, default=20)
    gold_reward = Column(Integer, nullable=False, default=10)
    attribute = Column(String(50), nullable=False, default="INT +1")
    attribute_reward = Column(Integer, default=1)
    
    status = Column(String(20), nullable=False, default="active") # active, completed
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def title(self):
        return self.name

    @title.setter
    def title(self, value):
        self.name = value

    @property
    def completed(self):
        return self.status == "completed"

    @completed.setter
    def completed(self, value):
        self.status = "completed" if value else "active"

    # Relationships
    user = relationship("User", back_populates="quests")
    completions = relationship("QuestCompletion", back_populates="quest", cascade="all, delete-orphan")


class QuestCompletion(Base):
    __tablename__ = "quest_completions"

    id = Column(Integer, primary_key=True, index=True)
    quest_id = Column(Integer, ForeignKey("quests.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    completed_at = Column(DateTime, default=datetime.utcnow)
    xp_earned = Column(Integer, nullable=False)
    gold_earned = Column(Integer, nullable=False)

    # Relationships
    quest = relationship("Quest", back_populates="completions")
    user = relationship("User", back_populates="quest_completions")
