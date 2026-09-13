"""Life RPG FastAPI Application - Main Entry Point"""
import os
import json
import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.database import engine, Base
from app.models import *  # noqa: F401,F403 — ensure all models are registered

# ── Import routers ───────────────────────────────────────────────────
from app.routes.auth import router as auth_router
from app.routes.character import router as character_router
from app.routes.quests import router as quests_router, quests_alias_router        # /api/tasks/* & /api/quests/*
from app.routes.tasks import router as tasks_router          # alias – same router object
from app.routes.achievements import router as achievements_router
from app.routes.shop import router as shop_router
from app.routes.inventory import router as inventory_router
from app.routes.activity import router as activity_router
from app.routes.leaderboard import router as leaderboard_router
from app.routes.intelligence import router as intelligence_router  # /api/recommendations + /api/insights
from app.routes.recommendations import router as recommendations_router  # /api/recommendations (canonical)
from app.routes.skills import router as skills_router
from app.routes.meta import router as meta_router
from app.routes.quest_intelligence import router as quest_intelligence_router, alias_router as qi_alias_router

logger = logging.getLogger("life_rpg")


# ── Lifespan event ───────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created / verified.")
    yield
    # Shutdown
    logger.info("Shutting down Life RPG API.")


# ── Create FastAPI app ───────────────────────────────────────────────
app = FastAPI(
    title=os.getenv("PROJECT_NAME", "Life RPG API"),
    version=os.getenv("VERSION", "1.0.0"),
    description=(
        "Life RPG — Gamify Your Life. "
        "Complete backend API with quest engine, ML recommendations, "
        "streak tracking, achievements, shop, inventory, and skill tree."
    ),
    lifespan=lifespan,
)


# ── CORS ─────────────────────────────────────────────────────────────
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Register routers ─────────────────────────────────────────────────
# Auth
app.include_router(auth_router)

# Character
app.include_router(character_router)

# Quests / Tasks  (quests_router and tasks_router are the same object —
# FastAPI deduplicates identical router instances automatically)
app.include_router(quests_router)
app.include_router(quests_alias_router)

# Achievements
app.include_router(achievements_router)

# Shop & Inventory
app.include_router(shop_router)
app.include_router(inventory_router)

# Activity history
app.include_router(activity_router)

# Leaderboard
app.include_router(leaderboard_router)

# ML intelligence: /api/recommendations + /api/insights
app.include_router(intelligence_router)

# Skills
app.include_router(skills_router)

# Meta (daily progress, streak, seed)
app.include_router(meta_router)

# Quest Intelligence & ML
app.include_router(quest_intelligence_router)
app.include_router(qi_alias_router)


# ── Health check ─────────────────────────────────────────────────────
@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": "Life RPG API", "version": "1.0.0"}


@app.get("/", tags=["root"])
def root():
    return {
        "message": "Welcome to Life RPG API",
        "docs": "/docs",
        "health": "/api/health",
    }
