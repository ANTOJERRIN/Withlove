import requests
import sys
import json
from datetime import datetime

class WithLoveAPITester:
    def __init__(self, base_url="https://heart-risk-ai-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"📄 Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"📄 Response: {response.text[:200]}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"📄 Response: {response.text[:500]}")

            return success, response.json() if success and response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "/api/", 200)

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test("Health Check", "GET", "/api/health", 200)
        if success and 'model_loaded' in response:
            print(f"🧠 Model Status: {'Loaded' if response['model_loaded'] else 'Not Loaded'}")
        return success, response

    def test_feature_info(self):
        """Test feature info endpoint"""
        return self.run_test("Feature Info", "GET", "/api/feature-info", 200)

    def test_predict_all_parameters(self):
        """Test prediction with all 28 parameters"""
        # Complete dataset with all 28 features
        test_data = {
            # Clinical Parameters (13 fields)
            "age": 55,
            "sex": 1,
            "cp": 2,
            "trestbps": 140,
            "chol": 220,
            "fbs": 1,
            "restecg": 1,
            "thalach": 150,
            "exang": 0,
            "oldpeak": 1.5,
            "slope": 1,
            "ca": 1,
            "thal": 2,
            
            # Lifestyle & Vitals (13 fields)
            "gender": 1,
            "bmi": 28.5,
            "daily_steps": 4000,
            "sleep_hours": 6.5,
            "water_intake_l": 1.8,
            "calories_consumed": 2300,
            "smoker": 1,
            "alcohol": 1,
            "resting_hr": 85,
            "systolic_bp": 145,
            "diastolic_bp": 92,
            "cholesterol_level": 230,
            "family_history": 1,
            
            # Additional field
            "disease_risk": 0
        }
        
        success, response = self.run_test(
            "Heart Risk Prediction (All Parameters)", 
            "POST", 
            "/api/predict", 
            200, 
            test_data
        )
        
        if success:
            print(f"🔍 Risk Level: {response.get('risk_level', 'Unknown')}")
            print(f"📊 Probability: {response.get('probability', 'Unknown')}%")
            print(f"🏥 Health Status: {response.get('health_status', 'Unknown')[:100]}...")
            print(f"💡 Recommendations: {len(response.get('recommendations', []))} items")
        
        return success, response

    def test_predict_low_risk(self):
        """Test prediction with low risk profile"""
        test_data = {
            "age": 30,
            "sex": 0,
            "cp": 3,
            "trestbps": 110,
            "chol": 180,
            "fbs": 0,
            "restecg": 0,
            "thalach": 180,
            "exang": 0,
            "oldpeak": 0.0,
            "slope": 0,
            "ca": 0,
            "thal": 0,
            "gender": 0,
            "bmi": 22.0,
            "daily_steps": 10000,
            "sleep_hours": 8.0,
            "water_intake_l": 2.5,
            "calories_consumed": 1800,
            "smoker": 0,
            "alcohol": 0,
            "resting_hr": 65,
            "systolic_bp": 110,
            "diastolic_bp": 70,
            "cholesterol_level": 180,
            "family_history": 0,
            "disease_risk": 0
        }
        
        return self.run_test("Low Risk Prediction", "POST", "/api/predict", 200, test_data)

    def test_predict_high_risk(self):
        """Test prediction with high risk profile"""
        test_data = {
            "age": 65,
            "sex": 1,
            "cp": 0,
            "trestbps": 180,
            "chol": 300,
            "fbs": 1,
            "restecg": 2,
            "thalach": 120,
            "exang": 1,
            "oldpeak": 3.5,
            "slope": 2,
            "ca": 3,
            "thal": 1,
            "gender": 1,
            "bmi": 35.0,
            "daily_steps": 2000,
            "sleep_hours": 5.0,
            "water_intake_l": 1.0,
            "calories_consumed": 3000,
            "smoker": 1,
            "alcohol": 1,
            "resting_hr": 95,
            "systolic_bp": 180,
            "diastolic_bp": 100,
            "cholesterol_level": 300,
            "family_history": 1,
            "disease_risk": 1
        }
        
        return self.run_test("High Risk Prediction", "POST", "/api/predict", 200, test_data)

    def test_invalid_data(self):
        """Test API with invalid data"""
        invalid_data = {
            "age": -5,  # Invalid age
            "sex": 2,   # Invalid sex
            "cp": 5     # Invalid cp value
        }
        
        return self.run_test("Invalid Data Validation", "POST", "/api/predict", 422, invalid_data)

    def test_chatgpt_integration(self):
        """Test ChatGPT integration endpoint"""
        chat_data = {
            "message": "What does my moderate risk level mean?",
            "session_id": "test_session_123",
            "health_context": {
                "risk_level": "moderate",
                "probability": 58,
                "age": 55,
                "bmi": 28.5,
                "systolic_bp": 145,
                "diastolic_bp": 92,
                "cholesterol": 230,
                "smoker": 1,
                "family_history": 1
            }
        }
        
        success, response = self.run_test(
            "ChatGPT Integration", 
            "POST", 
            "/api/chat", 
            200, 
            chat_data
        )
        
        if success:
            print(f"🤖 AI Response: {response.get('response', 'No response')[:100]}...")
            print(f"📋 Session ID: {response.get('session_id', 'Unknown')}")
        
        return success, response

def main():
    print("🔬 Starting WithLove API Testing Suite")
    print("=" * 60)
    
    tester = WithLoveAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_health_check,
        tester.test_feature_info,
        tester.test_predict_all_parameters,
        tester.test_predict_low_risk,
        tester.test_predict_high_risk,
        tester.test_invalid_data,
        tester.test_chatgpt_integration
    ]
    
    failed_tests = []
    
    for test in tests:
        try:
            success, _ = test()
            if not success:
                failed_tests.append(test.__name__)
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
            failed_tests.append(test.__name__)
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed Tests: {', '.join(failed_tests)}")
        return 1
    else:
        print(f"\n✅ All tests passed!")
        return 0

if __name__ == "__main__":
    sys.exit(main())