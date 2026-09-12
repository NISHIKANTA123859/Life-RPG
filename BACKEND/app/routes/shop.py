"""Shop routes: list items and buy."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Character
from app.models.shop import ShopItem, Inventory
from app.models.activity import Activity
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/shop", tags=["shop"])


@router.get("/items")
def list_shop_items(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(ShopItem).order_by(ShopItem.id).all()
    
    # Check which items the user owns
    owned_ids = {
        inv.shop_item_id
        for inv in db.query(Inventory).filter(Inventory.user_id == user.id).all()
    }

    result = []
    for item in items:
        result.append({
            "id": item.id,
            "icon": item.icon,
            "name": item.name,
            "desc": item.description,
            "price": item.price,
            "rarity": item.rarity,
            "category": item.category,
            "bonus": item.bonus,
            "owned": item.id in owned_ids,
            "levelRequired": item.level_required,
        })

    return result


@router.post("/items/{item_id}/buy")
def buy_item(item_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(ShopItem).filter(ShopItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    character = db.query(Character).filter(Character.user_id == user.id).first()
    if not character:
        raise HTTPException(status_code=400, detail="No character found")

    # Check if already owned
    existing = db.query(Inventory).filter(
        Inventory.user_id == user.id, Inventory.shop_item_id == item_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Item already owned")

    # Check level requirement
    if item.level_required and character.level < item.level_required:
        raise HTTPException(status_code=400, detail=f"Requires level {item.level_required}")

    # Check gold
    if character.gold < item.price:
        raise HTTPException(status_code=400, detail="Not enough gold")

    # Deduct gold
    character.gold -= item.price

    # Add to inventory
    inv = Inventory(
        user_id=user.id,
        shop_item_id=item.id,
        slot=item.slot,
    )
    db.add(inv)

    # Log activity
    activity = Activity(
        user_id=user.id,
        type="purchase",
        icon=item.icon,
        title=f"Purchased: {item.name}",
        detail=f"-{item.price} Gold",
        xp=0,
        gold=-item.price,
        color="#F5B92C",
    )
    db.add(activity)

    db.commit()
    return {
        "success": True,
        "item_name": item.name,
        "new_gold": character.gold,
    }
