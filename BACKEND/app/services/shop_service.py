"""
Shop service.

Encapsulates item purchase logic: gold checks, level gates,
duplicate ownership checks, inventory creation, and activity logging.
"""
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import Character
from app.models.shop import ShopItem, Inventory
from app.models.activity import Activity


def buy_item(db: Session, user_id: int, character: Character, item_id: int) -> dict:
    """
    Purchase a shop item for the user.

    Raises HTTPException on:
    - Item not found
    - Item already owned
    - Level requirement not met
    - Insufficient gold

    Returns dict with:
        success (bool), item_name (str), new_gold (int)
    """
    item: ShopItem | None = db.query(ShopItem).filter(ShopItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Already owned?
    already_owned = (
        db.query(Inventory)
        .filter(Inventory.user_id == user_id, Inventory.shop_item_id == item_id)
        .first()
    )
    if already_owned:
        raise HTTPException(status_code=400, detail="Item already owned")

    # Level gate
    if item.level_required and character.level < item.level_required:
        raise HTTPException(
            status_code=400,
            detail=f"Requires level {item.level_required} (you are level {character.level})",
        )

    # Gold check
    if character.gold < item.price:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough gold. Need {item.price}, have {character.gold}.",
        )

    # Deduct gold
    character.gold -= item.price

    # Add to inventory
    inv = Inventory(
        user_id=user_id,
        shop_item_id=item.id,
        slot=item.slot,
        equipped=False,
        quantity=1,
        acquired_at=datetime.utcnow(),
    )
    db.add(inv)

    # Log activity
    activity = Activity(
        user_id=user_id,
        type="purchase",
        icon=item.icon,
        title=f"Purchased: {item.name}",
        detail=f"-{item.price} Gold",
        xp=0,
        gold=-item.price,
        color="#F5B92C",
    )
    db.add(activity)

    return {
        "success": True,
        "item_name": item.name,
        "new_gold": character.gold,
    }


def equip_item(db: Session, user_id: int, inv_id: int) -> dict:
    """
    Toggle equip/unequip for an inventory item.
    Automatically unequips other items in the same slot.

    Returns dict with success (bool) and equipped (bool).
    """
    inv: Inventory | None = (
        db.query(Inventory)
        .filter(Inventory.id == inv_id, Inventory.user_id == user_id)
        .first()
    )
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if inv.equipped:
        inv.equipped = False
    else:
        # Unequip same-slot items first
        if inv.slot:
            for same in (
                db.query(Inventory)
                .filter(
                    Inventory.user_id == user_id,
                    Inventory.slot == inv.slot,
                    Inventory.equipped == True,
                )
                .all()
            ):
                same.equipped = False
        inv.equipped = True

    return {"success": True, "equipped": inv.equipped}
