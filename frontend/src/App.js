import { useState, useRef, useEffect } from "react";
import "@/App.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import axios from "axios";

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
  Footprints,
  Moon,
  GlassWater,
  Flame,
  Cigarette,
  Wine,
  HeartPulse,
  Stethoscope,
  Users,
  Loader2
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
              <h1 className="text-lg md:text-xl font-bold text-[#0F172A] tracking-tight">WithLove</h1>
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
          </div>
        </div>
      </div>
    </section>
  );
};

// Health Data Input Form with ALL parameters
const HealthInputForm = ({ formData, setFormData, onSubmit, isLoading }) => {
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

        <Card className="max-w-5xl mx-auto shadow-lg border-0 card-hover" data-testid="health-form-card">
          <CardContent className="p-6 md:p-8">
            <form id="health-data-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }} data-testid="health-form">
              <Tabs defaultValue="clinical" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="clinical" className="text-sm">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Clinical Parameters
                  </TabsTrigger>
                  <TabsTrigger value="lifestyle" className="text-sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Lifestyle & Vitals
                  </TabsTrigger>
                </TabsList>

                {/* Clinical Parameters Tab */}
                <TabsContent value="clinical" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Age */}
                    <div className="space-y-2">
                      <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4 text-[#0D9488]" />
                        Age (years)
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="e.g., 55"
                        min="0"
                        max="120"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-age"
                        required
                      />
                    </div>

                    {/* Sex */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4 text-[#0D9488]" />
                        Sex
                      </Label>
                      <Select value={formData.sex} onValueChange={(v) => handleInputChange('sex', v)}>
                        <SelectTrigger data-testid="input-sex">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Female</SelectItem>
                          <SelectItem value="1">Male</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Chest Pain Type */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <HeartPulse className="h-4 w-4 text-[#0D9488]" />
                        Chest Pain Type
                      </Label>
                      <Select value={formData.cp} onValueChange={(v) => handleInputChange('cp', v)}>
                        <SelectTrigger data-testid="input-cp">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Typical Angina</SelectItem>
                          <SelectItem value="1">Atypical Angina</SelectItem>
                          <SelectItem value="2">Non-anginal Pain</SelectItem>
                          <SelectItem value="3">Asymptomatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Resting Blood Pressure */}
                    <div className="space-y-2">
                      <Label htmlFor="trestbps" className="flex items-center gap-2 text-sm font-medium">
                        <Gauge className="h-4 w-4 text-[#0D9488]" />
                        Resting BP (mmHg)
                      </Label>
                      <Input
                        id="trestbps"
                        type="number"
                        placeholder="e.g., 120"
                        min="50"
                        max="300"
                        value={formData.trestbps}
                        onChange={(e) => handleInputChange('trestbps', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-trestbps"
                        required
                      />
                    </div>

                    {/* Serum Cholesterol */}
                    <div className="space-y-2">
                      <Label htmlFor="chol" className="flex items-center gap-2 text-sm font-medium">
                        <Droplets className="h-4 w-4 text-[#0D9488]" />
                        Serum Cholesterol (mg/dl)
                      </Label>
                      <Input
                        id="chol"
                        type="number"
                        placeholder="e.g., 200"
                        min="100"
                        max="600"
                        value={formData.chol}
                        onChange={(e) => handleInputChange('chol', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-chol"
                        required
                      />
                    </div>

                    {/* Fasting Blood Sugar */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Droplets className="h-4 w-4 text-[#0D9488]" />
                        Fasting Blood Sugar {'>'}120 mg/dl
                      </Label>
                      <Select value={formData.fbs} onValueChange={(v) => handleInputChange('fbs', v)}>
                        <SelectTrigger data-testid="input-fbs">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No</SelectItem>
                          <SelectItem value="1">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Resting ECG */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4 text-[#0D9488]" />
                        Resting ECG Results
                      </Label>
                      <Select value={formData.restecg} onValueChange={(v) => handleInputChange('restecg', v)}>
                        <SelectTrigger data-testid="input-restecg">
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Normal</SelectItem>
                          <SelectItem value="1">ST-T abnormality</SelectItem>
                          <SelectItem value="2">LV hypertrophy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Maximum Heart Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="thalach" className="flex items-center gap-2 text-sm font-medium">
                        <HeartPulse className="h-4 w-4 text-[#0D9488]" />
                        Max Heart Rate (BPM)
                      </Label>
                      <Input
                        id="thalach"
                        type="number"
                        placeholder="e.g., 150"
                        min="50"
                        max="250"
                        value={formData.thalach}
                        onChange={(e) => handleInputChange('thalach', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-thalach"
                        required
                      />
                    </div>

                    {/* Exercise Induced Angina */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4 text-[#0D9488]" />
                        Exercise Induced Angina
                      </Label>
                      <Select value={formData.exang} onValueChange={(v) => handleInputChange('exang', v)}>
                        <SelectTrigger data-testid="input-exang">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No</SelectItem>
                          <SelectItem value="1">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Oldpeak */}
                    <div className="space-y-2">
                      <Label htmlFor="oldpeak" className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4 text-[#0D9488]" />
                        ST Depression (oldpeak)
                      </Label>
                      <Input
                        id="oldpeak"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 1.5"
                        min="0"
                        max="10"
                        value={formData.oldpeak}
                        onChange={(e) => handleInputChange('oldpeak', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-oldpeak"
                        required
                      />
                    </div>

                    {/* Slope */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4 text-[#0D9488]" />
                        ST Segment Slope
                      </Label>
                      <Select value={formData.slope} onValueChange={(v) => handleInputChange('slope', v)}>
                        <SelectTrigger data-testid="input-slope">
                          <SelectValue placeholder="Select slope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Upsloping</SelectItem>
                          <SelectItem value="1">Flat</SelectItem>
                          <SelectItem value="2">Downsloping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Number of Major Vessels */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Heart className="h-4 w-4 text-[#0D9488]" />
                        Major Vessels (0-4)
                      </Label>
                      <Select value={formData.ca} onValueChange={(v) => handleInputChange('ca', v)}>
                        <SelectTrigger data-testid="input-ca">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Thalassemia */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Droplets className="h-4 w-4 text-[#0D9488]" />
                        Thalassemia
                      </Label>
                      <Select value={formData.thal} onValueChange={(v) => handleInputChange('thal', v)}>
                        <SelectTrigger data-testid="input-thal">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Normal</SelectItem>
                          <SelectItem value="1">Fixed Defect</SelectItem>
                          <SelectItem value="2">Reversible Defect</SelectItem>
                          <SelectItem value="3">Not Described</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Lifestyle & Vitals Tab */}
                <TabsContent value="lifestyle" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Gender */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4 text-[#0D9488]" />
                        Gender
                      </Label>
                      <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                        <SelectTrigger data-testid="input-gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Female</SelectItem>
                          <SelectItem value="1">Male</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* BMI */}
                    <div className="space-y-2">
                      <Label htmlFor="bmi" className="flex items-center gap-2 text-sm font-medium">
                        <Scale className="h-4 w-4 text-[#0D9488]" />
                        BMI
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
                        className="input-focus-teal"
                        data-testid="input-bmi"
                        required
                      />
                    </div>

                    {/* Daily Steps */}
                    <div className="space-y-2">
                      <Label htmlFor="daily_steps" className="flex items-center gap-2 text-sm font-medium">
                        <Footprints className="h-4 w-4 text-[#0D9488]" />
                        Daily Steps
                      </Label>
                      <Input
                        id="daily_steps"
                        type="number"
                        placeholder="e.g., 8000"
                        min="0"
                        max="50000"
                        value={formData.daily_steps}
                        onChange={(e) => handleInputChange('daily_steps', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-daily-steps"
                        required
                      />
                    </div>

                    {/* Sleep Hours */}
                    <div className="space-y-2">
                      <Label htmlFor="sleep_hours" className="flex items-center gap-2 text-sm font-medium">
                        <Moon className="h-4 w-4 text-[#0D9488]" />
                        Sleep Hours
                      </Label>
                      <Input
                        id="sleep_hours"
                        type="number"
                        step="0.5"
                        placeholder="e.g., 7"
                        min="0"
                        max="24"
                        value={formData.sleep_hours}
                        onChange={(e) => handleInputChange('sleep_hours', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-sleep-hours"
                        required
                      />
                    </div>

                    {/* Water Intake */}
                    <div className="space-y-2">
                      <Label htmlFor="water_intake_l" className="flex items-center gap-2 text-sm font-medium">
                        <GlassWater className="h-4 w-4 text-[#0D9488]" />
                        Water Intake (L/day)
                      </Label>
                      <Input
                        id="water_intake_l"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 2.5"
                        min="0"
                        max="10"
                        value={formData.water_intake_l}
                        onChange={(e) => handleInputChange('water_intake_l', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-water-intake"
                        required
                      />
                    </div>

                    {/* Calories Consumed */}
                    <div className="space-y-2">
                      <Label htmlFor="calories_consumed" className="flex items-center gap-2 text-sm font-medium">
                        <Flame className="h-4 w-4 text-[#0D9488]" />
                        Calories/Day
                      </Label>
                      <Input
                        id="calories_consumed"
                        type="number"
                        placeholder="e.g., 2000"
                        min="500"
                        max="10000"
                        value={formData.calories_consumed}
                        onChange={(e) => handleInputChange('calories_consumed', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-calories"
                        required
                      />
                    </div>

                    {/* Smoker */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Cigarette className="h-4 w-4 text-[#0D9488]" />
                        Smoker
                      </Label>
                      <Select value={formData.smoker} onValueChange={(v) => handleInputChange('smoker', v)}>
                        <SelectTrigger data-testid="input-smoker">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No</SelectItem>
                          <SelectItem value="1">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Alcohol */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Wine className="h-4 w-4 text-[#0D9488]" />
                        Alcohol Consumption
                      </Label>
                      <Select value={formData.alcohol} onValueChange={(v) => handleInputChange('alcohol', v)}>
                        <SelectTrigger data-testid="input-alcohol">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No</SelectItem>
                          <SelectItem value="1">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Resting Heart Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="resting_hr" className="flex items-center gap-2 text-sm font-medium">
                        <HeartPulse className="h-4 w-4 text-[#0D9488]" />
                        Resting Heart Rate
                      </Label>
                      <Input
                        id="resting_hr"
                        type="number"
                        placeholder="e.g., 72"
                        min="40"
                        max="200"
                        value={formData.resting_hr}
                        onChange={(e) => handleInputChange('resting_hr', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-resting-hr"
                        required
                      />
                    </div>

                    {/* Systolic BP */}
                    <div className="space-y-2">
                      <Label htmlFor="systolic_bp" className="flex items-center gap-2 text-sm font-medium">
                        <Gauge className="h-4 w-4 text-[#0D9488]" />
                        Systolic BP (mmHg)
                      </Label>
                      <Input
                        id="systolic_bp"
                        type="number"
                        placeholder="e.g., 120"
                        min="70"
                        max="250"
                        value={formData.systolic_bp}
                        onChange={(e) => handleInputChange('systolic_bp', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-systolic-bp"
                        required
                      />
                    </div>

                    {/* Diastolic BP */}
                    <div className="space-y-2">
                      <Label htmlFor="diastolic_bp" className="flex items-center gap-2 text-sm font-medium">
                        <Gauge className="h-4 w-4 text-[#0D9488]" />
                        Diastolic BP (mmHg)
                      </Label>
                      <Input
                        id="diastolic_bp"
                        type="number"
                        placeholder="e.g., 80"
                        min="40"
                        max="150"
                        value={formData.diastolic_bp}
                        onChange={(e) => handleInputChange('diastolic_bp', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-diastolic-bp"
                        required
                      />
                    </div>

                    {/* Cholesterol Level */}
                    <div className="space-y-2">
                      <Label htmlFor="cholesterol_level" className="flex items-center gap-2 text-sm font-medium">
                        <Droplets className="h-4 w-4 text-[#0D9488]" />
                        Cholesterol Level (mg/dl)
                      </Label>
                      <Input
                        id="cholesterol_level"
                        type="number"
                        placeholder="e.g., 200"
                        min="100"
                        max="600"
                        value={formData.cholesterol_level}
                        onChange={(e) => handleInputChange('cholesterol_level', e.target.value)}
                        className="input-focus-teal"
                        data-testid="input-cholesterol-level"
                        required
                      />
                    </div>

                    {/* Family History */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Users className="h-4 w-4 text-[#0D9488]" />
                        Family History
                      </Label>
                      <Select value={formData.family_history} onValueChange={(v) => handleInputChange('family_history', v)}>
                        <SelectTrigger data-testid="input-family-history">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No</SelectItem>
                          <SelectItem value="1">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex justify-center">
                <Button 
                  type="submit"
                  size="lg"
                  className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-12"
                  data-testid="predict-risk-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2 animate-heartbeat" />
                      Predict Risk
                    </>
                  )}
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

// AR Heart Visualization Section with CSS-based Heart Animation
const ARVisualizationSection = ({ riskPercentage = 25 }) => {
  const getHeartStyles = () => {
    if (riskPercentage <= 40) {
      return {
        color: '#22C55E',
        glowColor: 'rgba(34, 197, 94, 0.4)',
        animationDuration: '1.5s',
        statusText: 'Healthy Heart',
        statusColor: 'text-green-500'
      };
    } else if (riskPercentage <= 70) {
      return {
        color: '#EAB308',
        glowColor: 'rgba(234, 179, 8, 0.4)',
        animationDuration: '1s',
        statusText: 'Moderate Risk',
        statusColor: 'text-yellow-500'
      };
    } else {
      return {
        color: '#EF4444',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        animationDuration: '0.6s',
        statusText: 'High Risk',
        statusColor: 'text-red-500'
      };
    }
  };

  const styles = getHeartStyles();

  return (
    <section id="visualization" className="py-16 md:py-24" data-testid="ar-visualization-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-[#0F172A] mb-4" data-testid="ar-title">
            AR Heart Visualization
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Interactive heart model with real-time risk indicators. The heart color and beat speed change based on your risk level.
          </p>
        </div>

        <div 
          className="aspect-video max-w-5xl mx-auto rounded-3xl shadow-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)' }}
          data-testid="ar-container"
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${180 + i * 40}px`,
                    height: `${180 + i * 40}px`,
                    left: `${-(90 + i * 20)}px`,
                    top: `${-(90 + i * 20)}px`,
                    border: `2px solid ${styles.color}`,
                    opacity: 0.3 - i * 0.08,
                    animation: `pulse-ring ${styles.animationDuration} ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
              
              <div 
                className="relative"
                style={{
                  filter: `drop-shadow(0 0 30px ${styles.glowColor}) drop-shadow(0 0 60px ${styles.glowColor})`
                }}
              >
                <svg
                  className="w-32 h-32 md:w-40 md:h-40"
                  viewBox="0 0 24 24"
                  fill={styles.color}
                  style={{
                    animation: `heartbeat ${styles.animationDuration} ease-in-out infinite`
                  }}
                  data-testid="animated-heart-svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            
            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
              <svg className="w-full max-w-md h-16 opacity-60" viewBox="0 0 400 50">
                <path
                  d="M0,25 L80,25 L100,25 L110,10 L120,40 L130,25 L150,25 L200,25 L220,25 L230,5 L240,45 L250,25 L270,25 L320,25 L340,25 L350,10 L360,40 L370,25 L400,25"
                  fill="none"
                  stroke={styles.color}
                  strokeWidth="2"
                  className="ecg-line"
                />
              </svg>
            </div>
          </div>
          
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-white/70 text-sm">Heart Risk Level</p>
            <p className={`text-xl font-bold ${styles.statusColor}`} data-testid="ar-status-text">{styles.statusText}</p>
            <p className="text-white/60 text-sm">{riskPercentage.toFixed(1)}% probability</p>
          </div>
          
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-white/70">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>0-40%: Low Risk</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>41-70%: Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>71-100%: High Risk</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-white/70">
            <p>AR visualization placeholder</p>
            <p className="text-white/50">Unity WebGL ready</p>
          </div>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-slate-600">
            <span className="font-medium">How it works:</span> Heart color changes from 
            <span className="text-green-500 font-medium"> green </span>(healthy) to 
            <span className="text-yellow-500 font-medium"> yellow </span>(moderate) to 
            <span className="text-red-500 font-medium"> red </span>(high risk)
          </p>
          <p className="text-xs text-slate-500">
            Heartbeat speed increases with risk level • Ready for Unity WebGL integration
          </p>
        </div>
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

            {/* Recommendations Card */}
            {results.recommendations && results.recommendations.length > 0 && (
              <Card className="md:col-span-3 shadow-lg border-0" data-testid="recommendations-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-[#0D9488]" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-[#0D9488] mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
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
const PrecautionsSection = () => {
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

// AI Health Assistant (Chatbot) Section with ChatGPT Integration
const AIAssistantSection = ({ healthData, results }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Health Assistant powered by GPT-4. I can answer questions about your cardiovascular health, explain risk factors, and provide personalized recommendations based on your health data. How can I help you today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build health context for the AI
      const healthContext = {
        risk_level: results?.riskLevel || 'unknown',
        probability: results?.probability || 0,
        age: healthData?.age || null,
        bmi: healthData?.bmi || null,
        systolic_bp: healthData?.systolic_bp || null,
        diastolic_bp: healthData?.diastolic_bp || null,
        cholesterol: healthData?.cholesterol_level || null,
        smoker: parseInt(healthData?.smoker) || 0,
        family_history: parseInt(healthData?.family_history) || 0
      };

      const response = await axios.post(`${API}/chat`, {
        message: inputMessage,
        session_id: sessionId,
        health_context: healthContext
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback response if API fails
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble connecting to the AI service. Please try again in a moment. In the meantime, remember to consult with your healthcare provider for personalized medical advice." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick action suggestions
  const quickActions = [
    "What does my risk level mean?",
    "How can I lower my heart disease risk?",
    "What lifestyle changes should I make?",
    "Explain my results"
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
  };

  return (
    <section id="assistant" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50" data-testid="ai-assistant-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#CCFBF1] text-[#0D9488] hover:bg-[#CCFBF1]">
            <Bot className="h-3 w-3 mr-1" />
            Powered by GPT-4
          </Badge>
          <h2 className="section-title text-2xl md:text-3xl font-bold text-[#0F172A] mb-4" data-testid="assistant-title">
            AI Health Assistant
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Get instant, personalized answers to your cardiovascular health questions from our AI-powered assistant.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto shadow-xl border-0 overflow-hidden" data-testid="chatbot-card">
          <div className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">WithLove Assistant</h3>
              <p className="text-white/70 text-sm">Powered by ChatGPT</p>
            </div>
            <Badge className="ml-auto bg-white/20 text-white hover:bg-white/30">
              <span className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Online
            </Badge>
          </div>

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
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-[#0D9488] hover:text-[#0D9488] transition-colors"
                    data-testid={`quick-action-${index}`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="chat-input-container flex items-center gap-2 p-2 rounded-xl">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your heart health..."
                className="flex-1 border-0 shadow-none focus-visible:ring-0"
                data-testid="chat-input"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-lg"
                data-testid="send-message-btn"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
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
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-[#EF4444] animate-heartbeat" />
            <div>
              <h3 className="font-semibold text-[#0F172A]">WithLove</h3>
              <p className="text-sm text-slate-500">AI + AR Healthcare Monitoring System</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#" className="text-slate-600 hover:text-[#0D9488] transition-colors" data-testid="footer-privacy">Privacy Policy</a>
            <a href="#" className="text-slate-600 hover:text-[#0D9488] transition-colors" data-testid="footer-terms">Terms of Service</a>
            <a href="#" className="text-slate-600 hover:text-[#0D9488] transition-colors" data-testid="footer-contact">Contact</a>
          </nav>

          <p className="text-sm text-slate-500" data-testid="footer-copyright">
            © 2026 WithLove. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  const [formData, setFormData] = useState({
    // Clinical parameters
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
    // Lifestyle parameters
    gender: '',
    bmi: '',
    daily_steps: '',
    sleep_hours: '',
    water_intake_l: '',
    calories_consumed: '',
    smoker: '',
    alcohol: '',
    resting_hr: '',
    systolic_bp: '',
    diastolic_bp: '',
    cholesterol_level: '',
    family_history: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    riskLevel: 'low',
    probability: 0,
    description: '',
    healthStatus: '',
    recommendations: []
  });

  const handlePredictRisk = async () => {
    setIsLoading(true);
    
    try {
      const payload = {
        age: parseFloat(formData.age) || 55,
        sex: parseInt(formData.sex) || 1,
        cp: parseInt(formData.cp) || 0,
        trestbps: parseFloat(formData.trestbps) || 120,
        chol: parseFloat(formData.chol) || 200,
        fbs: parseInt(formData.fbs) || 0,
        restecg: parseInt(formData.restecg) || 0,
        thalach: parseFloat(formData.thalach) || 150,
        exang: parseInt(formData.exang) || 0,
        oldpeak: parseFloat(formData.oldpeak) || 1.0,
        slope: parseInt(formData.slope) || 1,
        ca: parseInt(formData.ca) || 0,
        thal: parseInt(formData.thal) || 2,
        gender: parseInt(formData.gender) || parseInt(formData.sex) || 1,
        bmi: parseFloat(formData.bmi) || 24.5,
        daily_steps: parseInt(formData.daily_steps) || 5000,
        sleep_hours: parseFloat(formData.sleep_hours) || 7,
        water_intake_l: parseFloat(formData.water_intake_l) || 2.0,
        calories_consumed: parseInt(formData.calories_consumed) || 2000,
        smoker: parseInt(formData.smoker) || 0,
        alcohol: parseInt(formData.alcohol) || 0,
        resting_hr: parseInt(formData.resting_hr) || 72,
        systolic_bp: parseInt(formData.systolic_bp) || parseInt(formData.trestbps) || 120,
        diastolic_bp: parseInt(formData.diastolic_bp) || 80,
        cholesterol_level: parseFloat(formData.cholesterol_level) || parseFloat(formData.chol) || 200,
        family_history: parseInt(formData.family_history) || 0,
        disease_risk: 0
      };

      const response = await axios.post(`${API}/predict`, payload);
      const data = response.data;

      let description = '';
      if (data.risk_level === 'low') {
        description = 'Your cardiovascular risk is within the healthy range.';
      } else if (data.risk_level === 'moderate') {
        description = 'Some risk factors detected. Consider lifestyle modifications.';
      } else {
        description = 'Elevated risk detected. Medical consultation recommended.';
      }

      setResults({
        riskLevel: data.risk_level,
        probability: data.probability,
        description: description,
        healthStatus: data.health_status,
        recommendations: data.recommendations || []
      });
      setShowResults(true);

      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Prediction error:', error);
      // Fallback to local calculation if API fails
      const age = parseInt(formData.age) || 35;
      const bp = parseInt(formData.trestbps) || 120;
      const cholesterol = parseInt(formData.chol) || 180;
      const bmi = parseFloat(formData.bmi) || 24;
      const smoker = parseInt(formData.smoker) || 0;

      let riskScore = 15;
      if (age > 45) riskScore += 20;
      if (age > 60) riskScore += 15;
      if (bp > 140) riskScore += 25;
      if (bp > 120 && bp <= 140) riskScore += 10;
      if (cholesterol > 240) riskScore += 20;
      if (cholesterol > 200 && cholesterol <= 240) riskScore += 10;
      if (bmi > 30) riskScore += 15;
      if (bmi > 25 && bmi <= 30) riskScore += 8;
      if (smoker === 1) riskScore += 20;

      let riskLevel = 'low';
      let description = '';
      let healthStatus = '';

      if (riskScore < 30) {
        riskLevel = 'low';
        description = 'Your cardiovascular risk is within the healthy range.';
        healthStatus = 'Your heart health indicators are generally positive. Continue maintaining a healthy lifestyle.';
      } else if (riskScore < 60) {
        riskLevel = 'moderate';
        description = 'Some risk factors detected. Consider lifestyle modifications.';
        healthStatus = 'Your assessment shows moderate cardiovascular risk. We recommend consulting with your healthcare provider.';
      } else {
        riskLevel = 'high';
        description = 'Elevated risk detected. Medical consultation recommended.';
        healthStatus = 'Your risk assessment indicates elevated cardiovascular concerns. Please schedule an appointment with a cardiologist.';
      }

      setResults({
        riskLevel,
        probability: Math.min(riskScore, 95),
        description,
        healthStatus,
        recommendations: []
      });
      setShowResults(true);

      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } finally {
      setIsLoading(false);
    }
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
          isLoading={isLoading}
        />
        <ImageUploadSection 
          imagePreview={imagePreview} 
          setImagePreview={setImagePreview} 
        />
        <ARVisualizationSection riskPercentage={showResults ? results.probability : 25} />
        <PredictionResultsSection 
          results={results} 
          showResults={showResults} 
        />
        <PrecautionsSection />
        <AIAssistantSection healthData={formData} results={results} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
