"""
Heart Disease Prediction - Inference Module
===========================================
Loads heart_model.pkl and predicts heart disease risk from a feature dictionary.

Standalone usage
----------------
    from model.predict import HeartRiskPredictor

    predictor = HeartRiskPredictor()

    result = predictor.predict({
        "age": 58, "sex": 1, "cp": 2, "trestbps": 140,
        "chol": 268, "fbs": 0, "restecg": 0, "thalach": 160,
        "exang": 0, "oldpeak": 3.6, "slope": 1, "ca": 2,
        "thal": 2, "trestbps2": 138, "chol2": 271, "fbs2": 0,
        "restecg2": 1, "thalach2": 155, "exang2": 1, "oldpeak2": 2.8,
    })
    # → {"risk": "High", "probability": 0.82}

CLI usage
---------
    python model/predict.py
"""

from __future__ import annotations

import json
import logging
import os
import pickle
from typing import Any

import numpy as np

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Default model path ────────────────────────────────────────────────────────
_BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_MODEL_PATH = os.path.join(_BASE_DIR, "model", "heart_model.pkl")

# ── Canonical feature order (must match training column order) ────────────────
FEATURE_NAMES = [

"age","sex","cp","trestbps","chol","fbs",
"restecg","thalach","exang","oldpeak",
"slope","ca","thal",

"trestbps2","chol2","fbs2","restecg2",
"thalach2","exang2","oldpeak2",

"age2","sex2","cp2","slope2",
"ca2","thal2","restecg3","thalach3"

]

# ── Risk thresholds ───────────────────────────────────────────────────────────
_RISK_HIGH   = 0.65   # probability ≥ 65 % → High
_RISK_MEDIUM = 0.35   # probability ≥ 35 % → Medium  (else → Low)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _classify_risk(probability: float) -> str:
    """Map a [0, 1] probability to a human-readable risk tier."""
    if probability >= _RISK_HIGH:
        return "High"
    if probability >= _RISK_MEDIUM:
        return "Medium"
    return "Low"


def _validate_input(features: dict[str, Any]) -> None:
    """
    Raise informative errors for common input mistakes before hitting numpy.

    Checks
    ------
    • All required feature keys are present.
    • No value is None / NaN (we accept missing columns handled by imputer,
      but explicit None signals a caller bug).
    • Numeric sanity bounds for selected clinical fields.
    """
    # ── Missing keys ─────────────────────────────────────────────────────────
    missing = [f for f in FEATURE_NAMES if f not in features]
    if missing:
        raise KeyError(
            f"Missing required feature(s): {missing}.\n"
            f"Expected all of: {FEATURE_NAMES}"
        )

    # ── None / NaN guard ─────────────────────────────────────────────────────
    none_keys = [k for k, v in features.items() if v is None]
    if none_keys:
        raise ValueError(
            f"Feature(s) {none_keys} are None. "
            "Provide a numeric value or omit the key and let the imputer handle it."
        )

    # ── Clinical range checks (soft warnings, not hard errors) ───────────────
    _RANGES = {
        "age":      (0,   120),
        "trestbps": (50,  300),
        "chol":     (100, 600),
        "thalach":  (50,  250),
        "oldpeak":  (0,   10),
    }
    for col, (lo, hi) in _RANGES.items():
        val = features.get(col)
        if val is not None and not (lo <= float(val) <= hi):
            log.warning(
                "Feature '%s' = %s is outside the expected clinical range [%s, %s].",
                col, val, lo, hi,
            )


def _dict_to_array(features: dict[str, Any]) -> np.ndarray:
    """
    Convert a feature dictionary → 2-D numpy array shaped (1, n_features).

    Features are ordered according to FEATURE_NAMES.
    Extra keys in *features* that are not in FEATURE_NAMES are silently ignored.
    """
    row = [float(features[f]) for f in FEATURE_NAMES]
    return np.array(row, dtype=np.float64).reshape(1, -1)


# ─────────────────────────────────────────────────────────────────────────────
# Main class
# ─────────────────────────────────────────────────────────────────────────────

class HeartRiskPredictor:
    """
    Load a persisted sklearn Pipeline and predict heart-disease risk.

    Parameters
    ----------
    model_path : str, optional
        Absolute path to the pickled pipeline (``heart_model.pkl``).
        Defaults to ``<project_root>/model/heart_model.pkl``.

    Example
    -------
    >>> predictor = HeartRiskPredictor()
    >>> result    = predictor.predict({"age": 55, "sex": 1, ...})
    >>> print(result)
    {"risk": "High", "probability": 0.78}
    """

    def __init__(self, model_path: str = _MODEL_PATH) -> None:
        self._model_path = model_path
        self._pipeline   = self._load_model(model_path)

    # ── Model loading ─────────────────────────────────────────────────────────

    @staticmethod
    def _load_model(path: str):
        """Deserialise the pickled sklearn pipeline from *path*."""
        if not os.path.exists(path):
            raise FileNotFoundError(
                f"Model file not found: '{path}'.\n"
                "Run  python model/train_model.py  first to generate it."
            )
        with open(path, "rb") as fh:
            pipeline = pickle.load(fh)
        size_kb = os.path.getsize(path) / 1024
        log.info("Model loaded  ←  '%s'  (%.1f KB)", path, size_kb)
        return pipeline

    # ── Public API ────────────────────────────────────────────────────────────

    def predict(self, features: dict[str, Any]) -> str:
        """
        Predict heart disease risk for a single patient.

        Parameters
        ----------
        features : dict
            Mapping of feature name → numeric value.
            All keys in FEATURE_NAMES are required.

        Returns
        -------
        str
            JSON string with the schema::

                {
                    "risk":        "Low" | "Medium" | "High",
                    "probability": <float rounded to 4 d.p.>
                }

        Raises
        ------
        KeyError
            If a required feature key is absent from *features*.
        ValueError
            If any feature value is None.
        RuntimeError
            If the model pipeline fails to produce a valid probability.
        """
        # 1. Validate input dict
        _validate_input(features)

        # 2. Convert dict → numpy array (1 × n_features)
        X: np.ndarray = _dict_to_array(features)
        log.debug("Input array shape: %s", X.shape)

        # 3. Run pipeline inference
        try:
            proba_matrix: np.ndarray = self._pipeline.predict_proba(X)
        except Exception as exc:
            raise RuntimeError(
                f"Model inference failed: {exc}\n"
                "Ensure the input features match those used during training."
            ) from exc

        # 4. Extract positive-class probability
        #    Binary:       proba_matrix shape = (1, 2)  → column 1
        #    Multi-class:  proba_matrix shape = (1, K)  → max column
        if proba_matrix.shape[1] == 2:
            probability = float(proba_matrix[0, 1])
        else:
            probability = float(proba_matrix[0].max())

        # 5. Map to risk tier
        risk_label = _classify_risk(probability)

        # 6. Build and return JSON response
        response: dict[str, Any] = {
            "risk":        risk_label,
            "probability": round(probability, 4),
        }
        log.info(
            "Prediction  →  risk: %-6s  probability: %.4f",
            risk_label, probability,
        )
        return json.dumps(response, indent=2)

    def predict_dict(self, features: dict[str, Any]) -> dict[str, Any]:
        """
        Same as :meth:`predict` but returns a Python dict instead of a JSON string.
        Convenient for programmatic use without a ``json.loads`` round-trip.
        """
        return json.loads(self.predict(features))

    def reload_model(self) -> None:
        """Hot-reload the model from disk (useful after retraining)."""
        self._pipeline = self._load_model(self._model_path)
        log.info("Model reloaded from '%s'", self._model_path)

    # ── Dunder helpers ────────────────────────────────────────────────────────

    def __repr__(self) -> str:
        return (
            f"HeartRiskPredictor("
            f"model='{os.path.basename(self._model_path)}', "
            f"features={len(FEATURE_NAMES)})"
        )


# ─────────────────────────────────────────────────────────────────────────────
# Convenience function (module-level shortcut)
# ─────────────────────────────────────────────────────────────────────────────

def predict_risk(
    features: dict[str, Any],
    model_path: str = _MODEL_PATH,
) -> str:
    """
    One-shot helper — instantiates :class:`HeartRiskPredictor` and returns
    the JSON prediction string.

    Parameters
    ----------
    features   : dict  — patient feature values
    model_path : str   — path to ``heart_model.pkl`` (optional override)

    Returns
    -------
    str  —  JSON string  ``{"risk": "...", "probability": ...}``

    Example
    -------
    >>> from model.predict import predict_risk
    >>> print(predict_risk({"age": 60, "sex": 1, ...}))
    {
      "risk": "High",
      "probability": 0.8100
    }
    """
    predictor = HeartRiskPredictor(model_path=model_path)
    return predictor.predict(features)


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Sample patient — replace with real values as needed
    SAMPLE_PATIENT = {

"age":58,
"sex":1,
"cp":2,
"trestbps":140,
"chol":268,
"fbs":0,
"restecg":0,
"thalach":160,
"exang":0,
"oldpeak":3.6,
"slope":1,
"ca":2,
"thal":2,

"trestbps2":138,
"chol2":271,
"fbs2":0,
"restecg2":1,
"thalach2":155,
"exang2":1,
"oldpeak2":2.8,

"age2":58,
"sex2":1,
"cp2":2,
"slope2":1,
"ca2":2,
"thal2":2,
"restecg3":1,
"thalach3":155
}

    sep = "=" * 50
    print(f"\n{sep}")
    print("  HEART RISK PREDICTION — DEMO")
    print(sep)
    print("  Input features:")
    for k, v in SAMPLE_PATIENT.items():
        print(f"    {k:<12s}: {v}")
    print(sep)

    predictor = HeartRiskPredictor()
    result_json = predictor.predict(SAMPLE_PATIENT)

    print("  Result (JSON):")
    for line in result_json.splitlines():
        print(f"    {line}")
    print(sep + "\n")