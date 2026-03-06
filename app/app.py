from flask import Flask, request, jsonify, render_template
import joblib

app = Flask(__name__)

# Load trained ML model
model = joblib.load("heart_model.pkl")

@app.route("/")
def home():
    return render_template("index.html")


def validate_input(data):
    age = int(data["age"])
    bp = int(data["bp"])
    chol = int(data["chol"])
    hr = int(data["heartrate"])
    bmi = float(data["bmi"])

    if not (0 < age < 120):
        raise ValueError("Invalid age")

    if not (50 < bp < 250):
        raise ValueError("Invalid blood pressure")

    if not (100 < chol < 600):
        raise ValueError("Invalid cholesterol")

    if not (30 < hr < 220):
        raise ValueError("Invalid heart rate")

    if not (10 < bmi < 60):
        raise ValueError("Invalid BMI")

    return [age, bp, chol, hr, bmi]


def map_risk(prob):

    if prob < 0.33:
        return "Low", "#22C55E", ["Maintain exercise", "Balanced diet"]

    elif prob < 0.66:
        return "Medium", "#F59E0B", ["Monitor BP daily", "Reduce salt intake"]

    else:
        return "High", "#EF4444", ["Consult doctor immediately", "Lifestyle changes required"]


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    features = validate_input(data)

    prob = model.predict_proba([features])[0][1]

    risk, color, suggestions = map_risk(prob)

    return jsonify({
        "risk": risk,
        "probability": round(prob,2),
        "color": color,
        "suggestions": suggestions
    })


if __name__ == "__main__":
    app.run(debug=True)