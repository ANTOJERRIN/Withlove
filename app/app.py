"""
Heart Disease Prediction - Flask API
=====================================
Exposes a single POST /predict endpoint.

The frontend sends:
    { "age", "blood_pressure", "cholesterol", "heart_rate" }

The API maps those 4 fields to the 20-feature vector expected by the
trained model, calls predict_risk() from model.predict, and returns:
    { "risk": "Low|Medium|High", "probability": <float> }

Run
---
    python app.py                  # development
    flask --app app run            # via Flask CLI
    gunicorn app:app -w 4          # production

Environment variables
---------------------
    FLASK_ENV       development | production  (default: production)
    MODEL_PATH      override path to heart_model.pkl
    HOST            bind host  (default: 0.0.0.0)
    PORT            bind port  (default: 5000)
"""

from __future__ import annotations

import json
import logging
import os
from functools import lru_cache
from typing import Any

from flask import Flask, jsonify, request
from flask.wrappers import Response

# ── Import prediction module ───────────────────────────────────────────────────
# Adjust sys.path when app.py lives at the project root
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from model.predict import HeartRiskPredictor, FEATURE_NAMES   # noqa: E402

# ─────────────────────────────────────────────────────────────────────────────
# App factory
# ─────────────────────────────────────────────────────────────────────────────

def create_app() -> Flask:
    app = Flask(__name__)

    # ── Logging ───────────────────────────────────────────────────────────────
    log_level = logging.DEBUG if os.getenv("FLASK_ENV") == "development" else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s  [%(levelname)s]  %(name)s  →  %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    app.logger.setLevel(log_level)

    # ── Attach lazy predictor to app ──────────────────────────────────────────
    app.predictor: HeartRiskPredictor | None = None

    return app


app = create_app()


# ─────────────────────────────────────────────────────────────────────────────
# Predictor singleton (loaded once on first request)
# ─────────────────────────────────────────────────────────────────────────────

def _get_predictor() -> HeartRiskPredictor:
    """Return a cached HeartRiskPredictor, loading it on first call."""
    if app.predictor is None:
        model_path = os.getenv("MODEL_PATH")          # optional override
        kwargs     = {"model_path": model_path} if model_path else {}
        app.predictor = HeartRiskPredictor(**kwargs)
        app.logger.info("Predictor loaded and cached.")
    return app.predictor


# ─────────────────────────────────────────────────────────────────────────────
# Field mapping  (frontend name  →  model feature name)
# ─────────────────────────────────────────────────────────────────────────────

# The 4 fields the frontend sends
_FRONTEND_FIELDS: dict[str, str] = {
    "age":            "age",         # direct pass-through
    "blood_pressure": "trestbps",    # resting blood pressure
    "cholesterol":    "chol",        # serum cholesterol in mg/dl
    "heart_rate":     "thalach",     # maximum heart rate achieved
}

# Clinical defaults for the remaining 16 model features not supplied by frontend.
# Values are population medians from the UCI Heart Disease dataset.
_FEATURE_DEFAULTS: dict[str, float] = {
    "sex":       1.0,
    "cp":        0.0,
    "fbs":       0.0,
    "restecg":   0.0,
    "exang":     0.0,
    "oldpeak":   0.8,
    "slope":     1.0,
    "ca":        0.0,
    "thal":      2.0,
    "trestbps2": 130.0,
    "chol2":     240.0,
    "fbs2":      0.0,
    "restecg2":  0.0,
    "thalach2":  150.0,
    "exang2":    0.0,
    "oldpeak2":  0.8,
}


def _build_feature_dict(body: dict[str, Any]) -> dict[str, float]:
    """
    Map the 4 frontend fields + population defaults → full 20-feature dict.

    Parameters
    ----------
    body : dict   JSON body parsed from the request

    Returns
    -------
    dict[str, float]  keyed by FEATURE_NAMES order
    """
    features: dict[str, float] = dict(_FEATURE_DEFAULTS)   # start with defaults

    for frontend_key, model_key in _FRONTEND_FIELDS.items():
        features[model_key] = float(body[frontend_key])     # overwrite with real value

    return features


# ─────────────────────────────────────────────────────────────────────────────
# Input validation
# ─────────────────────────────────────────────────────────────────────────────

_REQUIRED_FIELDS: list[str] = list(_FRONTEND_FIELDS.keys())

_FIELD_RANGES: dict[str, tuple[float, float]] = {
    "age":            (0,   120),
    "blood_pressure": (50,  300),
    "cholesterol":    (50,  700),
    "heart_rate":     (30,  250),
}


def _validate_request_body(body: dict[str, Any]) -> list[str]:
    """
    Return a list of validation error strings (empty list means all OK).

    Checks
    ------
    • All required fields are present.
    • No field is None.
    • Values are numeric.
    • Values fall within plausible clinical ranges.
    """
    errors: list[str] = []

    # ── Presence check ────────────────────────────────────────────────────────
    for field in _REQUIRED_FIELDS:
        if field not in body:
            errors.append(f"Missing required field: '{field}'.")

    if errors:           # skip further checks if fields are absent
        return errors

    # ── Type / None check ─────────────────────────────────────────────────────
    for field in _REQUIRED_FIELDS:
        val = body[field]
        if val is None:
            errors.append(f"Field '{field}' must not be null.")
            continue
        try:
            float(val)
        except (TypeError, ValueError):
            errors.append(f"Field '{field}' must be numeric, got: {val!r}.")

    if errors:
        return errors

    # ── Range check ───────────────────────────────────────────────────────────
    for field, (lo, hi) in _FIELD_RANGES.items():
        val = float(body[field])
        if not (lo <= val <= hi):
            errors.append(
                f"Field '{field}' = {val} is outside the expected range "
                f"[{lo}, {hi}]."
            )

    return errors


# ─────────────────────────────────────────────────────────────────────────────
# Error helpers
# ─────────────────────────────────────────────────────────────────────────────

def _error(message: str, status: int = 400, details: list[str] | None = None) -> Response:
    payload: dict[str, Any] = {"error": message}
    if details:
        payload["details"] = details
    app.logger.warning("HTTP %d  →  %s", status, message)
    return jsonify(payload), status


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/predict")
def predict() -> Response:
    """
    POST /predict
    -------------
    Request body (JSON):
        {
            "age":            <number>,   // years
            "blood_pressure": <number>,   // mmHg
            "cholesterol":    <number>,   // mg/dL
            "heart_rate":     <number>    // bpm
        }

    Response (JSON):
        {
            "risk":        "Low" | "Medium" | "High",
            "probability": <float>        // 0.0 – 1.0
        }

    Error responses:
        400  →  missing / invalid fields
        415  →  non-JSON content type
        500  →  model inference failure
    """
    # ── Content-type guard ────────────────────────────────────────────────────
    if not request.is_json:
        return _error(
            "Content-Type must be 'application/json'.", status=415
        )

    body: dict[str, Any] = request.get_json(silent=True) or {}

    # ── Validate input ────────────────────────────────────────────────────────
    validation_errors = _validate_request_body(body)
    if validation_errors:
        return _error(
            "Invalid request body.",
            status=400,
            details=validation_errors,
        )

    # ── Build full feature dict ───────────────────────────────────────────────
    features = _build_feature_dict(body)
    app.logger.debug(
        "Mapped features: age=%.0f, trestbps=%.0f, chol=%.0f, thalach=%.0f",
        features["age"], features["trestbps"],
        features["chol"], features["thalach"],
    )

    # ── Run inference ─────────────────────────────────────────────────────────
    try:
        predictor   = _get_predictor()
        result_json = predictor.predict(features)       # returns JSON string
        result      = json.loads(result_json)           # parse to dict
    except FileNotFoundError as exc:
        return _error(str(exc), status=500)
    except RuntimeError as exc:
        return _error(f"Model inference error: {exc}", status=500)
    except Exception as exc:
        app.logger.exception("Unexpected error during prediction.")
        return _error(f"Unexpected error: {exc}", status=500)

    # ── Return response ───────────────────────────────────────────────────────
    app.logger.info(
        "Prediction complete  →  risk: %s  probability: %.4f",
        result["risk"], result["probability"],
    )
    return jsonify({
        "risk":        result["risk"],
        "probability": result["probability"],
    }), 200


@app.get("/health")
def health() -> Response:
    """
    GET /health
    -----------
    Lightweight liveness probe for load-balancers / container orchestrators.

    Response:
        { "status": "ok", "model_loaded": true | false }
    """
    return jsonify({
        "status":       "ok",
        "model_loaded": app.predictor is not None,
    }), 200


@app.get("/features")
def features() -> Response:
    """
    GET /features
    -------------
    Returns the 4 fields the frontend must supply and their expected ranges.
    Useful for frontend form validation.
    """
    return jsonify({
        "required_fields": [
            {"name": "age",            "unit": "years", "min": 0,  "max": 120},
            {"name": "blood_pressure", "unit": "mmHg",  "min": 50, "max": 300},
            {"name": "cholesterol",    "unit": "mg/dL", "min": 50, "max": 700},
            {"name": "heart_rate",     "unit": "bpm",   "min": 30, "max": 250},
        ]
    }), 200


# ─────────────────────────────────────────────────────────────────────────────
# Global error handlers
# ─────────────────────────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(exc) -> Response:
    return _error(f"Endpoint not found: {request.path}", status=404)


@app.errorhandler(405)
def method_not_allowed(exc) -> Response:
    return _error(
        f"Method '{request.method}' not allowed on '{request.path}'.",
        status=405,
    )


@app.errorhandler(500)
def internal_error(exc) -> Response:
    app.logger.exception("Unhandled 500 error.")
    return _error("Internal server error.", status=500)


# ─────────────────────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "production") == "development"

    print(f"\n{'='*55}")
    print("  Heart Disease Prediction API")
    print(f"{'='*55}")
    print(f"  Endpoint  →  POST http://{host}:{port}/predict")
    print(f"  Health    →  GET  http://{host}:{port}/health")
    print(f"  Features  →  GET  http://{host}:{port}/features")
    print(f"  Debug     →  {debug}")
    print(f"{'='*55}\n")

    app.run(host=host, port=port, debug=debug)