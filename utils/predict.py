"""
Heart Disease Prediction - Inference Utility
============================================
Load the saved model and run predictions on new data.

Usage:
    from utils.predict import HeartPredictor
    predictor = HeartPredictor()
    result = predictor.predict({"age": 55, "chol": 230, ...})
"""

import os
import pickle
import logging
import numpy as np
import pandas as pd
from typing import Union

log = logging.getLogger(__name__)

BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "heart_model.pkl")


class HeartPredictor:
    """Wraps the persisted sklearn pipeline for convenient inference."""

    def __init__(self, model_path: str = MODEL_PATH):
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found at '{model_path}'. "
                "Run model/train_model.py first."
            )
        with open(model_path, "rb") as f:
            self.pipeline = pickle.load(f)
        log.info("Model loaded from '%s'", model_path)

    # ── Single sample ─────────────────────────────────────────────────────────
    def predict(self, data: Union[dict, pd.DataFrame]) -> dict:
        """
        Predict heart disease for a single sample.

        Parameters
        ----------
        data : dict or single-row DataFrame

        Returns
        -------
        dict with keys: prediction (int), probability (float), risk_level (str)
        """
        if isinstance(data, dict):
            df = pd.DataFrame([data])
        else:
            df = data.copy()

        pred  = self.pipeline.predict(df)[0]
        proba = self.pipeline.predict_proba(df)[0]
        prob_positive = float(proba[1]) if len(proba) > 1 else float(proba[0])

        risk = (
            "High Risk"   if prob_positive >= 0.70 else
            "Medium Risk" if prob_positive >= 0.40 else
            "Low Risk"
        )

        return {
            "prediction":   int(pred),
            "probability":  round(prob_positive, 4),
            "risk_level":   risk,
        }

    # ── Batch ─────────────────────────────────────────────────────────────────
    def predict_batch(self, df: pd.DataFrame) -> pd.DataFrame:
        """Run predictions on a DataFrame; appends result columns in-place."""
        df = df.copy()
        df["prediction"]  = self.pipeline.predict(df)
        proba             = self.pipeline.predict_proba(df.drop(
                                columns=["prediction"], errors="ignore"))
        df["probability"] = proba[:, 1] if proba.shape[1] > 1 else proba[:, 0]
        df["risk_level"]  = df["probability"].apply(
            lambda p: "High Risk" if p >= 0.70 else
                      "Medium Risk" if p >= 0.40 else "Low Risk"
        )
        return df
