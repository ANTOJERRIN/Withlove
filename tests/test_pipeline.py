"""
Heart Disease Prediction - Unit Tests
======================================
Run with:  pytest tests/test_pipeline.py -v
"""

import os
import sys
import pickle
import pytest
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline

# ── Path setup ────────────────────────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.train_model import preprocess, build_pipeline
from utils.validate import validate_dataframe


# ─────────────────────────────────────────────────────────────────────────────
# Fixtures
# ─────────────────────────────────────────────────────────────────────────────
@pytest.fixture
def sample_df():
    """Synthetic 20-feature heart disease dataset."""
    np.random.seed(42)
    n = 200
    return pd.DataFrame({
        "age":       np.random.randint(30, 80,  n),
        "sex":       np.random.randint(0,  2,   n),
        "cp":        np.random.randint(0,  4,   n),
        "trestbps":  np.random.randint(90, 200, n),
        "chol":      np.random.randint(150, 400, n),
        "fbs":       np.random.randint(0,  2,   n),
        "restecg":   np.random.randint(0,  3,   n),
        "thalach":   np.random.randint(70, 210, n),
        "exang":     np.random.randint(0,  2,   n),
        "oldpeak":   np.random.uniform(0,  6,   n).round(1),
        "slope":     np.random.randint(0,  3,   n),
        "ca":        np.random.randint(0,  4,   n),
        "thal":      np.random.randint(0,  3,   n),
        "trestbps2": np.random.randint(90, 200, n),
        "chol2":     np.random.randint(150, 400, n),
        "fbs2":      np.random.randint(0,  2,   n),
        "restecg2":  np.random.randint(0,  3,   n),
        "thalach2":  np.random.randint(70, 210, n),
        "exang2":    np.random.randint(0,  2,   n),
        "oldpeak2":  np.random.uniform(0,  6,   n).round(1),
        "target":    np.random.randint(0,  2,   n),
    })


@pytest.fixture
def sample_df_missing(sample_df):
    df = sample_df.copy()
    df.loc[0:10, "chol"]    = np.nan
    df.loc[5:15, "thalach"] = np.nan
    return df


# ─────────────────────────────────────────────────────────────────────────────
# Tests
# ─────────────────────────────────────────────────────────────────────────────
class TestPreprocess:
    def test_returns_correct_shapes(self, sample_df):
        X, y = preprocess(sample_df)
        assert X.shape[0] == len(sample_df)
        assert y.shape[0] == len(sample_df)

    def test_target_not_in_features(self, sample_df):
        X, y = preprocess(sample_df)
        assert "target" not in X.columns

    def test_no_object_columns_remain(self, sample_df):
        # inject a categorical col
        df = sample_df.copy()
        df["cat_col"] = np.where(df["age"] > 50, "old", "young")
        X, _ = preprocess(df)
        assert X.select_dtypes(include="object").empty

    def test_handles_missing_values_in_pipeline(self, sample_df_missing):
        """Pipeline (with Imputer) should handle missing without raising."""
        X, y = preprocess(sample_df_missing)
        pipeline = build_pipeline()
        pipeline.fit(X, y)
        preds = pipeline.predict(X)
        assert len(preds) == len(y)


class TestBuildPipeline:
    def test_pipeline_steps(self):
        p = build_pipeline()
        assert isinstance(p, Pipeline)
        assert "imputer" in p.named_steps
        assert "scaler"  in p.named_steps
        assert "clf"     in p.named_steps

    def test_pipeline_fit_predict(self, sample_df):
        X, y = preprocess(sample_df)
        p    = build_pipeline()
        p.fit(X, y)
        preds = p.predict(X)
        assert set(preds).issubset({0, 1})
        probas = p.predict_proba(X)
        assert probas.shape == (len(y), 2)
        assert np.allclose(probas.sum(axis=1), 1.0)

    def test_model_serialization(self, sample_df, tmp_path):
        X, y     = preprocess(sample_df)
        pipeline = build_pipeline()
        pipeline.fit(X, y)

        path = tmp_path / "heart_model.pkl"
        with open(path, "wb") as f:
            pickle.dump(pipeline, f)

        with open(path, "rb") as f:
            loaded = pickle.load(f)

        np.testing.assert_array_equal(
            pipeline.predict(X),
            loaded.predict(X),
        )


class TestValidation:
    def test_clean_df_passes(self, sample_df):
        is_valid, warnings = validate_dataframe(sample_df.drop(columns=["target"]))
        # May have minor range warnings but should not be "invalid"
        assert is_valid

    def test_missing_flagged(self, sample_df_missing):
        _, warnings = validate_dataframe(sample_df_missing)
        assert any("missing" in w.lower() for w in warnings)

    def test_duplicate_flagged(self, sample_df):
        df_dupes = pd.concat([sample_df, sample_df.iloc[:10]])
        _, warnings = validate_dataframe(df_dupes)
        assert any("duplicate" in w.lower() for w in warnings)
