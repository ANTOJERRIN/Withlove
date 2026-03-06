"""
Heart Disease Prediction - Model Training Script
"""

import os
import pickle
import logging
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix, roc_auc_score
)
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "heart_dataset_20_features.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "heart_model.pkl")

RANDOM_STATE = 42
TEST_SIZE = 0.20

RF_PARAMS = dict(
    n_estimators=200,
    max_depth=None,
    min_samples_split=5,
    min_samples_leaf=2,
    max_features="sqrt",
    class_weight="balanced",
    random_state=RANDOM_STATE,
    n_jobs=-1,
)

# ─────────────────────────────────────
# Load Data
# ─────────────────────────────────────
def load_data(path):

    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Dataset not found at '{path}'."
        )

    df = pd.read_csv(path)

    log.info("Loaded dataset → shape: %s", df.shape)

    return df


# ─────────────────────────────────────
# Preprocess
# ─────────────────────────────────────
def preprocess(df):

    df = df.copy()

    target_candidates = [
        c for c in df.columns
        if c.lower() in ("target","label","disease","heart_disease","output","condition")
    ]

    target_col = target_candidates[0] if target_candidates else df.columns[-1]

    log.info("Target column → '%s'", target_col)

    id_cols = [c for c in df.columns if c.lower() in ("id","patient_id","index")]

    if id_cols:
        df.drop(columns=id_cols, inplace=True)
        log.info("Dropped ID cols → %s", id_cols)

    # Convert all columns safely
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Remove rows where target missing
    df = df[df[target_col].notna()]

    X = df.drop(columns=[target_col])
    y = df[target_col]

    log.info("Feature matrix → shape: %s", X.shape)
    log.info("Class distribution:\n%s", y.value_counts())

    return X, y


# ─────────────────────────────────────
# Pipeline
# ─────────────────────────────────────
def build_pipeline():

    return Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(**RF_PARAMS)),
    ])


# ─────────────────────────────────────
# Train Model
# ─────────────────────────────────────
def train_and_evaluate(X, y):

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y
    )

    log.info("Train samples → %d", len(X_train))
    log.info("Test samples → %d", len(X_test))

    pipeline = build_pipeline()

    log.info("Training RandomForest...")

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba[:,1])

    cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring="accuracy")

    print("\n===============================")
    print(" HEART DISEASE MODEL REPORT")
    print("===============================")

    print("Accuracy:", accuracy)
    print("AUC:", auc)
    print("Cross‑val:", cv_scores)

    print("\nClassification Report\n")
    print(classification_report(y_test, y_pred))

    print("\nConfusion Matrix")
    print(confusion_matrix(y_test, y_pred))

    return pipeline, accuracy


# ─────────────────────────────────────
# Save Model
# ─────────────────────────────────────
def save_model(pipeline, path):

    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "wb") as f:
        pickle.dump(pipeline, f)

    log.info("Model saved → %s", path)


# ─────────────────────────────────────
# Main
# ─────────────────────────────────────
def main():

    log.info("── Heart Disease Prediction: Training ──")

    df = load_data(DATA_PATH)

    X, y = preprocess(df)

    pipeline, acc = train_and_evaluate(X, y)

    save_model(pipeline, MODEL_PATH)

    log.info("Training complete. Accuracy: %.4f", acc)


if __name__ == "__main__":
    main()