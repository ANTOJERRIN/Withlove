# WithLove - Heart Risk Prediction Dashboard

## Original Problem Statement
Create a modern healthcare web dashboard for an AI Heart Risk Prediction System named "WithLove". Users should be able to input ALL dataset parameters (28 features). The app uses a trained ML model (heart_model.pkl) for predictions.

## Architecture
- **Frontend**: React with Tailwind CSS + Shadcn UI components
- **Backend**: FastAPI with scikit-learn ML model integration
- **Database**: MongoDB (not used for predictions)
- **ML Model**: RandomForest pipeline with StandardScaler and SimpleImputer

## What's Been Implemented (Jan 2026)
- [x] Renamed to "WithLove" branding (header, footer, chatbot)
- [x] Removed "Learn More" button from hero section
- [x] Comprehensive health form with 28 parameters in two tabs:
  - Clinical Parameters (13): age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
  - Lifestyle & Vitals (13): gender, bmi, daily_steps, sleep_hours, water_intake_l, calories_consumed, smoker, alcohol, resting_hr, systolic_bp, diastolic_bp, cholesterol_level, family_history
- [x] ML model integration for real predictions
- [x] Personalized recommendations based on user data
- [x] Color-coded risk display (Low=Green, Moderate=Yellow, High=Red)
- [x] All 8 sections functional (Header, Hero, Form, Image Upload, AR, Results, Precautions, Chatbot, Footer)

## Backend API Endpoints
- GET /api/ - Health check
- GET /api/health - Model status
- GET /api/feature-info - Feature documentation
- POST /api/predict - Heart risk prediction (28 features)

## Risk Classification
- Low: probability < 35%
- Moderate: 35% <= probability < 65%
- High: probability >= 65%

## Next Tasks
1. Connect AI chatbot to actual LLM API (ChatGPT/Gemini)
2. Embed Unity WebGL heart model in AR container
3. Add user authentication for health history tracking
4. Implement PDF report generation
