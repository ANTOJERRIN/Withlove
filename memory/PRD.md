# WithLove - Heart Risk Prediction Dashboard

## Original Problem Statement
Create a healthcare dashboard with AI Heart Risk Prediction, AR Heart Visualization with risk-based colors, and ChatGPT integration for health assistant.

## Architecture
- **Frontend**: React with Tailwind CSS + Shadcn UI
- **Backend**: FastAPI with scikit-learn ML model + OpenAI GPT-4o via emergentintegrations
- **ML Model**: RandomForest pipeline (heart_model.pkl) with 28 features
- **AI Chat**: GPT-4o via Emergent LLM key

## What's Been Implemented (Jan 2026)

### AR Heart Visualization
- [x] Dynamic color system based on risk percentage:
  - Green (0-40%): Low Risk - slow heartbeat
  - Yellow (41-70%): Moderate Risk - moderate heartbeat  
  - Red (71-100%): High Risk - fast heartbeat
- [x] CSS-based animated heart with pulsing rings
- [x] ECG line animation
- [x] Risk level overlay with status and probability
- [x] Color legend for risk levels
- [x] Ready for Unity WebGL integration

### ChatGPT Integration
- [x] GPT-4o powered health assistant
- [x] Context-aware responses using user health data
- [x] Quick action buttons for common questions
- [x] Session-based conversation history
- [x] "Powered by ChatGPT" branding

### Health Form & Prediction
- [x] 28 parameters across 2 tabs (Clinical + Lifestyle)
- [x] ML model integration for real predictions
- [x] Personalized recommendations based on user data
- [x] Color-coded risk results

## API Endpoints
- POST /api/predict - Heart risk prediction (28 features)
- POST /api/chat - ChatGPT health assistant
- GET /api/health - Model status
- GET /api/feature-info - Feature documentation

## Risk Classification
- Low: probability <= 40% (Green)
- Moderate: 40% < probability <= 70% (Yellow)
- High: probability > 70% (Red)

## Next Tasks
1. Integrate actual Unity WebGL 3D heart model
2. Add user authentication for history tracking
3. PDF report generation
4. Email notifications for high-risk alerts
