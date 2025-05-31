"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { translateText } from "@/lib/utils";

interface SymptomCategoriesProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
  symptomText: string;
  language: string;
}

const normalCategories = [
  {
    id: "skin",
    name: "Skin Issues",
    icon: "🔴",
    description: "Rashes, wounds, infections",
    external: true,
 
  },
  {
    id: "eye",
    name: "Eye Problems",
    icon: "👁️",
    description: "Vision, pain, discharge",
    external: true,

  },
  {
    id: "dental",
    name: "Dental Issues",
    icon: "🦷",
    description: "Tooth pain, gum problems",
    external: true,

  },
  {
    id: "ear",
    name: "Ear Problems",
    icon: "👂",
    description: "Hearing, pain, discharge",
    external: true,

  },
  {
    id: "respiratory",
    name: "Breathing",
    icon: "🫁",
    description: "Cough, shortness of breath",
    external: false,

  },
  {
    id: "digestive",
    name: "Stomach",
    icon: "🤢",
    description: "Nausea, pain, digestion",
    external: false,

  },
  {
    id: "neurological",
    name: "Head/Brain",
    icon: "🧠",
    description: "Headache, dizziness",
    external: false,

  },
  {
    id: "musculoskeletal",
    name: "Bones/Joints",
    icon: "🦴",
    description: "Pain, stiffness, injury",
    external: false,

  },
];

export default function SymptomCategories({
  onCategorySelect,
  selectedCategory,
  symptomText,
  language,
}: SymptomCategoriesProps) {
  const [symptomAnalysisLabel, setSymptomAnalysisLabel] =
    useState("Symptom Analysis");
  const [imageRequiredLabel, setImageRequiredLabel] =
    useState("Select Your Category Based on Symptoms told");
  const [categories, setCategories] = useState(normalCategories);
  const [processedSymptom, setProcessedSymptom] = useState("");
  const [originalSymptom, setOriginalSymptom] = useState("");
  const [predictedClass, setPredictedClass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageRequired, setImageRequired] = useState("Image Required");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [translatedPredictedClass, setTranslatedPredictedClass] =
    useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symptomText || !language) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [
          translatedAnalysis,
          translatedImageRequired,
          translatedPredictedClass,
          translatedImageRequired2,
          translatedCategories,
          symptomResponse,
        ] = await Promise.all([
          translateText("Symptom Analysis", language),
          translateText("Image Required", language),
          translateText("Predicted Category", language),
          translateText("Image Required", language),  
          Promise.all(
            normalCategories.map(async (category) => {
              const [translatedName, translatedDescription] = await Promise.all(
                [
                  translateText(category.name, language),
                  translateText(category.description, language),
                ]
              );
              return {
                ...category,
                name: translatedName || category.name,
                description: translatedDescription || category.description,
              };
            })
          ),
          fetch("/api/symptom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptomText, language }),
          }),
        ]);
        setImageRequired(translatedImageRequired2 || "Image Required");
        setSymptomAnalysisLabel(translatedAnalysis || "Symptom Analysis");
        setImageRequiredLabel(translatedImageRequired || "Image Required");
        setCategories(translatedCategories);
        setTranslatedPredictedClass(translatedPredictedClass || "");
        if (!symptomResponse.ok) {
          throw new Error(`API Error: ${symptomResponse.status}`);
        }

        const data = await symptomResponse.json();
        setProcessedSymptom(data.translation || symptomText);
        setOriginalSymptom(data.originalSymptom || symptomText);
        setPredictedClass(data.predictedClass || "");
      } catch (err) {
        console.error("Error analyzing symptoms:", err);
        setError("Failed to analyze symptoms. Please try again.");
        setProcessedSymptom(symptomText);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symptomText, language]);

  const getCategoryHighlight = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      return "ring-2 ring-blue-500 bg-blue-50";
    }
    if (predictedClass && predictedClass.toLowerCase().includes(categoryId)) {
      return "ring-2 ring-green-500 bg-green-50";
    }
    return "hover:bg-gray-50";
  };
  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }
  return (
    

    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">{symptomAnalysisLabel}</h3>
        <p className="text-sm text-gray-600 mb-4">
          &quot;{symptomText}&quot;
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {processedSymptom && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-2">
              AI Analysis:
            </p>
            <p className="text-sm text-blue-700 mb-2">{processedSymptom}</p>
            {/* {predictedClass && (
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {translatedPredictedClass}: {predictedClass}
                </Badge>
              </div>
            )} */}
            {originalSymptom && originalSymptom !== symptomText && (
              <p className="text-xs text-blue-600 mt-2 italic">
                Processed from: &quot;{originalSymptom}&quot;
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <h4 className="font-small mb-3">{imageRequiredLabel}</h4>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 ${getCategoryHighlight(
                category.id
              )}`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{category.name}</p>
                    <p className="text-xs text-gray-500">
                      {category.description}
                    </p>
                    {category.external && (
                      <p className="text-xs text-gray-500">{imageRequired}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
