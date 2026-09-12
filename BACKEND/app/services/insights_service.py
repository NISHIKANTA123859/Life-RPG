"""Insights and analytics service for Quest Intelligence page."""
from datetime import datetime, timedelta
from collections import Counter, defaultdict
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.quest import Quest, QuestCompletion
from app.models.user import Character


def get_insights(db: Session, user_id: int) -> dict:
    """Calculate productivity insights from quest completion history."""
    completions = (
        db.query(QuestCompletion)
        .filter(QuestCompletion.user_id == user_id)
        .all()
    )

    quests = db.query(Quest).filter(Quest.user_id == user_id).all()
    character = db.query(Character).filter(Character.user_id == user_id).first()

    # Peak completion hour
    hour_counts = Counter()
    day_counts = Counter()
    for c in completions:
        if c.completed_at:
            hour_counts[c.completed_at.hour] += 1
            day_counts[c.completed_at.strftime("%A")] += 1

    peak_hour = "9–11 AM"
    if hour_counts:
        best_hour = max(hour_counts, key=hour_counts.get)
        end_hour = best_hour + 2
        peak_hour = f"{best_hour % 12 or 12}–{end_hour % 12 or 12} {'AM' if best_hour < 12 else 'PM'}"

    best_day = "Thursday"
    if day_counts:
        best_day = max(day_counts, key=day_counts.get)

    # Strongest category
    category_counts = Counter()
    for q in quests:
        if q.status == "completed":
            category_counts[q.category] += 1

    strongest = "Intellect"
    weakest = "Strength"
    if category_counts:
        strongest = max(category_counts, key=category_counts.get)
        # Find weakest among all known categories
        all_cats = ["Intellect", "Strength", "Health", "Mind", "Discipline", "Endurance"]
        weakest = min(all_cats, key=lambda c: category_counts.get(c, 0))

    # Average quests per day
    if completions:
        first = min(c.completed_at for c in completions if c.completed_at)
        days_active = max(1, (datetime.utcnow() - first).days)
        avg_per_day = round(len(completions) / days_active, 1)
    else:
        avg_per_day = 0

    # Weekly completion data (last 6 weeks)
    weekly_data = []
    now = datetime.utcnow()
    for i in range(5, -1, -1):
        week_start = now - timedelta(weeks=i + 1)
        week_end = now - timedelta(weeks=i)
        week_num = week_start.isocalendar()[1]
        
        completed = sum(
            1 for c in completions
            if c.completed_at and week_start <= c.completed_at < week_end
        )
        total = sum(
            1 for q in quests
            if q.created_at and week_start <= q.created_at < week_end
        )
        total = max(total, completed)  # ensure total >= completed
        
        weekly_data.append({
            "week": f"W{week_num}",
            "completed": completed,
            "total": total if total > 0 else completed + 2,
        })

    # Radar data from character attributes
    radar_data = []
    if character:
        for attr, label in [
            ("intellect", "Intellect"), ("strength", "Strength"),
            ("health", "Health"), ("mind", "Mind"),
            ("discipline", "Discipline"), ("endurance", "Endurance"),
        ]:
            radar_data.append({
                "subject": label,
                "A": getattr(character, attr, 50),
                "fullMark": 100,
            })

    return {
        "insights": [
            {"label": "Best day for quests", "value": best_day, "color": "#8B5CF6"},
            {"label": "Peak completion time", "value": peak_hour, "color": "#22D3EE"},
            {"label": "Strongest category", "value": strongest, "color": "#34D399"},
            {"label": "Needs attention", "value": weakest, "color": "#F0466B"},
            {"label": "Avg quest/day", "value": str(avg_per_day), "color": "#F5B92C"},
        ],
        "weekly_completion": weekly_data,
        "category_radar": radar_data,
    }
