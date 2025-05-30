/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import VoiceInput from "@/components/voice-input"
import SymptomCategories from "@/components/symptom-categories"
import ImageUpload from "@/components/image-upload"
import Results from "@/components/results"

type Step = "voice-input" | "categories" | "image-upload" | "results"

export default function SymptomCheckerPage() {
  const [currentStep, setCurrentStep] = useState<Step>("voice-input")
  const [symptomText, setSymptomText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const language = searchParams.get("lang") || "en"

  const handleNext = () => {
    switch (currentStep) {
      case "voice-input":
        setCurrentStep("categories")
        break
      case "categories":
        // Check if external symptom requires image
        if (["skin", "eye", "dental", "ear"].includes(selectedCategory)) {
          setCurrentStep("image-upload")
        } else {
          // Skip to results for internal symptoms
          setCurrentStep("results")
          // generateResults()
        }
        break
      case "image-upload":
        setCurrentStep("results")
        // generateResults()
        break
    }
  }

  // const generateResults = () => {
  //   // Simulate AI analysis results
  //   const mockResults = {
  //     diagnosis: "Based on your symptoms and analysis, this appears to be a common condition.",
  //     confidence: 85,
  //     recommendations: [
  //       "Apply cold compress for 15-20 minutes",
  //       "Keep the affected area clean and dry",
  //       "Avoid touching or scratching the area",
  //       "Monitor symptoms for 24-48 hours",
  //     ],
  //     urgency: "low",
  //     homeRemedies: ["Drink plenty of water", "Get adequate rest", "Use over-the-counter pain relief if needed"],
  //     doctorVisit: "Consider visiting a doctor if symptoms worsen or persist beyond 3 days",
  //   }
  //   setAnalysisResults(mockResults)
  // }

  const renderStep = () => {
    switch (currentStep) {
      case "voice-input":
        return <VoiceInput language={language} onTextChange={setSymptomText} symptomText={symptomText} />
      case "categories":
        return (
          <SymptomCategories
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
            symptomText={symptomText}
            language={language}
          />
        )
      case "image-upload":
        return (
          <ImageUpload onImageUpload={setUploadedImage} uploadedImage={uploadedImage} category={selectedCategory} language={language} setAnalysisResult={setAnalysisResults} analysisResults={analysisResults}/>
        )
      case "results":
        return (
          <Results
            results={analysisResults}
            symptomText={symptomText}
            category={selectedCategory}
            language={language}
          />
        )
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "voice-input":
        return symptomText.trim().length > 0
      case "categories":
        return selectedCategory.length > 0
      case "image-upload":
        return uploadedImage !== null
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case "voice-input":
        return "Describe Your Symptoms"
      case "categories":
        return "Symptom Category"
      case "image-upload":
        return "Upload Image"
      case "results":
        return "Analysis Results"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Symptom Checker</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between mb-6">
          {["voice-input", "categories", "image-upload", "results"].map((step, index) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step
                  ? "bg-blue-500 text-white"
                  : index < ["voice-input", "categories", "image-upload", "results"].indexOf(currentStep)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{getStepTitle()}</CardTitle>
            <CardDescription>
              {currentStep === "voice-input" && "Tell us about your symptoms using voice or text"}
              {currentStep === "categories" && "We've identified the symptom category"}
              {currentStep === "image-upload" && "Please upload an image of the affected area"}
              {currentStep === "results" && "Here's your health analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        {currentStep !== "results" && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleNext} disabled={!canProceed()} className="flex items-center gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
