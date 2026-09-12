# Life RPG — Backend API

A complete FastAPI + PostgreSQL backend for the **Life RPG** gamification platform.
Complete RPG game mechanics: XP levelling, streaks, achievements, shop, inventory,
skill tree, activity history, and ML-powered quest recommendations.

---

## Table of Contents

1. [Install dependencies](#1-install-dependencies)
2. [Configure PostgreSQL](#2-configure-postgresql)
3. [Configure .env](#3-configure-env)
4. [Initialise the database](#4-initialise-the-database)
5. [Seed data](#5-seed-data)
6. [Run FastAPI](#6-run-fastapi)
7. [Access /docs](#7-access-docs)
8. [Connect the React frontend](#8-connect-the-react-frontend)
9. [Train the ML model](#9-train-the-ml-model)
10. [Run the complete application](#10-run-the-complete-application)

---

## 1. Install dependencies

```bash
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install all requirements
pip install -r requirements.txt
```

---

## 2. Configure PostgreSQL

```sql
-- Run in psql as superuser
CREATE DATABASE life_rpg;
CREATE USER life_rpg_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE life_rpg TO life_rpg_user;
```

> **Tip**: If you skip this step the server automatically falls back to SQLite
> (`life_rpg.db` in the project root) — great for local development.

---

## 3. Configure .env

```bash
cp .env.example .env
# Edit .env and fill in your DATABASE_URL and SECRET_KEY
```

Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SQLITE_FALLBACK_URL` | SQLite path (auto-used when Postgres is unreachable) |
| `SECRET_KEY` | JWT signing secret — change in production! |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime (default 1440 = 24 h) |
| `CORS_ORIGINS` | JSON array of allowed frontend origins |

---

## 4. Initialise the database

Tables are created automatically when the server starts via SQLAlchemy's
`Base.metadata.create_all()`. You can also trigger it manually:

```bash
python3 -c "
from app.database import engine, Base
from app.models import *
Base.metadata.create_all(bind=engine)
print('Tables created.')
"
```

---

## 5. Seed data

Populate achievements, shop items, and skills:

```bash
python -m app.seed.seed_data
# or
python -m app.utils.seed_data   # legacy path (also works)
```

---

## 6. Run FastAPI

```bash
# Development (auto-reload on file changes)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Production
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be live at **http://localhost:8000**.

---

## 7. Access /docs

Interactive Swagger UI (auto-generated):

```
http://localhost:8000/docs
```

ReDoc (alternative):

```
http://localhost:8000/redoc
```

---

## 8. Connect the React frontend

The Vite frontend (in `../FRONTNED`) is pre-configured to proxy all `/api/*`
requests to `http://127.0.0.1:8000` via `vite.config.ts`:

```typescript
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
  }
}
```

All API calls in `src/lib/api.ts` use `/api/...` paths — no absolute URLs needed.
CORS is already configured for `http://localhost:5173`.

Start the frontend:

```bash
cd ../FRONTNED
npm install
npm run dev
```

---

## 9. Train the ML model

The recommendation engine uses a trained **Random Forest** classifier.

### Flow

```
app/ml/training_data.csv
  └─> app/ml/train.py          (RandomForestClassifier)
        └─> app/ml/life_rpg_recommender.pkl
              └─> app/ml/predict.py
                    └─> app/ml/recommender.py
                          └─> GET /api/recommendations
                                └─> React QuestIntelligence page
```

### Retrain

```bash
# From the BACKEND directory with venv active:
python -m app.ml.train
```

The model is saved to `app/ml/life_rpg_recommender.pkl` and picked up
automatically at server startup (lazy-loaded on first recommendation request).

---

## 10. Run the complete application

Open **two** terminals:

**Terminal 1 — Backend:**
```bash
cd "Life RPG/BACKEND"
source venv/bin/activate
python -m app.seed.seed_data       # first run only
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd "Life RPG/FRONTNED"
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user + character |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user info |
| GET | `/api/tasks` | List all quests |
| POST | `/api/tasks` | Create a new quest |
| GET | `/api/tasks/{id}` | Get a specific quest |
| PUT | `/api/tasks/{id}` | Update a quest |
| DELETE | `/api/tasks/{id}` | Delete a quest |
| POST | `/api/tasks/{id}/complete` | Complete quest → XP/Gold/Streak/Achievements |
| GET | `/api/character` | Get character data |
| GET | `/api/character/stats` | Get extended character stats |
| GET | `/api/recommendations` | ML-powered quest recommendations |
| GET | `/api/achievements` | All achievements with progress |
| GET | `/api/shop/items` | List shop items |
| POST | `/api/shop/items/{id}/buy` | Purchase a shop item |
| GET | `/api/inventory` | Get user inventory |
| POST | `/api/inventory/{id}/equip` | Equip/unequip an item |
| GET | `/api/activity` | Activity history |
| GET | `/api/leaderboard` | Global leaderboard |
| GET | `/api/skills` | Skill tree |
| POST | `/api/skills/{id}/unlock` | Unlock a skill |

---

## Project Structure

```
BACKEND/
├── app/
│   ├── main.py                  # FastAPI application entry point
│   ├── core/
│   │   ├── config.py            # Settings from environment variables
│   │   └── security.py         # Security re-exports
│   ├── database/
│   │   ├── connection.py        # PostgreSQL / SQLite engine & session
│   │   └── base.py             # SQLAlchemy declarative base
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic request / response schemas
│   ├── routes/                  # FastAPI routers
│   ├── services/                # Business logic (game engine, XP, streaks, …)
│   ├── ml/                      # ML model training and inference
│   └── seed/                    # Database seeding
├── tests/                       # Test suite
├── .env                         # Local secrets (not committed)
├── .env.example                 # Template for .env
├── requirements.txt
└── README.md
```

---

## XP Formula

```
required_xp = 100 × level²
```

| Level | XP required |
|-------|-------------|
| 1 | 100 |
| 2 | 400 |
| 3 | 900 |
| 5 | 2,500 |
| 10 | 10,000 |
