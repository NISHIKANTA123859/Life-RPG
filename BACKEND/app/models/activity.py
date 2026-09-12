from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    type = Column(String(50), nullable=False) # quest, level, achievement, purchase, streak
    icon = Column(String(20), nullable=False, default="⚡")
    title = Column(String(255), nullable=False)
    detail = Column(String(255), nullable=False, default="")
    xp = Column(Integer, default=0, nullable=False)
    gold = Column(Integer, default=0, nullable=False)
    color = Column(String(20), default="#8B5CF6")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    @property
    def activity_type(self):
        return self.type

    @activity_type.setter
    def activity_type(self, value):
        self.type = value

    @property
    def description(self):
        return self.detail or self.title

    @description.setter
    def description(self, value):
        self.detail = value

    @property
    def xp_change(self):
        return self.xp

    @xp_change.setter
    def xp_change(self, value):
        self.xp = value

    @property
    def gold_change(self):
        return self.gold

    @gold_change.setter
    def gold_change(self, value):
        self.gold = value

    # Relationships
    user = relationship("User", back_populates="activities")
