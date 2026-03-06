"""
Heart Disease Prediction - Data Validation
==========================================
Schema-level checks before training or inference.
"""

import logging
import pandas as pd
from typing import Tuple, List

log = logging.getLogger(__name__)

# Expected feature names (update if your CSV differs)
EXPECTED_FEATURES: List[str] = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope",
    "ca", "thal", "trestbps2", "chol2", "fbs2",
    "restecg2", "thalach2", "exang2", "oldpeak2",
]

NUMERIC_RANGES = {
    "age":      (0,   120),
    "trestbps": (50,  300),
    "chol":     (100, 600),
    "thalach":  (50,  250),
    "oldpeak":  (0,   10),
}


def validate_dataframe(df: pd.DataFrame) -> Tuple[bool, List[str]]:
    """
    Run basic data quality checks.

    Returns
    -------
    (is_valid, list_of_warnings)
    """
    warnings: List[str] = []

    # ── Missing values ────────────────────────────────────────────────────────
    missing = df.isnull().sum()
    for col, count in missing[missing > 0].items():
        pct = count / len(df) * 100
        msg = f"Column '{col}' has {count} missing values ({pct:.1f}%)"
        warnings.append(msg)
        if pct > 50:
            warnings.append(f"  ↳ WARNING: >50% missing in '{col}' — consider dropping.")

    # ── Duplicates ────────────────────────────────────────────────────────────
    dupes = df.duplicated().sum()
    if dupes > 0:
        warnings.append(f"{dupes} duplicate rows found.")

    # ── Numeric range checks ──────────────────────────────────────────────────
    for col, (lo, hi) in NUMERIC_RANGES.items():
        if col in df.columns:
            out = df[(df[col] < lo) | (df[col] > hi)]
            if not out.empty:
                warnings.append(
                    f"Column '{col}': {len(out)} rows outside expected "
                    f"range [{lo}, {hi}]."
                )

    is_valid = all("ERROR" not in w for w in warnings)

    if warnings:
        log.warning("Data validation warnings:\n  " + "\n  ".join(warnings))
    else:
        log.info("Data validation passed with no warnings.")

    return is_valid, warnings
