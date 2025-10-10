import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info, Pill } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  treatment: string[];
  prevention: string[];
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  isLoading?: boolean;
}

export const AnalysisResults = ({ result, isLoading }: AnalysisResultsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-5 w-5" />;
      case "medium":
        return <AlertCircle className="h-5 w-5" />;
      case "high":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card shadow-soft">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-4/5" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-soft space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{result.disease}</h3>
            <p className="text-muted-foreground">{result.description}</p>
          </div>
          <Badge 
            variant={getSeverityColor(result.severity) as any}
            className="flex items-center gap-1 px-3 py-1"
          >
            {getSeverityIcon(result.severity)}
            <span className="capitalize">{result.severity} Risk</span>
          </Badge>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Confidence Score</span>
            <span className="text-muted-foreground">{result.confidence}%</span>
          </div>
          <Progress value={result.confidence} className="h-2" />
        </div>
      </div>

      {/* Treatment Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-lg">Treatment Recommendations</h4>
        </div>
        <ul className="space-y-2">
          {result.treatment.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Prevention Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          <h4 className="font-semibold text-lg">Prevention Tips</h4>
        </div>
        <ul className="space-y-2">
          {result.prevention.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground italic">
          Note: This is an AI-powered analysis. For critical cases or confirmation, 
          please consult with an agricultural expert or plant pathologist.
        </p>
      </div>
    </Card>
  );
};
