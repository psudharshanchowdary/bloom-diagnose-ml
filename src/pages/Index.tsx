import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { DiseasesDialog } from "@/components/DiseasesDialog";
import { Button } from "@/components/ui/button";
import { Leaf, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const scrollToAnalysis = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
    toast.success("Image uploaded successfully!");
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    scrollToAnalysis();

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Prediction failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const result = {
          disease: `${data.disease} (${data.plant})`,
          confidence: Math.round(data.confidence * 100),
          severity: data.confidence > 0.8 ? "high" as const : data.confidence > 0.5 ? "medium" as const : "low" as const,
          description: `${data.causes} ${data.symptoms}`,
          treatment: data.treatment.split('.').filter((s: string) => s.trim()).map((s: string) => s.trim()),
          prevention: data.prevention.split('.').filter((s: string) => s.trim()).map((s: string) => s.trim())
        };
        setAnalysisResult(result);
        toast.success("Analysis complete!");
      } else {
        throw new Error(data.error || 'Prediction failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('ML backend not connected. See ml_backend/README.md for setup.');
      
      // Fallback to mock data
      const mockResult = {
        disease: "ML Backend Not Running",
        confidence: 0,
        severity: "low" as const,
        description: "The Python ML backend is not running. To use the trained model: 1) cd ml_backend 2) pip install -r requirements.txt 3) python train_model.py (train first) 4) python app.py (start API)",
        treatment: [
          "Install dependencies: pip install -r ml_backend/requirements.txt",
          "Train the model: python ml_backend/train_model.py",
          "Start the API server: python ml_backend/app.py",
          "Make sure the server runs on http://localhost:5000"
        ],
        prevention: [
          "Download PlantVillage dataset for training",
          "See ml_backend/README.md for detailed setup instructions",
          "Ensure Python 3.8+ is installed on your system"
        ]
      };
      setAnalysisResult(mockResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PlantHealth AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#home" className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </a>
            <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#diseases" className="text-foreground/80 hover:text-foreground transition-colors">
              Diseases
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <Hero onGetStarted={scrollToAnalysis} />

      {/* Analysis Section */}
      <section ref={analysisRef} className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                AI Disease Detection
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload a clear image of the affected plant leaves for accurate disease identification
              </p>
            </div>

            {/* Upload Component */}
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClear={handleClearImage}
            />

            {/* Analyze Button */}
            {selectedImage && (
              <div className="flex justify-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="min-w-[200px]"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Analyze Plant
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Results */}
            {(isAnalyzing || analysisResult) && (
              <AnalysisResults result={analysisResult} isLoading={isAnalyzing} />
            )}
          </div>
        </div>
      </section>

      {/* Diseases Section */}
      <section id="diseases" className="py-16 bg-background">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Supported Plant Diseases</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI model can detect and diagnose various diseases affecting Apple, Tomato, and Potato crops. 
                Learn more about each disease, its symptoms, treatment options, and prevention strategies.
              </p>
            </div>
            <div className="flex justify-center pt-4">
              <DiseasesDialog />
            </div>
          </div>
        </div>
      </section>

      {/* About & Contact Section */}
      <section id="about" className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* About Project */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">About PlantHealth AI</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                PlantHealth AI is an advanced machine learning-powered platform designed to detect and diagnose plant diseases with high accuracy. 
                Using deep learning algorithms trained on thousands of plant images, our system identifies diseases in Apple, Tomato, and Potato crops, 
                providing farmers and gardeners with instant diagnosis, treatment recommendations, and prevention strategies. 
                Our mission is to help protect crops and improve agricultural productivity through accessible AI technology.
              </p>
            </div>

            {/* Team */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-center">Our Team</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="font-medium">P. Sudharshan</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="font-medium">P. Saikumar</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="font-medium">K. Arundhathi</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="font-medium">S. Gunashekhar</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-center">Contact Us</h3>
              <div className="bg-muted/30 rounded-lg p-6 space-y-3">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+919087321929" className="hover:text-foreground transition-colors">
                    +91 9087321929
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:srm@gmail.com" className="hover:text-foreground transition-colors">
                    srm@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-semibold">PlantHealth AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Protecting crops with AI-powered disease detection. Early identification saves harvests.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 PlantHealth AI. Built with machine learning and care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
