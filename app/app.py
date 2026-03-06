from flask import Flask, render_template, request
from model.predict import predict_risk

app= Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():

    age= float(request.form["age"])
    trestbps= float(request.form["trestbps"])
    chol= float(request.form["chol"])
    thalach = float(request.form["thalach"])
    oldpeak = float(request.form["oldpeak"])

    probability, risk = predict_risk(age, trestbps, chol, thalach, oldpeak)
    return render_template("result.html",risk=risk,probability=probability)

if __name__== "__main__":
    app.run(debug=True)
