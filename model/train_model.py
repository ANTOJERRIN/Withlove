import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib

# Load dataset
data = pd.read_csv("model/heart.csv")

# Check columns
print("Columns in dataset:", data.columns)

# Select features
features = ["age", "trestbps", "chol", "thalach", "oldpeak"]

X = data[features]

# Change this if dataset uses "output"
y = data["target"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Accuracy
accuracy = model.score(X_test, y_test)
print("Model Accuracy:", accuracy)

# Save model
joblib.dump(model, "heart_model.pkl")

print("Model trained and saved successfully.")