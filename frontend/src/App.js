import { useState, useRef } from "react";
import "@/App.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { 
  Heart, 
  Activity, 
  Gauge, 
  Droplets, 
  Scale, 
  User,
  Camera,
  UploadCloud,
  Send,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Lightbulb,
  Star,
  Zap,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

// Header Component
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 glass-effect" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3" data-testid="logo">
            <div className="relative">
              <Heart className="h-8 w-8 text-[#EF4444] animate-pulse-red" />
              <div className="absolute inset-0 h-8 w-8 bg-[#EF4444]/20 rounded-full animate-pulse-ring" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#0F172A] tracking-tight">CardioVision AI</h1>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            <a href="#health-input" className="text-sm font-medium text-slate-600 hover:text-[#0D9488] transition-colors">Health Data</a>
            <a href="#visualization" className="text-sm font-medium text-slate-600 hover:text-[#0D9488] transition-colors">Visualization</a>
            <a href="#results" className="text-sm font-medium text-slate-600 hover:text-[#0D9488] transition-colors">Results</a>
            <a href="#assistant" className="text-sm font-medium text-slate-600 hover:text-[#0D9488] transition-colors">AI Assistant</a>
          </nav>

          {/* Emergency CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
              data-testid="emergency-btn"
            >
              <Zap className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in-up" data-testid="mobile-menu">
            <nav className="flex flex-col gap-4">
              <a href="#health-input" className="text-sm font-medium text-slate-600 hover:text-[#0D9488] transition-colors py-2">Health Data</a>
              <a href="#visualization" className="text-sm font-medium text-slate-600 hover:text-[#0D9488] transition-colors py-2">Visualization</a>
              <a href="#results" className="text-sm font-medium text-slate-600 hover:text-[#0D9488] transition-colors py-2">Results</a>
              <a href="#assistant" className="text-sm font-medium text-slate-600 hover:text-[#0D9488] transition-colors py-2">AI Assistant</a>
              <Separator />
              <Button variant="outline" className="border-[#EF4444] text-[#EF4444] w-full">
                <Zap className="h-4 w-4 mr-2" />
                Emergency
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 header-gradient overflow-hidden" data-testid="hero-section">
      {/* ECG Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path 
            className="ecg-line" 
            d="M0,100 L200,100 L220,100 L240,60 L260,140 L280,100 L300,100 L500,100 L520,100 L540,20 L560,180 L580,100 L600,100 L800,100 L820,100 L840,60 L860,140 L880,100 L900,100 L1100,100 L1120,100 L1140,20 L1160,180 L1180,100 L1200,100"
            fill="none"
            stroke="#0D9488"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-[#CCFBF1] text-[#0D9488] hover:bg-[#CCFBF1]" data-testid="hero-badge">
            <Activity className="h-3 w-3 mr-1" />
            AI-Powered Health Analysis
          </Badge>
          
          <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 leading-tight" data-testid="hero-title">
            AI Heart Risk Prediction
            <span className="block text-[#0D9488]">& AR Visualization System</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="hero-subtitle">
            Advanced cardiovascular health assessment powered by artificial intelligence with immersive 
            augmented reality visualization. Get instant risk analysis and personalized recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-8"
              data-testid="start-assessment-btn"
              onClick={() => document.getElementById('health-input').scrollIntoView({ behavior: 'smooth' })}
            >
              <Heart className="h-5 w-5 mr-2" />
              Start Assessment
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488]"
              data-testid="learn-more-btn"
            >
              Learn More
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Health Data Input Form
const HealthInputForm = ({ formData, setFormData, onSubmit }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="health-input" className="py-16 md:py-24" data-testid="health-input-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-[#0F172A] mb-4" data-testid="health-input-title">
            Enter Your Health Data
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Provide your vital health metrics for accurate AI-powered risk assessment. All data is processed securely.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg border-0 card-hover" data-testid="health-form-card">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="flex items-center gap-2 text-[#0F172A]">
              <Activity className="h-5 w-5 text-[#0D9488]" />
              Health Parameters
            </CardTitle>
            <CardDescription>Enter your current health measurements below</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form id="health-data-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }} data-testid="health-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-[#0D9488]" />
                    Age (years)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="input-focus-teal"
                    data-testid="input-age"
                  />
                </div>

                {/* Blood Pressure */}
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure" className="flex items-center gap-2 text-sm font-medium">
                    <Gauge className="h-4 w-4 text-[#0D9488]" />
                    Blood Pressure (mmHg)
                  </Label>
                  <Input
                    id="bloodPressure"
                    type="number"
                    placeholder="e.g., 120"
                    min="60"
                    max="250"
                    value={formData.bloodPressure}
                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                    className="input-focus-teal"
                    data-testid="input-blood-pressure"
                  />
                </div>

                {/* Cholesterol */}
                <div className="space-y-2">
                  <Label htmlFor="cholesterol" className="flex items-center gap-2 text-sm font-medium">
                    <Droplets className="h-4 w-4 text-[#0D9488]" />
                    Cholesterol (mg/dL)
                  </Label>
                  <Input
                    id="cholesterol"
                    type="number"
                    placeholder="e.g., 200"
                    min="100"
                    max="400"
                    value={formData.cholesterol}
                    onChange={(e) => handleInputChange('cholesterol', e.target.value)}
                    className="input-focus-teal"
                    data-testid="input-cholesterol"
                  />
                </div>

                {/* Heart Rate */}
                <div className="space-y-2">
                  <Label htmlFor="heartRate" className="flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4 text-[#0D9488]" />
                    Heart Rate (BPM)
                  </Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="e.g., 72"
                    min="40"
                    max="200"
                    value={formData.heartRate}
                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                    className="input-focus-teal"
                    data-testid="input-heart-rate"
                  />
                </div>

                {/* BMI */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bmi" className="flex items-center gap-2 text-sm font-medium">
                    <Scale className="h-4 w-4 text-[#0D9488]" />
                    BMI (Body Mass Index)
                  </Label>
                  <Input
                    id="bmi"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 24.5"
                    min="10"
                    max="60"
                    value={formData.bmi}
                    onChange={(e) => handleInputChange('bmi', e.target.value)}
                    className="input-focus-teal max-w-md"
                    data-testid="input-bmi"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button 
                  type="submit"
                  size="lg"
                  className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-12"
                  data-testid="predict-risk-btn"
                >
                  <Heart className="h-5 w-5 mr-2 animate-heartbeat" />
                  Predict Risk
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

// Image Capture/Upload Section
const ImageUploadSection = ({ imagePreview, setImagePreview }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50" data-testid="image-upload-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-[#0F172A] mb-4" data-testid="image-upload-title">
            Medical Image Upload
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload or capture a medical image for enhanced AI analysis and AR visualization.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg border-0" data-testid="image-upload-card">
          <CardContent className="p-6 md:p-8">
            {/* Upload Area */}
            <div
              className={`upload-area rounded-2xl p-8 text-center cursor-pointer relative overflow-hidden ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-dropzone"
            >
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                    data-testid="image-preview"
                  />
                  <div className="scan-overlay" />
                </div>
              ) : (
                <div className="py-8">
                  <UploadCloud className="h-16 w-16 mx-auto text-[#0D9488] mb-4 opacity-80" />
                  <p className="text-slate-600 font-medium mb-2">Drag & drop your image here</p>
                  <p className="text-sm text-slate-400">or click to browse files</p>
                </div>
              )}
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="file-input"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="camera"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="camera-input"
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white"
                onClick={() => cameraInputRef.current?.click()}
                data-testid="capture-photo-btn"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture Photo
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-300 hover:border-[#0D9488] hover:text-[#0D9488]"
                onClick={() => fileInputRef.current?.click()}
                data-testid="upload-image-btn"
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>

            {imagePreview && (
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-[#EF4444]"
                  onClick={() => setImagePreview(null)}
                  data-testid="clear-image-btn"
                >
                  Clear Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

// AR Heart Visualization Section
const ARVisualizationSection = () => {
  return (
    <section id="visualization" className="py-16 md:py-24" data-testid="ar-visualization-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-[#0F172A] mb-4" data-testid="ar-title">
            AR Heart Visualization
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Immersive 3D heart model with real-time risk indicators powered by augmented reality technology.
          </p>
        </div>

        {/* AR Container */}
        <div 
          className="ar-container aspect-video max-w-5xl mx-auto rounded-3xl shadow-2xl border border-slate-700"
          data-testid="ar-container"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Pulsing Heart Animation */}
            <div className="heart-pulse-container mb-6">
              <div className="heart-pulse-ring" />
              <div className="heart-pulse-ring" />
              <div className="heart-pulse-ring" />
              <Heart className="h-24 w-24 md:h-32 md:w-32 text-[#EF4444] animate-heartbeat relative z-10" />
            </div>
            
            <p className="text-white/80 text-lg font-medium mb-2" data-testid="ar-status-text">
              Initializing AR Environment...
            </p>
            <p className="text-white/50 text-sm">
              Unity WebGL / AR module will load here
            </p>

            {/* Loading Indicators */}
            <div className="flex items-center gap-2 mt-6">
              <div className="h-2 w-2 bg-[#0D9488] rounded-full animate-pulse" />
              <div className="h-2 w-2 bg-[#0D9488] rounded-full animate-pulse animation-delay-200" />
              <div className="h-2 w-2 bg-[#0D9488] rounded-full animate-pulse animation-delay-400" />
            </div>
          </div>

          {/* Placeholder for Unity WebGL iframe */}
          <div 
            id="unity-container" 
            className="absolute inset-0 hidden"
            data-testid="unity-container"
          >
            {/* Unity WebGL build will be embedded here */}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          AR visualization requires WebGL-enabled browser
        </p>
      </div>
    </section>
  );
};

// AI Prediction Results Section
const PredictionResultsSection = ({ results, showResults }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return { bg: 'bg-[#22C55E]', text: 'text-[#22C55E]', border: 'border-[#22C55E]' };
      case 'moderate': return { bg: 'bg-[#EAB308]', text: 'text-[#EAB308]', border: 'border-[#EAB308]' };
      case 'high': return { bg: 'bg-[#EF4444]', text: 'text-[#EF4444]', border: 'border-[#EF4444]' };
      default: return { bg: 'bg-slate-400', text: 'text-slate-400', border: 'border-slate-400' };
    }
  };

  const riskColors = getRiskColor(results.riskLevel);

  return (
    <section id="results" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white" data-testid="results-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-[#0F172A] mb-4" data-testid="results-title">
            AI Prediction Results
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Your personalized cardiovascular risk assessment based on AI analysis.
          </p>
        </div>

        {showResults ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in-up">
            {/* Risk Level - Large Card */}
            <Card className={`md:col-span-2 shadow-lg border-0 overflow-hidden ${results.riskLevel === 'low' ? 'risk-low' : results.riskLevel === 'moderate' ? 'risk-moderate' : 'risk-high'}`} data-testid="risk-level-card">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Risk Level</p>
                    <h3 className={`text-3xl md:text-4xl font-bold capitalize ${riskColors.text}`} data-testid="risk-level-value">
                      {results.riskLevel} Risk
                    </h3>
                    <p className="text-slate-600 mt-2">{results.description}</p>
                  </div>
                  <div className={`h-20 w-20 rounded-full flex items-center justify-center ${riskColors.bg} bg-opacity-20`}>
                    {results.riskLevel === 'low' ? (
                      <CheckCircle2 className={`h-10 w-10 ${riskColors.text}`} />
                    ) : results.riskLevel === 'moderate' ? (
                      <AlertTriangle className={`h-10 w-10 ${riskColors.text}`} />
                    ) : (
                      <Heart className={`h-10 w-10 ${riskColors.text}`} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Probability */}
            <Card className="shadow-lg border-0 card-hover" data-testid="risk-probability-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500 mb-2">Risk Probability</p>
                <h3 className={`text-4xl font-bold ${riskColors.text}`} data-testid="risk-probability-value">
                  {results.probability}%
                </h3>
                <div className="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${riskColors.bg} progress-bar-fill rounded-full`}
                    style={{ width: `${results.probability}%` }}
                    data-testid="probability-bar"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Heart Health Status */}
            <Card className="md:col-span-3 shadow-lg border-0" data-testid="health-status-card">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${riskColors.bg} bg-opacity-10`}>
                    <Activity className={`h-6 w-6 ${riskColors.text}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#0F172A] mb-2">Heart Health Status</h4>
                    <p className="text-slate-600" data-testid="health-status-text">{results.healthStatus}</p>
                  </div>
                  <Badge className={`${riskColors.bg} text-white`} data-testid="health-status-badge">
                    {results.riskLevel === 'low' ? 'Healthy' : results.riskLevel === 'moderate' ? 'Attention Needed' : 'Action Required'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto shadow-lg border-0" data-testid="no-results-card">
            <CardContent className="p-8 text-center">
              <Heart className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">
                Submit your health data above to receive AI-powered risk predictions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

// Precautions Panel Section
const PrecautionsSection = ({ showResults }) => {
  const precautions = {
    mustDo: [
      "Schedule regular cardiovascular check-ups every 6 months",
      "Monitor blood pressure daily and keep a log",
      "Take prescribed medications as directed",
      "Seek immediate medical attention for chest pain or shortness of breath"
    ],
    important: [
      "Reduce sodium intake to less than 2,300mg daily",
      "Exercise for at least 30 minutes, 5 days a week",
      "Maintain a heart-healthy diet rich in fruits and vegetables",
      "Limit alcohol consumption and avoid smoking"
    ],
    betterResults: [
      "Practice stress management techniques like meditation",
      "Get 7-9 hours of quality sleep each night",
      "Stay socially connected and maintain relationships",
      "Consider cardiac rehabilitation programs if recommended"
    ]
  };

  return (
    <section className="py-16 md:py-24" data-testid="precautions-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-[#0F172A] mb-4" data-testid="precautions-title">
            Health Precautions & Recommendations
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Follow these guidelines to improve and maintain your cardiovascular health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Must Do */}
          <Card className="shadow-lg border-0 precaution-must-do card-hover" data-testid="must-do-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#EF4444]">
                <ShieldCheck className="h-5 w-5" />
                Must Do
              </CardTitle>
              <CardDescription>Critical health precautions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {precautions.mustDo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-[#EF4444] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Important */}
          <Card className="shadow-lg border-0 precaution-important card-hover" data-testid="important-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#EAB308]">
                <AlertTriangle className="h-5 w-5" />
                Important
              </CardTitle>
              <CardDescription>Recommended lifestyle changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {precautions.important.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <Lightbulb className="h-4 w-4 text-[#EAB308] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* For Better Results */}
          <Card className="shadow-lg border-0 precaution-better card-hover" data-testid="better-results-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#22C55E]">
                <Star className="h-5 w-5" />
                For Better Results
              </CardTitle>
              <CardDescription>Additional health tips</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {precautions.betterResults.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <Star className="h-4 w-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

// AI Health Assistant (Chatbot) Section
const AIAssistantSection = ({ healthData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Health Assistant. I can answer questions about your cardiovascular health, explain risk factors, and provide personalized recommendations. How can I help you today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (placeholder for actual API integration)
    setTimeout(() => {
      const aiResponse = generatePlaceholderResponse(inputMessage, healthData);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const generatePlaceholderResponse = (question, data) => {
    // Placeholder responses - will be replaced with actual AI API
    const responses = [
      `Based on your health profile, maintaining a balanced diet and regular exercise routine is crucial. Your current metrics suggest ${data.age ? 'monitoring is important at your age' : 'we need more data for personalized advice'}.`,
      "Regular cardiovascular exercise, such as brisk walking or swimming, can significantly improve heart health. I recommend starting with 20-30 minutes, 3-4 times per week.",
      "Your question is important. While I provide general guidance, please consult with your healthcare provider for personalized medical advice tailored to your specific condition.",
      "Heart health is influenced by many factors including diet, exercise, stress levels, and genetics. Let me help you understand how each of these affects your cardiovascular system."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section id="assistant" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50" data-testid="ai-assistant-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-[#0F172A] mb-4" data-testid="assistant-title">
            AI Health Assistant
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Get instant answers to your cardiovascular health questions from our AI-powered assistant.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto shadow-xl border-0 overflow-hidden" data-testid="chatbot-card">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">CardioVision Assistant</h3>
              <p className="text-white/70 text-sm">Powered by AI</p>
            </div>
            <Badge className="ml-auto bg-white/20 text-white hover:bg-white/30">Online</Badge>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="h-80 md:h-96 p-4 chat-container" data-testid="chat-messages">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`chat-message-${index}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 ${
                      message.role === 'user' ? 'chat-message-user' : 'chat-message-ai'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start" data-testid="typing-indicator">
                  <div className="chat-message-ai px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="chat-input-container flex items-center gap-2 p-2 rounded-xl">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your heart health..."
                className="flex-1 border-0 shadow-none focus-visible:ring-0"
                data-testid="chat-input"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-lg"
                data-testid="send-message-btn"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              AI responses are for informational purposes only. Consult a healthcare professional for medical advice.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="py-12 border-t border-slate-200 footer-gradient" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-[#EF4444] animate-heartbeat" />
            <div>
              <h3 className="font-semibold text-[#0F172A]">CardioVision AI</h3>
              <p className="text-sm text-slate-500">AI + AR Healthcare Monitoring System</p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#" className="text-slate-600 hover:text-[#0D9488] transition-colors" data-testid="footer-privacy">Privacy Policy</a>
            <a href="#" className="text-slate-600 hover:text-[#0D9488] transition-colors" data-testid="footer-terms">Terms of Service</a>
            <a href="#" className="text-slate-600 hover:text-[#0D9488] transition-colors" data-testid="footer-contact">Contact</a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-slate-500" data-testid="footer-copyright">
            © 2026 CardioVision AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  const [formData, setFormData] = useState({
    age: '',
    bloodPressure: '',
    cholesterol: '',
    heartRate: '',
    bmi: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    riskLevel: 'low',
    probability: 0,
    description: '',
    healthStatus: ''
  });

  const handlePredictRisk = () => {
    // Placeholder prediction logic - will be replaced with actual API call
    const age = parseInt(formData.age) || 35;
    const bp = parseInt(formData.bloodPressure) || 120;
    const cholesterol = parseInt(formData.cholesterol) || 180;
    const heartRate = parseInt(formData.heartRate) || 72;
    const bmi = parseFloat(formData.bmi) || 24;

    // Simple risk calculation placeholder - base score of 15
    let riskScore = 15;
    if (age > 45) riskScore += 20;
    if (age > 60) riskScore += 15;
    if (bp > 140) riskScore += 25;
    if (bp > 120 && bp <= 140) riskScore += 10;
    if (cholesterol > 240) riskScore += 20;
    if (cholesterol > 200 && cholesterol <= 240) riskScore += 10;
    if (heartRate > 100 || heartRate < 50) riskScore += 15;
    if (bmi > 30) riskScore += 15;
    if (bmi > 25 && bmi <= 30) riskScore += 8;

    let riskLevel = 'low';
    let description = '';
    let healthStatus = '';

    if (riskScore < 30) {
      riskLevel = 'low';
      description = 'Your cardiovascular risk is within the healthy range.';
      healthStatus = 'Your heart health indicators are generally positive. Continue maintaining a healthy lifestyle with regular exercise and balanced nutrition.';
    } else if (riskScore < 60) {
      riskLevel = 'moderate';
      description = 'Some risk factors detected. Consider lifestyle modifications.';
      healthStatus = 'Your assessment shows moderate cardiovascular risk. We recommend consulting with your healthcare provider and implementing the suggested precautions.';
    } else {
      riskLevel = 'high';
      description = 'Elevated risk detected. Medical consultation recommended.';
      healthStatus = 'Your risk assessment indicates elevated cardiovascular concerns. Please schedule an appointment with a cardiologist for comprehensive evaluation and personalized treatment plan.';
    }

    setResults({
      riskLevel,
      probability: Math.min(riskScore, 95),
      description,
      healthStatus
    });
    setShowResults(true);

    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="app-container">
      <Header />
      <main>
        <HeroSection />
        <HealthInputForm 
          formData={formData} 
          setFormData={setFormData} 
          onSubmit={handlePredictRisk} 
        />
        <ImageUploadSection 
          imagePreview={imagePreview} 
          setImagePreview={setImagePreview} 
        />
        <ARVisualizationSection />
        <PredictionResultsSection 
          results={results} 
          showResults={showResults} 
        />
        <PrecautionsSection showResults={showResults} />
        <AIAssistantSection healthData={formData} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
