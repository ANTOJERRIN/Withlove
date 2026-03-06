from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import pickle
import numpy as np
import os
import logging
from dotenv import load_dotenv

load_dotenv()

# Logging setup
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(title="WithLove Heart Risk Prediction API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "heart_model.pkl")
model = None

# Feature names in the exact order expected by the model
FEATURE_NAMES = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 
    'exang', 'oldpeak', 'slope', 'ca', 'thal', 'age.1', 'gender', 'bmi', 
    'daily_steps', 'sleep_hours', 'water_intake_l', 'calories_consumed', 
    'smoker', 'alcohol', 'resting_hr', 'systolic_bp', 'diastolic_bp', 
    'cholesterol', 'family_history', 'disease_risk'
]

# Risk thresholds
RISK_HIGH = 0.65
RISK_MEDIUM = 0.35


class HealthData(BaseModel):
    # Original clinical features
    age: float = Field(..., ge=0, le=120, description="Patient age in years")
    sex: int = Field(..., ge=0, le=1, description="Sex: 0=Female, 1=Male")
    cp: int = Field(..., ge=0, le=3, description="Chest pain type: 0=Typical, 1=Atypical, 2=Non-anginal, 3=Asymptomatic")
    trestbps: float = Field(..., ge=50, le=300, description="Resting blood pressure (mmHg)")
    chol: float = Field(..., ge=100, le=600, description="Serum cholesterol (mg/dl)")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl: 0=No, 1=Yes")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG: 0=Normal, 1=ST-T abnormality, 2=LV hypertrophy")
    thalach: float = Field(..., ge=50, le=250, description="Maximum heart rate achieved")
    exang: int = Field(..., ge=0, le=1, description="Exercise induced angina: 0=No, 1=Yes")
    oldpeak: float = Field(..., ge=0, le=10, description="ST depression induced by exercise")
    slope: int = Field(..., ge=0, le=2, description="Slope of peak exercise ST segment: 0=Upsloping, 1=Flat, 2=Downsloping")
    ca: int = Field(..., ge=0, le=4, description="Number of major vessels colored by fluoroscopy")
    thal: int = Field(..., ge=0, le=3, description="Thalassemia: 0=Normal, 1=Fixed defect, 2=Reversible defect, 3=Not described")
    
    # Extended features
    gender: int = Field(..., ge=0, le=1, description="Gender: 0=Female, 1=Male")
    bmi: float = Field(..., ge=10, le=60, description="Body Mass Index")
    daily_steps: int = Field(..., ge=0, le=50000, description="Average daily steps")
    sleep_hours: float = Field(..., ge=0, le=24, description="Average sleep hours per day")
    water_intake_l: float = Field(..., ge=0, le=10, description="Daily water intake in liters")
    calories_consumed: int = Field(..., ge=500, le=10000, description="Daily calories consumed")
    smoker: int = Field(..., ge=0, le=1, description="Smoker: 0=No, 1=Yes")
    alcohol: int = Field(..., ge=0, le=1, description="Alcohol consumption: 0=No, 1=Yes")
    resting_hr: int = Field(..., ge=40, le=200, description="Resting heart rate (BPM)")
    systolic_bp: int = Field(..., ge=70, le=250, description="Systolic blood pressure (mmHg)")
    diastolic_bp: int = Field(..., ge=40, le=150, description="Diastolic blood pressure (mmHg)")
    cholesterol_level: float = Field(..., ge=100, le=600, description="Cholesterol level (mg/dl)")
    family_history: int = Field(..., ge=0, le=1, description="Family history of heart disease: 0=No, 1=Yes")
    disease_risk: int = Field(default=0, ge=0, le=1, description="Known disease risk factor: 0=No, 1=Yes")


class PredictionResponse(BaseModel):
    risk_level: str
    probability: float
    health_status: str
    recommendations: list


class ChatMessage(BaseModel):
    message: str
    session_id: str = "default"
    health_context: Optional[dict] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        log.info(f"Model loaded from {MODEL_PATH}")
        return True
    else:
        log.error(f"Model not found at {MODEL_PATH}")
        return False


def classify_risk(probability: float) -> tuple:
    """Map probability to risk tier and health status."""
    if probability >= RISK_HIGH:
        return "high", "Your risk assessment indicates elevated cardiovascular concerns. Please schedule an appointment with a cardiologist for comprehensive evaluation and personalized treatment plan."
    elif probability >= RISK_MEDIUM:
        return "moderate", "Your assessment shows moderate cardiovascular risk. We recommend consulting with your healthcare provider and implementing lifestyle modifications."
    else:
        return "low", "Your cardiovascular risk is within the healthy range. Continue maintaining a healthy lifestyle with regular exercise and balanced nutrition."


def get_recommendations(risk_level: str, data: HealthData) -> list:
    """Generate personalized recommendations based on risk and data."""
    recommendations = []
    
    if risk_level == "high":
        recommendations.append("Schedule a comprehensive cardiac examination immediately")
        recommendations.append("Consult with a cardiologist within the next week")
    
    if data.smoker == 1:
        recommendations.append("Strongly consider smoking cessation programs")
    
    if data.bmi > 30:
        recommendations.append("Work with a nutritionist on weight management")
    elif data.bmi > 25:
        recommendations.append("Consider dietary changes for healthy weight maintenance")
    
    if data.daily_steps < 5000:
        recommendations.append("Aim to increase daily steps to at least 7,000-10,000")
    
    if data.sleep_hours < 7:
        recommendations.append("Try to get 7-9 hours of quality sleep each night")
    
    if data.water_intake_l < 2:
        recommendations.append("Increase daily water intake to at least 2-3 liters")
    
    if data.alcohol == 1:
        recommendations.append("Limit alcohol consumption for better heart health")
    
    if data.systolic_bp > 140 or data.diastolic_bp > 90:
        recommendations.append("Monitor blood pressure regularly and consult your doctor")
    
    if data.cholesterol_level > 200:
        recommendations.append("Consider dietary changes to reduce cholesterol levels")
    
    if data.family_history == 1:
        recommendations.append("Regular screenings are important given your family history")
    
    if len(recommendations) < 3:
        recommendations.append("Maintain regular cardiovascular check-ups every 6 months")
        recommendations.append("Continue heart-healthy habits like regular exercise")
    
    return recommendations[:6]


@app.on_event("startup")
async def startup_event():
    load_model()


@app.get("/api/")
async def root():
    return {"message": "WithLove Heart Risk Prediction API", "status": "healthy"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}


@app.post("/api/predict", response_model=PredictionResponse)
async def predict_risk(data: HealthData):
    """Predict heart disease risk based on health parameters."""
    if model is None:
        if not load_model():
            raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        features = {
            'age': data.age,
            'sex': data.sex,
            'cp': data.cp,
            'trestbps': data.trestbps,
            'chol': data.chol,
            'fbs': data.fbs,
            'restecg': data.restecg,
            'thalach': data.thalach,
            'exang': data.exang,
            'oldpeak': data.oldpeak,
            'slope': data.slope,
            'ca': data.ca,
            'thal': data.thal,
            'age.1': data.age,
            'gender': data.gender,
            'bmi': data.bmi,
            'daily_steps': data.daily_steps,
            'sleep_hours': data.sleep_hours,
            'water_intake_l': data.water_intake_l,
            'calories_consumed': data.calories_consumed,
            'smoker': data.smoker,
            'alcohol': data.alcohol,
            'resting_hr': data.resting_hr,
            'systolic_bp': data.systolic_bp,
            'diastolic_bp': data.diastolic_bp,
            'cholesterol': data.cholesterol_level,
            'family_history': data.family_history,
            'disease_risk': data.disease_risk
        }
        
        X = np.array([[features[name] for name in FEATURE_NAMES]], dtype=np.float64)
        proba = model.predict_proba(X)
        probability = float(proba[0, 1]) if proba.shape[1] == 2 else float(proba[0].max())
        
        risk_level, health_status = classify_risk(probability)
        recommendations = get_recommendations(risk_level, data)
        
        log.info(f"Prediction: risk={risk_level}, probability={probability:.4f}")
        
        return PredictionResponse(
            risk_level=risk_level,
            probability=round(probability * 100, 2),
            health_status=health_status,
            recommendations=recommendations
        )
        
    except Exception as e:
        log.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_assistant(chat_data: ChatMessage):
    """Chat with AI health assistant powered by GPT-4o."""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        # Build context-aware system message
        system_message = """You are WithLove AI Health Assistant, a knowledgeable and empathetic medical advisor specializing in cardiovascular health.

Your role is to:
- Answer questions about heart disease risk factors, prevention, and lifestyle advice
- Explain medical terms in simple, easy-to-understand language
- Provide evidence-based health recommendations
- Be supportive and encouraging while being medically accurate

Guidelines:
- Keep responses concise (2-4 sentences when possible)
- Use bullet points for lists
- Always recommend consulting a healthcare professional for specific medical decisions
- Never diagnose conditions - only provide educational information
- Be warm and supportive in tone"""
        
        # Add health context if provided
        if chat_data.health_context:
            ctx = chat_data.health_context
            context_info = f"""

Current User Health Profile:
- Risk Level: {ctx.get('risk_level', 'Unknown')}
- Risk Probability: {ctx.get('probability', 'Unknown')}%
- Age: {ctx.get('age', 'Unknown')}
- BMI: {ctx.get('bmi', 'Unknown')}
- Blood Pressure: {ctx.get('systolic_bp', 'Unknown')}/{ctx.get('diastolic_bp', 'Unknown')} mmHg
- Cholesterol: {ctx.get('cholesterol', 'Unknown')} mg/dL
- Smoker: {'Yes' if ctx.get('smoker') == 1 else 'No'}
- Family History: {'Yes' if ctx.get('family_history') == 1 else 'No'}

Use this context to provide personalized responses when relevant."""
            system_message += context_info
        
        # Initialize chat with GPT-4o
        chat = LlmChat(
            api_key=api_key,
            session_id=chat_data.session_id,
            system_message=system_message
        ).with_model("openai", "gpt-4o")
        
        # Send message and get response
        user_message = UserMessage(text=chat_data.message)
        response = await chat.send_message(user_message)
        
        log.info(f"Chat response generated for session: {chat_data.session_id}")
        
        return ChatResponse(
            response=response,
            session_id=chat_data.session_id
        )
        
    except ImportError as e:
        log.error(f"Import error: {str(e)}")
        raise HTTPException(status_code=500, detail="Chat service not available - missing dependencies")
    except Exception as e:
        log.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@app.get("/api/feature-info")
async def get_feature_info():
    """Return information about the expected input features."""
    return {
        "clinical_features": {
            "age": {"type": "number", "min": 0, "max": 120, "description": "Patient age in years"},
            "sex": {"type": "select", "options": [{"value": 0, "label": "Female"}, {"value": 1, "label": "Male"}]},
            "cp": {"type": "select", "options": [
                {"value": 0, "label": "Typical Angina"},
                {"value": 1, "label": "Atypical Angina"},
                {"value": 2, "label": "Non-anginal Pain"},
                {"value": 3, "label": "Asymptomatic"}
            ], "description": "Chest pain type"},
            "trestbps": {"type": "number", "min": 50, "max": 300, "description": "Resting blood pressure (mmHg)"},
            "chol": {"type": "number", "min": 100, "max": 600, "description": "Serum cholesterol (mg/dl)"},
            "fbs": {"type": "select", "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}], "description": "Fasting blood sugar > 120 mg/dl"},
            "restecg": {"type": "select", "options": [
                {"value": 0, "label": "Normal"},
                {"value": 1, "label": "ST-T abnormality"},
                {"value": 2, "label": "LV hypertrophy"}
            ], "description": "Resting ECG results"},
            "thalach": {"type": "number", "min": 50, "max": 250, "description": "Maximum heart rate achieved"},
            "exang": {"type": "select", "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}], "description": "Exercise induced angina"},
            "oldpeak": {"type": "number", "min": 0, "max": 10, "step": 0.1, "description": "ST depression induced by exercise"},
            "slope": {"type": "select", "options": [
                {"value": 0, "label": "Upsloping"},
                {"value": 1, "label": "Flat"},
                {"value": 2, "label": "Downsloping"}
            ], "description": "Slope of peak exercise ST segment"},
            "ca": {"type": "select", "options": [
                {"value": 0, "label": "0"},
                {"value": 1, "label": "1"},
                {"value": 2, "label": "2"},
                {"value": 3, "label": "3"},
                {"value": 4, "label": "4"}
            ], "description": "Number of major vessels colored by fluoroscopy"},
            "thal": {"type": "select", "options": [
                {"value": 0, "label": "Normal"},
                {"value": 1, "label": "Fixed defect"},
                {"value": 2, "label": "Reversible defect"},
                {"value": 3, "label": "Not described"}
            ], "description": "Thalassemia"}
        },
        "lifestyle_features": {
            "gender": {"type": "select", "options": [{"value": 0, "label": "Female"}, {"value": 1, "label": "Male"}]},
            "bmi": {"type": "number", "min": 10, "max": 60, "step": 0.1, "description": "Body Mass Index"},
            "daily_steps": {"type": "number", "min": 0, "max": 50000, "description": "Average daily steps"},
            "sleep_hours": {"type": "number", "min": 0, "max": 24, "step": 0.5, "description": "Average sleep hours"},
            "water_intake_l": {"type": "number", "min": 0, "max": 10, "step": 0.1, "description": "Daily water intake (liters)"},
            "calories_consumed": {"type": "number", "min": 500, "max": 10000, "description": "Daily calories consumed"},
            "smoker": {"type": "select", "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]},
            "alcohol": {"type": "select", "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}], "description": "Regular alcohol consumption"},
            "resting_hr": {"type": "number", "min": 40, "max": 200, "description": "Resting heart rate (BPM)"},
            "systolic_bp": {"type": "number", "min": 70, "max": 250, "description": "Systolic blood pressure (mmHg)"},
            "diastolic_bp": {"type": "number", "min": 40, "max": 150, "description": "Diastolic blood pressure (mmHg)"},
            "cholesterol_level": {"type": "number", "min": 100, "max": 600, "description": "Cholesterol level (mg/dl)"},
            "family_history": {"type": "select", "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}], "description": "Family history of heart disease"}
        }
    }
