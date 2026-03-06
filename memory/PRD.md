# CardioVision AI - Heart Risk Prediction Dashboard

## Original Problem Statement
Create a modern aesthetic responsive healthcare web dashboard for an AI Heart Risk Prediction System. Frontend only (HTML, CSS, JavaScript) structured for future backend API integration.

## Architecture
- **Frontend**: React with Tailwind CSS + Shadcn UI components
- **Styling**: Custom CSS with Outfit/Plus Jakarta Sans fonts
- **State Management**: React useState hooks
- **No Backend**: Placeholder logic for API integration readiness

## User Personas
1. **Patients** - General users seeking cardiovascular risk assessment
2. **Healthcare Professionals** - Medical staff monitoring patient health data
3. **Health-conscious Individuals** - Proactive users tracking heart health

## Core Requirements (Static)
- 8-section single scroll page layout
- Healthcare color palette (white, blue, teal, black, grey, subtle red)
- Responsive design (mobile-first)
- Data-testid attributes for all interactive elements
- Form fields: Age, Blood Pressure, Cholesterol, Heart Rate, BMI
- Image capture/upload capability
- AR visualization placeholder for Unity WebGL
- Color-coded risk results (Green/Yellow/Red)
- ChatGPT-style AI assistant UI

## What's Been Implemented (Jan 2026)
- [x] Sticky header with CardioVision AI branding and heartbeat animation
- [x] Hero section with ECG background animation
- [x] Health data input form with 5 fields + icons
- [x] Image upload with drag-drop and camera capture
- [x] AR Heart Visualization placeholder with pulsing animation
- [x] AI Prediction Results with Bento grid layout
- [x] 3-category Precautions panel (Must Do, Important, Better Results)
- [x] AI Health Assistant chatbot with placeholder responses
- [x] Footer with navigation links
- [x] Responsive mobile menu
- [x] Smooth scroll navigation

## Prioritized Backlog
### P0 (Critical)
- Backend API integration for real ML predictions
- Unity WebGL/AR module integration

### P1 (High)
- User authentication system
- Data persistence (MongoDB)
- ChatGPT/Gemini API integration for AI assistant
- PDF report generation

### P2 (Medium)
- User health history tracking
- Multi-language support
- Email/SMS notifications
- Dark mode toggle

## Next Tasks
1. Implement backend API endpoints for prediction
2. Integrate actual ML model for heart risk calculation
3. Connect AI assistant to LLM API (ChatGPT/Gemini)
4. Add Unity WebGL heart model to AR container
5. Implement user authentication
