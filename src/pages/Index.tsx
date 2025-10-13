import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
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

    // Simulate API call - In production, this would call your ML backend
    setTimeout(() => {
      // Mock result - replace with actual API call
      const mockResult = {
        disease: "Early Blight (Alternaria solani)",
        confidence: 87,
        severity: "medium" as const,
        description: "Early blight is a common fungal disease affecting tomatoes and potatoes. It typically appears as dark brown spots with concentric rings on older leaves.",
        treatment: [
          "Remove and destroy infected leaves immediately",
          "Apply copper-based fungicide every 7-10 days",
          "Improve air circulation around plants",
          "Water at the base of plants to keep foliage dry",
          "Consider organic options like neem oil or baking soda spray"
        ],
        prevention: [
          "Practice crop rotation (3-4 year cycle)",
          "Space plants properly for good air circulation",
          "Apply mulch to prevent soil splash onto leaves",
          "Water in the morning so leaves dry during the day",
          "Use disease-resistant varieties when available",
          "Remove plant debris at the end of the season"
        ]
      };

      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 2500);
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
