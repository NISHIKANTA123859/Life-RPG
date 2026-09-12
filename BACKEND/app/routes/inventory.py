"""Inventory routes: list items and equip/unequip."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.shop import Inventory
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


@router.get("")
def list_inventory(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Inventory).filter(Inventory.user_id == user.id).order_by(Inventory.acquired_at.desc()).all()
    
    result = []
    for inv in items:
        item = inv.shop_item
        result.append({
            "id": inv.id,
            "icon": item.icon if item else "📦",
            "name": item.name if item else "Unknown",
            "desc": item.description if item else "",
            "rarity": item.rarity if item else "Common",
            "bonus": item.bonus if item else "",
            "slot": inv.slot,
            "equipped": inv.equipped,
            "quantity": inv.quantity,
        })

    return result


@router.post("/{inv_id}/equip")
def equip_item(inv_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    inv = db.query(Inventory).filter(Inventory.id == inv_id, Inventory.user_id == user.id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    # Toggle equip state
    if inv.equipped:
        inv.equipped = False
    else:
        # Unequip any item in the same slot
        if inv.slot:
            same_slot = db.query(Inventory).filter(
                Inventory.user_id == user.id,
                Inventory.slot == inv.slot,
                Inventory.equipped == True,
            ).all()
            for s in same_slot:
                s.equipped = False
        inv.equipped = True

    db.commit()
    return {"success": True, "equipped": inv.equipped}
