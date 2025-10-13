import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

const diseasesData = [
  {
    name: "Apple Scab",
    plant: "Apple",
    severity: "high",
    description: "A fungal disease that causes dark, scabby lesions on leaves and fruit.",
    symptoms: "Dark olive-green to black spots on leaves, fruit distortion, premature leaf drop.",
    treatment: [
      "Remove and destroy infected leaves and fruit",
      "Apply fungicides during wet periods",
      "Prune trees to improve air circulation",
      "Use resistant apple varieties"
    ],
    prevention: [
      "Plant resistant varieties",
      "Maintain good orchard sanitation",
      "Apply preventive fungicide sprays",
      "Ensure proper spacing between trees"
    ]
  },
  {
    name: "Black Rot",
    plant: "Apple",
    severity: "high",
    description: "A fungal disease causing fruit rot and leaf spots.",
    symptoms: "Purple spots on leaves, black rotted fruit, cankers on branches.",
    treatment: [
      "Remove mummified fruit and infected branches",
      "Apply copper-based fungicides",
      "Improve tree vigor through proper fertilization"
    ],
    prevention: [
      "Prune out dead wood and cankers",
      "Remove fallen leaves and fruit",
      "Apply preventive sprays before bloom"
    ]
  },
  {
    name: "Cedar Apple Rust",
    plant: "Apple",
    severity: "medium",
    description: "A fungal disease requiring both apple and cedar trees to complete its lifecycle.",
    symptoms: "Yellow-orange spots on leaves, fruit lesions, defoliation.",
    treatment: [
      "Apply fungicides in spring",
      "Remove nearby cedar trees if possible",
      "Use resistant apple varieties"
    ],
    prevention: [
      "Plant resistant varieties",
      "Remove cedar trees within 2 miles",
      "Apply protective fungicides early season"
    ]
  },
  {
    name: "Early Blight",
    plant: "Tomato/Potato",
    severity: "medium",
    description: "A common fungal disease affecting tomatoes and potatoes.",
    symptoms: "Brown spots with concentric rings on leaves, yellowing, defoliation.",
    treatment: [
      "Remove infected leaves immediately",
      "Apply fungicides containing chlorothalonil",
      "Improve air circulation",
      "Water at soil level to keep foliage dry"
    ],
    prevention: [
      "Use disease-free seeds and transplants",
      "Rotate crops annually",
      "Mulch to prevent soil splash",
      "Space plants properly for airflow"
    ]
  },
  {
    name: "Late Blight",
    plant: "Tomato/Potato",
    severity: "high",
    description: "A devastating disease that can destroy entire crops quickly.",
    symptoms: "Water-soaked spots on leaves, white mold on undersides, rapid plant death.",
    treatment: [
      "Remove and destroy infected plants immediately",
      "Apply copper-based fungicides",
      "Avoid overhead watering",
      "Harvest uninfected tubers/fruit quickly"
    ],
    prevention: [
      "Plant certified disease-free seed potatoes",
      "Ensure good drainage",
      "Apply preventive fungicides in humid weather",
      "Remove volunteer plants"
    ]
  },
  {
    name: "Leaf Mold",
    plant: "Tomato",
    severity: "medium",
    description: "A fungal disease common in greenhouse tomatoes.",
    symptoms: "Yellow patches on upper leaf surfaces, olive-green to brown mold beneath.",
    treatment: [
      "Improve ventilation",
      "Remove infected leaves",
      "Apply fungicides if severe",
      "Reduce humidity levels"
    ],
    prevention: [
      "Use resistant varieties",
      "Maintain low humidity",
      "Ensure proper spacing",
      "Avoid overhead watering"
    ]
  },
  {
    name: "Septoria Leaf Spot",
    plant: "Tomato",
    severity: "medium",
    description: "A fungal disease causing numerous small spots on leaves.",
    symptoms: "Small circular spots with dark borders and gray centers, defoliation.",
    treatment: [
      "Remove infected lower leaves",
      "Apply copper or organic fungicides",
      "Mulch to prevent soil splash"
    ],
    prevention: [
      "Rotate crops with non-solanaceous plants",
      "Use disease-free transplants",
      "Water at soil level",
      "Maintain plant spacing"
    ]
  },
  {
    name: "Spider Mites",
    plant: "Tomato",
    severity: "low",
    description: "Tiny pests that suck plant juices causing stippling and webbing.",
    symptoms: "Yellow stippling on leaves, fine webbing, leaf bronzing.",
    treatment: [
      "Spray with strong water stream",
      "Apply insecticidal soap",
      "Use neem oil",
      "Introduce predatory mites"
    ],
    prevention: [
      "Maintain adequate moisture",
      "Avoid over-fertilizing",
      "Encourage beneficial insects",
      "Keep plants healthy"
    ]
  },
  {
    name: "Target Spot",
    plant: "Tomato",
    severity: "medium",
    description: "A fungal disease with distinctive target-like lesions.",
    symptoms: "Brown spots with concentric rings, yellowing leaves, fruit spots.",
    treatment: [
      "Remove infected plant material",
      "Apply appropriate fungicides",
      "Improve air circulation"
    ],
    prevention: [
      "Use resistant varieties when available",
      "Practice crop rotation",
      "Mulch around plants",
      "Avoid working with wet plants"
    ]
  },
  {
    name: "Mosaic Virus",
    plant: "Tomato",
    severity: "high",
    description: "A viral disease causing mottled leaves and stunted growth.",
    symptoms: "Mottled yellow and green leaves, distorted growth, reduced yield.",
    treatment: [
      "Remove and destroy infected plants",
      "Control aphid vectors",
      "No chemical cure available",
      "Disinfect tools between plants"
    ],
    prevention: [
      "Use virus-free transplants",
      "Control aphids and whiteflies",
      "Remove weeds that harbor virus",
      "Avoid tobacco use around plants"
    ]
  },
  {
    name: "Yellow Leaf Curl Virus",
    plant: "Tomato",
    severity: "high",
    description: "A viral disease transmitted by whiteflies.",
    symptoms: "Upward leaf curling, yellowing, stunted growth, reduced fruit production.",
    treatment: [
      "Remove infected plants immediately",
      "Control whitefly populations",
      "Use reflective mulches",
      "Apply systemic insecticides if necessary"
    ],
    prevention: [
      "Use resistant varieties",
      "Install insect screening in greenhouses",
      "Control whiteflies proactively",
      "Remove infected plants promptly"
    ]
  },
  {
    name: "Bacterial Spot",
    plant: "Tomato",
    severity: "medium",
    description: "A bacterial disease causing leaf and fruit spots.",
    symptoms: "Small dark spots on leaves and fruit, yellowing, defoliation.",
    treatment: [
      "Apply copper-based bactericides",
      "Remove infected plant parts",
      "Avoid overhead watering",
      "Use drip irrigation"
    ],
    prevention: [
      "Use disease-free seeds and transplants",
      "Practice crop rotation",
      "Disinfect tools regularly",
      "Avoid working with wet plants"
    ]
  }
];

export const DiseasesDialog = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <Info className="h-4 w-4" />;
      case "low":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2">
          <Info className="h-5 w-5" />
          View All Diseases
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Plant Diseases Database</DialogTitle>
          <DialogDescription>
            Comprehensive information about common plant diseases affecting Apple, Tomato, and Potato crops
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {diseasesData.map((disease, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-6 space-y-4 bg-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{disease.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Affects: <span className="font-medium text-foreground">{disease.plant}</span>
                    </p>
                  </div>
                  <Badge
                    variant={getSeverityColor(disease.severity) as any}
                    className="gap-1"
                  >
                    {getSeverityIcon(disease.severity)}
                    {disease.severity} Risk
                  </Badge>
                </div>

                <p className="text-foreground leading-relaxed">{disease.description}</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Symptoms
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">{disease.symptoms}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Treatment</h4>
                    <ul className="space-y-1.5">
                      {disease.treatment.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Prevention</h4>
                    <ul className="space-y-1.5">
                      {disease.prevention.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
