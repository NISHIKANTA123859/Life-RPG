"""
Personalized Quest Recommender — matches candidate quests to user stats,
predicts completion probabilities via predictor.py, and formats recommendations.
"""
from datetime import datetime
from typing import List, Dict, Any
from app.ml.predictor import predict_quest_likelihood

CANDIDATE_QUESTS = [
    {
        "id": 101,
        "title": "Read 50 Pages of Non-Fiction",
        "description": "Improve your knowledge and maintain your intellectual progress.",
        "category": "Intellect",
        "difficulty": "Easy",
        "xp": 60,
        "gold": 20,
        "estimated_time": 30,
        "icon": "📚",
        "color": "#22D3EE",
        "reason": "Matches your recent Intellect activity and high completion rate.",
    },
    {
        "id": 102,
        "title": "Build REST API with FastAPI",
        "description": "Develop high-performance backend microservices with automatic OpenAPI docs.",
        "category": "Intellect",
        "difficulty": "Hard",
        "xp": 200,
        "gold": 80,
        "estimated_time": 90,
        "icon": "💻",
        "color": "#22D3EE",
        "reason": "Matches your Python mastery and recent backend work.",
    },
    {
        "id": 103,
        "title": "7-Day Meditation Streak",
        "description": "Practice 15 minutes of mindfulness every day for mental clarity.",
        "category": "Mind",
        "difficulty": "Easy",
        "xp": 50,
        "gold": 15,
        "estimated_time": 15,
        "icon": "🧘",
        "color": "#8B5CF6",
        "reason": "Perfect match for your current 14-day streak momentum.",
    },
    {
        "id": 104,
        "title": "Write Technical Blog Post",
        "description": "Document your latest architecture insights and publish to the community.",
        "category": "Discipline",
        "difficulty": "Medium",
        "xp": 120,
        "gold": 50,
        "estimated_time": 60,
        "icon": "📝",
        "color": "#F5B92C",
        "reason": "Combines your Intellect and Discipline — high yield quest.",
    },
    {
        "id": 105,
        "title": "3×10 Strength Circuit",
        "description": "Perform bodyweight squats, push-ups, and pull-ups to boost physical power.",
        "category": "Strength",
        "difficulty": "Medium",
        "xp": 90,
        "gold": 30,
        "estimated_time": 40,
        "icon": "🏋️",
        "color": "#F0466B",
        "reason": "Your Strength attribute is below average. Time to level up.",
    },
    {
        "id": 106,
        "title": "5km Outdoor Endurance Run",
        "description": "Maintain a steady pace and boost cardiovascular health.",
        "category": "Endurance",
        "difficulty": "Medium",
        "xp": 100,
        "gold": 35,
        "estimated_time": 45,
        "icon": "🏃",
        "color": "#F97316",
        "reason": "Endurance training balances your physical character stats.",
    },
]


def generate_recommendations(
    user_id: int,
    character: Any,
    completed_quests_count: int = 10,
    total_quests_count: int = 12,
) -> Dict[str, Any]:
    """
    Generate ML-based recommendations for the authenticated character.
    Calculates probability for each candidate using the ML model.
    """
    current_hour = datetime.now().hour
    streak = getattr(character, "current_streak", 14) if character else 14
    comp_rate = round(completed_quests_count / total_quests_count, 2) if total_quests_count > 0 else 0.82

    results = []
    for cand in CANDIDATE_QUESTS:
        # Calculate real probability prediction via ML model pipeline
        pred = predict_quest_likelihood(
            quest_category=cand["category"],
            difficulty=cand["difficulty"],
            estimated_time=cand["estimated_time"],
            completion_rate=comp_rate,
            streak=streak,
            avg_xp=cand["xp"],
            hour=current_hour,
            previous_completed=1 if completed_quests_count > 0 else 0,
        )

        prob = pred["probability"]
        likelihood_pct = round(prob * 100)

        results.append({
            "id": cand["id"],
            "title": cand["title"],
            "description": cand["description"],
            "category": cand["category"],
            "difficulty": cand["difficulty"],
            "xp": cand["xp"],
            "gold": cand["gold"],
            "icon": cand["icon"],
            "color": cand["color"],
            "reason": cand["reason"],
            "completion_probability": prob,
            "completion_likelihood": prob,
            "likelihood": likelihood_pct,
            "ml_available": pred["ml_available"],
            "source": pred["source"],
        })

    # Sort by completion probability descending
    results.sort(key=lambda x: x["completion_probability"], reverse=True)

    return {
        "ml_available": any(r["ml_available"] for r in results),
        "recommendations": results,
    }


def get_recommendations(db: Any, user_id: int, limit: int = 5) -> Dict[str, Any]:
    """Compatibility wrapper for intelligence router."""
    from app.models.user import Character
    from app.models.quest import Quest

    character = db.query(Character).filter(Character.user_id == user_id).first()
    quests = db.query(Quest).filter(Quest.user_id == user_id).all()
    completed_count = len([q for q in quests if q.status == "completed"])
    total_count = len(quests)

    data = generate_recommendations(
        user_id=user_id,
        character=character,
        completed_quests_count=completed_count,
        total_quests_count=total_count,
    )
    if "recommendations" in data:
        data["recommendations"] = data["recommendations"][:limit]
    return data
