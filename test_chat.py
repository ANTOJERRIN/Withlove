import requests
import json
import sys

def test_chat_endpoint():
    """Test the chat endpoint specifically"""
    base_url = "https://heart-risk-ai-1.preview.emergentagent.com"
    
    # Test data
    chat_data = {
        "message": "What does my moderate risk level mean?",
        "session_id": "test_session_123",
        "health_context": {
            "risk_level": "moderate",
            "probability": 58.67,
            "age": 55,
            "bmi": 28.5,
            "systolic_bp": 145,
            "diastolic_bp": 92,
            "cholesterol": 230,
            "smoker": 1,
            "family_history": 1
        }
    }
    
    print("🔍 Testing Chat Endpoint...")
    
    try:
        response = requests.post(
            f"{base_url}/api/chat",
            json=chat_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Chat response received!")
            print(f"Session ID: {result.get('session_id', 'Unknown')}")
            print(f"Response: {result.get('response', 'No response')}")
            return True
        else:
            print(f"❌ Chat failed - Status: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Chat test failed with error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_chat_endpoint()
    sys.exit(0 if success else 1)