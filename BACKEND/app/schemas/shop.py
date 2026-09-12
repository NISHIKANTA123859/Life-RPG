from typing import Optional
from pydantic import BaseModel


class ShopItemResponse(BaseModel):
    id: int
    icon: str
    name: str
    desc: str = ""
    price: int
    rarity: str
    category: str
    bonus: str
    owned: bool = False
    levelRequired: Optional[int] = None

    class Config:
        from_attributes = True


class InventoryItemResponse(BaseModel):
    id: int
    icon: str
    name: str
    desc: str = ""
    rarity: str
    bonus: str
    slot: Optional[str] = None
    equipped: bool = False
    quantity: int = 1

    class Config:
        from_attributes = True
