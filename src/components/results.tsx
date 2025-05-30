"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Volume2,
  Stethoscope,
  Leaf,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ResultsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any;
  symptomText: string;
  category: string;
  language: string;
  imageAnalysis?: string;
  uploadedImage?: string | null;
}

interface AIAnalysis {
  diagnosis: string;
  urgency: "low" | "medium" | "high";
  confidence: number;
  recommendations: string[];
  homeRemedies: string[];
  doctorVisit: string;
  ruralSpecificAdvice: string[];
  preventiveCare: string[];
  culturalConsiderations: string[];
}

export default function Results({
  results,
  symptomText,
  category,
  language,
  imageAnalysis,
  uploadedImage,
}: ResultsProps) {
  const router = useRouter();
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateAIAnalysis = async () => {
      try {
        setIsLoading(true);

        // Create comprehensive prompt for rural healthcare
        const prompt = `
As a rural healthcare AI assistant, analyze the following health information and provide comprehensive guidance:

**Patient Information:**
- Symptoms described: ${symptomText}
- Category: ${category}
- Language preference: ${language}
${imageAnalysis ? `- Image analysis result: ${imageAnalysis}` : ""}
${results ? `- Additional analysis: ${JSON.stringify(results)}` : ""}

**Context:** This is for a rural community member who may have limited access to immediate healthcare facilities.

Please provide a structured response in JSON format with the following fields:
{
  "diagnosis": "Brief explanation of likely condition(s)",
  "urgency": "low/medium/high - based on severity",
  "confidence": "percentage as number (0-100)",
  "recommendations": ["immediate care steps", "what to do now"],
  "homeRemedies": ["safe home treatments", "traditional remedies if applicable"],
  "doctorVisit": "when and why to seek professional medical help",
  "ruralSpecificAdvice": ["advice specific to rural settings", "resource accessibility"],
  "preventiveCare": ["how to prevent this in future", "lifestyle changes"],
  "culturalConsiderations": ["culturally sensitive advice", "local practices to consider"]
}

Important guidelines:
- Keep language simple and practical
- Consider limited healthcare access in rural areas
- Include both modern and traditional safe remedies
- Be culturally sensitive
- Emphasize when professional medical care is absolutely necessary
- Provide preventive guidance
- Consider resource limitations in rural settings
`;

        const response = await fetch("/api/results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI analysis");
        }

        const data = await response.json();

        // Try to parse JSON from the response
        try {
          const jsonMatch = data.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedAnalysis = JSON.parse(jsonMatch[0]);
            setAiAnalysis(parsedAnalysis);
          } else {
            // Fallback if JSON parsing fails
            setAiAnalysis({
              diagnosis: data.text.substring(0, 200),
              urgency: "medium",
              confidence: 75,
              recommendations: ["Consult healthcare provider"],
              homeRemedies: ["Rest and hydration"],
              doctorVisit: "Seek medical attention if symptoms persist",
              ruralSpecificAdvice: ["Contact nearest health center"],
              preventiveCare: ["Maintain good hygiene"],
              culturalConsiderations: ["Follow local health practices"],
            });
          }
        } catch (parseError) {
          console.error("JSON parsing error:", parseError);
          // Fallback analysis
          setAiAnalysis({
            diagnosis: data.text.substring(0, 200),
            urgency: "medium",
            confidence: 75,
            recommendations: ["Consult healthcare provider"],
            homeRemedies: ["Rest and hydration"],
            doctorVisit: "Seek medical attention if symptoms persist",
            ruralSpecificAdvice: ["Contact nearest health center"],
            preventiveCare: ["Maintain good hygiene"],
            culturalConsiderations: ["Follow local health practices"],
          });
        }
      } catch (err) {
        console.error("Error generating AI analysis:", err);
        setError("Failed to analyze symptoms. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    generateAIAnalysis();
  }, [symptomText, category, language, imageAnalysis, results]);

  const speakResults = () => {
    if ("speechSynthesis" in window && aiAnalysis) {
      const text = `${aiAnalysis.diagnosis}. ${aiAnalysis.recommendations.join(
        ". "
      )}. ${aiAnalysis.doctorVisit}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <Clock className="h-4 w-4" />;
      case "low":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <p className="font-medium">Analyzing your symptoms...</p>
                <p className="text-sm text-gray-600">
                  Our AI is preparing personalized rural healthcare guidance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!aiAnalysis) return null;

  return (
    <div className="space-y-6">
      {/* Rural Healthcare Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Rural Healthcare Analysis
            </CardTitle>
            <Button variant="outline" size="sm" onClick={speakResults}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">Your symptoms:</p>
            <p className="font-medium">{symptomText}</p>
          </div>

          {uploadedImage && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Image analysis:</p>
              <p className="text-sm bg-blue-100 p-2 rounded">{imageAnalysis}</p>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">Category: {category}</Badge>
            <Badge variant="secondary">
              Confidence: {aiAnalysis.confidence}%
            </Badge>
            <Badge
              variant={getUrgencyColor(aiAnalysis.urgency)}
              className="flex items-center gap-1"
            >
              {getUrgencyIcon(aiAnalysis.urgency)}
              {aiAnalysis.urgency} priority
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Possible Condition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown>
            {aiAnalysis.diagnosis}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Immediate Care Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Immediate Care Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiAnalysis.recommendations.map((rec: string, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">
                  {index + 1}
                </span>
              </div>
              <ReactMarkdown>
                {rec}
              </ReactMarkdown>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rural-Specific Advice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            Rural Healthcare Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {aiAnalysis.ruralSpecificAdvice.map(
            (advice: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <ReactMarkdown >
                  {advice}
                </ReactMarkdown>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Home Remedies */}
      {aiAnalysis.homeRemedies && aiAnalysis.homeRemedies.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Safe Home Remedies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiAnalysis.homeRemedies.map((remedy: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <ReactMarkdown >
                  {remedy}
                </ReactMarkdown>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Cultural Considerations */}
      {aiAnalysis.culturalConsiderations &&
        aiAnalysis.culturalConsiderations.length > 0 && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Cultural & Traditional Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {aiAnalysis.culturalConsiderations.map(
                (consideration: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <ReactMarkdown >
                      {consideration}
                    </ReactMarkdown>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        )}

      {/* Preventive Care */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Prevention & Future Care
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {aiAnalysis.preventiveCare.map(
            (prevention: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <ReactMarkdown>
                  {prevention}
                </ReactMarkdown>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Medical Consultation */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            When to Seek Medical Help
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown>
            {aiAnalysis.doctorVisit}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600 text-center">
            <strong>Disclaimer:</strong> This AI-powered analysis is designed to
            support rural healthcare access but should not replace professional
            medical advice. Always consult with qualified healthcare providers
            for proper diagnosis and treatment. This tool aims to bridge
            healthcare gaps in rural communities by providing initial guidance
            and culturally sensitive health information.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={() => router.push("/symptom-checker")}
          className="w-full"
          variant="outline"
        >
          Check Another Symptom
        </Button>
        <Button onClick={() => router.push("/")} className="w-full">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
