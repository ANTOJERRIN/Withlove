import joblib
import numpy as np

model = joblib.load("heart_model.pkl")

def predict_risk(age, trestbps, chol, thalach, oldpeak):
    input_data = np.array([[age, trestbps, chol, thalach, oldpeak]])
    probability = model.predict_proba(input_data)[0][1]

    if probability < 0.3:
        risk = "Low"
        heart_age = age
    elif probability < 0.7:
        risk = "Medium"
        heart_age = age + 5
    else:
        risk = "High"
        heart_age = age + 10

    return risk, heart_age
