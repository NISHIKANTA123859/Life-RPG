"""
Train a quest completion prediction model.
Usage: python -m app.ml.train

Pipeline:
    training_data.csv -> RandomForestClassifier -> life_rpg_recommender.pkl
"""
import os
import csv
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

from app.ml.preprocessing import DIFFICULTY_MAP, CATEGORY_MAP

_DIR = os.path.dirname(__file__)
CSV_PATH = os.path.join(_DIR, "training_data.csv")
MODEL_PATH = os.path.join(_DIR, "life_rpg_recommender.pkl")


def load_training_data(csv_path: str = CSV_PATH):
    """Load and encode training data from training_data.csv."""
    X_rows, y_rows = [], []
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            X_rows.append([
                DIFFICULTY_MAP.get(row["difficulty"], 1),
                CATEGORY_MAP.get(row["category"], 0),
                float(row["xp_reward"]),
                float(row["user_streak"]),
                float(row["category_familiarity"]),
            ])
            y_rows.append(int(row["completed"]))
    return np.array(X_rows), np.array(y_rows)


def generate_training_data(n_samples: int = 5000):
    """Generate synthetic quest completion data when no CSV is available."""
    np.random.seed(42)
    difficulties = np.random.randint(0, 4, n_samples)
    categories = np.random.randint(0, 6, n_samples)
    xp_rewards = np.array([60, 120, 250, 500])[difficulties] + np.random.normal(0, 10, n_samples)
    streaks = np.random.randint(0, 30, n_samples)
    familiarity = np.random.uniform(0, 1, n_samples)
    X = np.column_stack([difficulties, categories, xp_rewards, streaks, familiarity])
    prob = 0.8 - difficulties * 0.15 + streaks * 0.01 + familiarity * 0.15
    prob = np.clip(prob, 0.05, 0.95)
    y = (np.random.uniform(0, 1, n_samples) < prob).astype(int)
    return X, y


def train_model(csv_path: str = CSV_PATH, model_path: str = MODEL_PATH):
    """Train a Random Forest classifier and save to model_path."""
    print("Loading training data...")
    if os.path.exists(csv_path):
        X, y = load_training_data(csv_path)
        print(f"  Loaded {len(X)} rows from {csv_path}")
    else:
        print(f"  CSV not found. Generating synthetic data...")
        X, y = generate_training_data()

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        min_samples_leaf=4,
        random_state=42,
        n_jobs=-1,
    )

    print("Training Random Forest...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.4f}")
    print(classification_report(y_test, y_pred, target_names=["Incomplete", "Complete"]))

    joblib.dump(model, model_path)
    print(f"Model saved -> {model_path}")
    return model


if __name__ == "__main__":
    train_model()
