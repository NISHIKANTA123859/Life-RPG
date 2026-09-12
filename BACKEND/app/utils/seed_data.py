"""Default seed data definitions for achievements, shop items, and skill trees."""

SEED_ACHIEVEMENTS = [
    {"key": "FIRST_QUEST", "name": "First Steps", "icon": "🎯", "description": "Complete your very first quest.", "rarity": "Common", "xp_reward": 50, "requirement_type": "quests_completed", "requirement_value": 1},
    {"key": "QUEST_MASTER_10", "name": "Quest Adept", "icon": "⚔️", "description": "Complete 10 quests.", "rarity": "Common", "xp_reward": 100, "requirement_type": "quests_completed", "requirement_value": 10},
    {"key": "QUEST_MASTER_50", "name": "Quest Master", "icon": "🏆", "description": "Complete 50 quests.", "rarity": "Rare", "xp_reward": 300, "requirement_type": "quests_completed", "requirement_value": 50},
    {"key": "QUEST_LEGEND", "name": "Legendary Questor", "icon": "👑", "description": "Complete 100 quests.", "rarity": "Legendary", "xp_reward": 1000, "requirement_type": "quests_completed", "requirement_value": 100},
    {"key": "CONSISTENT_7", "name": "Consistent", "icon": "🔥", "description": "Maintain a 7-day quest streak.", "rarity": "Uncommon", "xp_reward": 150, "requirement_type": "streak", "requirement_value": 7},
    {"key": "STREAK_14", "name": "Dedicated", "icon": "💎", "description": "Maintain a 14-day quest streak.", "rarity": "Rare", "xp_reward": 300, "requirement_type": "streak", "requirement_value": 14},
    {"key": "STREAK_30", "name": "Unstoppable", "icon": "⚡", "description": "Maintain a 30-day quest streak.", "rarity": "Epic", "xp_reward": 500, "requirement_type": "streak", "requirement_value": 30},
    {"key": "LEVEL_10", "name": "Rising Hero", "icon": "⬆️", "description": "Reach level 10.", "rarity": "Uncommon", "xp_reward": 200, "requirement_type": "level", "requirement_value": 10},
    {"key": "LEVEL_25", "name": "Veteran Hero", "icon": "🌟", "description": "Reach level 25.", "rarity": "Rare", "xp_reward": 500, "requirement_type": "level", "requirement_value": 25},
    {"key": "LEVEL_50", "name": "Legendary Hero", "icon": "👑", "description": "Reach level 50.", "rarity": "Legendary", "xp_reward": 1500, "requirement_type": "level", "requirement_value": 50},
    {"key": "GOLD_1000", "name": "Wealthy", "icon": "🪙", "description": "Accumulate 1,000 gold.", "rarity": "Uncommon", "xp_reward": 100, "requirement_type": "gold", "requirement_value": 1000},
    {"key": "GOLD_5000", "name": "Rich", "icon": "💰", "description": "Accumulate 5,000 gold.", "rarity": "Rare", "xp_reward": 300, "requirement_type": "gold", "requirement_value": 5000},
    {"key": "INTELLECT_80", "name": "Sage Mind", "icon": "🧠", "description": "Reach 80 Intellect.", "rarity": "Rare", "xp_reward": 250, "requirement_type": "intellect", "requirement_value": 80},
    {"key": "STRENGTH_80", "name": "Iron Will", "icon": "💪", "description": "Reach 80 Strength.", "rarity": "Rare", "xp_reward": 250, "requirement_type": "strength", "requirement_value": 80},
    {"key": "MIND_80", "name": "Inner Peace", "icon": "🧘", "description": "Reach 80 Mind.", "rarity": "Rare", "xp_reward": 250, "requirement_type": "mind", "requirement_value": 80},
]

SEED_SHOP_ITEMS = [
    {"name": "Scholar's Crown", "icon": "👑", "description": "A crown of knowledge that amplifies all Intellect gains.", "price": 800, "rarity": "Rare", "category": "Equipment", "bonus": "+5 INT", "slot": "Head", "level_required": 1},
    {"name": "Focus Crystal", "icon": "💎", "description": "Infused with pure concentration energy.", "price": 500, "rarity": "Rare", "category": "Equipment", "bonus": "+4 DIS", "slot": "Off-hand", "level_required": 1},
    {"name": "Tome of Algorithms", "icon": "📚", "description": "Ancient tome containing legendary programming knowledge.", "price": 2500, "rarity": "Legendary", "category": "Equipment", "bonus": "+10 INT", "slot": "Weapon", "level_required": 20},
    {"name": "Titan Gauntlets", "icon": "🔱", "description": "Forged from the will of champions.", "price": 1200, "rarity": "Epic", "category": "Equipment", "bonus": "+8 STR", "slot": "Body", "level_required": 30},
    {"name": "Blade of Discipline", "icon": "🗡️", "description": "Only the disciplined may wield this blade.", "price": 1800, "rarity": "Epic", "category": "Equipment", "bonus": "+6 DIS", "slot": "Weapon", "level_required": 25},
    {"name": "XP Boost (24h)", "icon": "⚡", "description": "Double XP earned for 24 hours.", "price": 300, "rarity": "Uncommon", "category": "Boosts", "bonus": "2× XP", "slot": None, "level_required": 1},
    {"name": "Night Owl Boost", "icon": "🌙", "description": "+50% XP for all quests completed after 8 PM.", "price": 150, "rarity": "Common", "category": "Boosts", "bonus": "+50% XP (night)", "slot": None, "level_required": 1},
    {"name": "Streak Shield", "icon": "🛡️", "description": "Protects your streak for 1 missed day.", "price": 600, "rarity": "Rare", "category": "Boosts", "bonus": "Streak protection", "slot": None, "level_required": 1},
    {"name": "Neon Avatar Frame", "icon": "🎨", "description": "Glowing violet-cyan frame for your profile avatar.", "price": 400, "rarity": "Uncommon", "category": "Cosmetics", "bonus": "Avatar frame", "slot": None, "level_required": 1},
    {"name": "Cosmic Theme", "icon": "🌌", "description": "Deep space UI theme for the entire dashboard.", "price": 900, "rarity": "Rare", "category": "Cosmetics", "bonus": "UI theme", "slot": None, "level_required": 1},
    {"name": "Gold Trophy Title", "icon": "🏆", "description": "Display 'Gold Champion' under your name.", "price": 2000, "rarity": "Epic", "category": "Cosmetics", "bonus": "Title", "slot": None, "level_required": 50},
    {"name": "Mystic Skill Slot", "icon": "🔮", "description": "Unlock an extra skill slot in any skill tree.", "price": 1500, "rarity": "Epic", "category": "Skills", "bonus": "+1 skill slot", "slot": None, "level_required": 20},
]

SEED_SKILLS = [
    # Intellect tree
    {"tree": "Intellect", "key": "programming", "name": "Programming", "icon": "💻", "xp_required": 0, "bonus": "+5 INT", "parent_key": None},
    {"tree": "Intellect", "key": "python", "name": "Python Mastery", "icon": "🐍", "xp_required": 500, "bonus": "+8 INT", "parent_key": "programming"},
    {"tree": "Intellect", "key": "data_science", "name": "Data Science", "icon": "📊", "xp_required": 1500, "bonus": "+10 INT", "parent_key": "python"},
    {"tree": "Intellect", "key": "machine_learning", "name": "Machine Learning", "icon": "🤖", "xp_required": 3000, "bonus": "+15 INT", "parent_key": "data_science"},
    {"tree": "Intellect", "key": "reading", "name": "Speed Reading", "icon": "📚", "xp_required": 200, "bonus": "+3 INT", "parent_key": None},
    # Strength tree
    {"tree": "Strength", "key": "fitness_basics", "name": "Fitness Basics", "icon": "💪", "xp_required": 0, "bonus": "+5 STR", "parent_key": None},
    {"tree": "Strength", "key": "resistance", "name": "Resistance Training", "icon": "🏋️", "xp_required": 500, "bonus": "+8 STR", "parent_key": "fitness_basics"},
    {"tree": "Strength", "key": "advanced_lifting", "name": "Advanced Lifting", "icon": "🏆", "xp_required": 2000, "bonus": "+12 STR", "parent_key": "resistance"},
    # Mind tree
    {"tree": "Mind", "key": "meditation", "name": "Meditation", "icon": "🧘", "xp_required": 0, "bonus": "+5 MND", "parent_key": None},
    {"tree": "Mind", "key": "mindfulness", "name": "Mindfulness", "icon": "🌊", "xp_required": 300, "bonus": "+7 MND", "parent_key": "meditation"},
    {"tree": "Mind", "key": "deep_focus", "name": "Deep Focus", "icon": "🎯", "xp_required": 1000, "bonus": "+10 MND", "parent_key": "mindfulness"},
    # Discipline tree
    {"tree": "Discipline", "key": "time_mgmt", "name": "Time Management", "icon": "⏰", "xp_required": 0, "bonus": "+5 DIS", "parent_key": None},
    {"tree": "Discipline", "key": "habit_building", "name": "Habit Building", "icon": "🔄", "xp_required": 400, "bonus": "+7 DIS", "parent_key": "time_mgmt"},
    {"tree": "Discipline", "key": "productivity", "name": "Productivity Master", "icon": "🚀", "xp_required": 1500, "bonus": "+12 DIS", "parent_key": "habit_building"},
]

SEED_DEMO_QUESTS = [
    {"name": "Study Advanced Algorithms", "category": "Intellect", "difficulty": "Hard", "due_date": "Today, 11:59 PM", "estimated_time": "2 hours"},
    {"name": "Morning Workout Routine", "category": "Strength", "difficulty": "Medium", "due_date": "Today, 8:00 AM", "estimated_time": "45 mins"},
    {"name": "Read 30 Pages of Clean Code", "category": "Intellect", "difficulty": "Easy", "due_date": "Today, 10:00 PM", "estimated_time": "30 mins"},
    {"name": "Practice Mindful Meditation", "category": "Mind", "difficulty": "Easy", "due_date": "Today, 7:00 AM", "estimated_time": "15 mins"},
    {"name": "Complete Data Structures Assignment", "category": "Discipline", "difficulty": "Hard", "due_date": "Tomorrow, 6:00 PM", "estimated_time": "3 hours"},
    {"name": "Evening Run — 5K", "category": "Endurance", "difficulty": "Medium", "due_date": "Today, 6:30 PM", "estimated_time": "35 mins"},
]
