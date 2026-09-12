from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class ShopItem(Base):
    __tablename__ = "shop_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    icon = Column(String(20), nullable=False, default="👑")
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False, default=100)
    rarity = Column(String(20), nullable=False, default="Common") # Common, Uncommon, Rare, Epic, Legendary
    category = Column(String(50), nullable=False, default="Equipment") # Equipment, Boosts, Cosmetics, Skills
    bonus = Column(String(100), nullable=False, default="+1 Stat")
    slot = Column(String(50), nullable=True) # Head, Body, Weapon, Off-hand, Ring, Boots
    level_required = Column(Integer, nullable=True, default=1)

    # Relationships
    inventory_entries = relationship("Inventory", back_populates="shop_item", cascade="all, delete-orphan")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    shop_item_id = Column(Integer, ForeignKey("shop_items.id", ondelete="CASCADE"), nullable=False, index=True)
    
    equipped = Column(Boolean, default=False, nullable=False)
    slot = Column(String(50), nullable=True)
    quantity = Column(Integer, default=1, nullable=False)
    acquired_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="inventory_items")
    shop_item = relationship("ShopItem", back_populates="inventory_entries")
