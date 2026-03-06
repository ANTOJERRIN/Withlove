# Heart Disease Prediction — ML Pipeline

A clean, production-ready scikit-learn project for predicting heart disease.

---

## Project Structure

```
heart_disease_project/
├── data/
│   └── heart_dataset_20_features.csv   ← place your dataset here
├── model/
│   ├── train_model.py                  ← main training script
│   └── heart_model.pkl                 ← saved model (auto-generated)
├── utils/
│   ├── predict.py                      ← inference helper
│   └── validate.py                     ← data validation
├── tests/
│   └── test_pipeline.py                ← pytest unit tests
├── requirements.txt
└── README.md
```

---

## Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Add your dataset
```
cp heart_dataset_20_features.csv data/
```

### 3. Train the model
```bash
python model/train_model.py
```

This will:
- Load and validate the dataset
- Handle missing values (median imputation)
- Split 80 % train / 20 % test (stratified)
- Train a `RandomForestClassifier` inside a sklearn `Pipeline`
- Print accuracy, ROC-AUC, classification report, confusion matrix, and top-10 feature importances
- Save the model to `model/heart_model.pkl`

### 4. Run unit tests
```bash
pytest tests/test_pipeline.py -v
```

---

## Pipeline Architecture

```
Raw CSV
  │
  ▼
SimpleImputer (median strategy)
  │
  ▼
StandardScaler
  │
  ▼
RandomForestClassifier
  • n_estimators = 200
  • max_features = "sqrt"
  • class_weight = "balanced"
  • 5-fold cross-validation reported
```

---

## Inference

```python
from utils.predict import HeartPredictor

predictor = HeartPredictor()          # loads model/heart_model.pkl

result = predictor.predict({
    "age": 58, "sex": 1, "cp": 2,
    "trestbps": 140, "chol": 268,
    "fbs": 0, "restecg": 0,
    "thalach": 160, "exang": 0,
    "oldpeak": 3.6,
    # ... all 20 features
})

print(result)
# {'prediction': 1, 'probability': 0.74, 'risk_level': 'High Risk'}
```

---

## Output Sample

```
============================================================
  HEART DISEASE PREDICTION — TRAINING REPORT
============================================================
  Dataset shape        : (303, 20)
  Train / Test split   : 80% / 20%

  Test Accuracy        : 0.8689  (86.89%)
  ROC-AUC Score        : 0.9201

  Cross-Val Accuracy   : 0.8482 ± 0.0213  (5-fold)
============================================================
```
