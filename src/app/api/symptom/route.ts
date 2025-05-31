import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

// Initialize Google GenAI with error handling
const initializeGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
};

// System prompt for health analysis
const HEALTH_SYSTEM_PROMPT = `
You are a medical symptom analysis assistant. Given a user's symptom description and the model's predicted classification, your task is to:

1. Evaluate if the predicted classification matches the user's symptom
2. If incorrect, provide the correct symptom classification in the same language as the user's input
3. Return ONLY the corrected symptom name, nothing else - no explanations, introductions, or additional text

User's original symptom and model prediction will be provided below.
`;

const QUERY_BACKEND_URL =
  process.env.QUERY_BACKEND_URL || "http://localhost:5000/predict";

interface SymptomAnalysisRequest {
  symptomText: string;
  language: string;
}

interface BackendResponse {
  symptom: string;
  predicted_class: string;
}

interface TranslationResponse {
  translation: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: SymptomAnalysisRequest = await request.json();
    const { symptomText, language } = body;

    console.log("Processing symptom analysis:", { symptomText, language });

    // Input validation
    if (!symptomText?.trim()) {
      return NextResponse.json(
        { error: "Symptom text is required and cannot be empty" },
        { status: 400 }
      );
    }

    if (!language?.trim()) {
      return NextResponse.json(
        { error: "Language is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Step 1: Get prediction from backend
    const backendResponse = await callBackendPrediction(symptomText);
    const { symptom, predicted_class } = backendResponse;

    console.log("Backend prediction:", { symptom, predicted_class });

    // Step 2: Validate and refine symptom using Gemini AI
    const refinedSymptom = await refineSymptomWithAI(symptom, predicted_class);

    console.log("AI-refined symptom:", refinedSymptom);

    // Step 3: Translate the refined symptom to target language
    const finalTranslation = await translateSymptom(refinedSymptom, language);

    console.log("Final translation:", finalTranslation);

    // Return successful response
    return NextResponse.json({
      translation: finalTranslation,
      originalSymptom: symptom,
      predictedClass: predicted_class,
      success: true,
    });
  } catch (error) {
    console.error("Symptom analysis error:", error);
    return handleError(error);
  }
}

// Helper function to call backend prediction service
async function callBackendPrediction(
  symptomText: string
): Promise<BackendResponse> {
  try {
    const response = await axios.post(
      QUERY_BACKEND_URL,
      { symptom: symptomText },
      {
        timeout: 10000, // 10 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { symptom, predicted_class } = response.data;

    // Validate backend response structure
    if (!symptom || typeof symptom !== "string") {
      throw new Error("Invalid symptom response from backend");
    }

    if (!predicted_class || typeof predicted_class !== "string") {
      throw new Error("Invalid predicted class from backend");
    }

    return { symptom, predicted_class };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Backend service error: ${error.response.status} - ${
            error.response.data?.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        throw new Error("Failed to connect to backend prediction service");
      }
    }
    throw new Error(
      `Backend prediction failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Helper function to refine symptom using Gemini AI
async function refineSymptomWithAI(
  symptom: string,
  predictedClass: string
): Promise<string> {
  try {
    const ai = initializeGenAI();

    const fullPrompt = `${HEALTH_SYSTEM_PROMPT}

User Symptom: ${symptom}
Model Prediction: ${predictedClass}

Please provide the corrected symptom if needed:`;

    console.log("Gemini AI prompt:", fullPrompt);

    const result = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: fullPrompt,
    });

    const response = result.text?.trim();

    if (!response) {
      console.warn("Empty response from Gemini AI, using original symptom");
      return symptom;
    }

    console.log("Gemini AI response:", response);
    return response;
  } catch (error) {
    console.error("Gemini AI refinement error:", error);
    // Fallback to original symptom if AI fails
    return symptom;
  }
}

// Helper function to translate symptom to target language
async function translateSymptom(
  symptom: string,
  language: string
): Promise<string> {
  // Skip translation for English
  const languageCode = language.split("-")[0].toLowerCase();
  if (languageCode === "en") {
    return symptom;
  }

  try {
    const baseUrl = getBaseUrl();

    const translateResponse = await fetch(`${baseUrl}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: symptom,
        target: languageCode, // Extract language code (hi from hi-IN)
      }),
    });

    if (!translateResponse.ok) {
      console.warn(
        `Translation API failed with status: ${translateResponse.status}`
      );
      return symptom; // Fallback to original
    }

    const translateData: TranslationResponse = await translateResponse.json();

    if (translateData.translation?.trim()) {
      return translateData.translation;
    } else {
      console.warn("Empty translation received");
      return symptom;
    }
  } catch (error) {
    console.error("Translation error:", error);
    return symptom; // Fallback to original symptom
  }
}

// Helper function to get base URL
function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  return "http://localhost:3000";
}

// Helper function to handle different types of errors
function handleError(error: unknown): NextResponse {
  if (error instanceof Error) {
    // Handle specific error messages
    if (error.message.includes("Backend service error")) {
      const statusMatch = error.message.match(/(\d{3})/);
      const status = statusMatch ? parseInt(statusMatch[1]) : 503;
      return NextResponse.json(
        { error: "Backend service unavailable" },
        { status }
      );
    }

    if (error.message.includes("connect to backend")) {
      return NextResponse.json(
        { error: "Prediction service temporarily unavailable" },
        { status: 503 }
      );
    }

    if (error.message.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { error: "AI service configuration error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Symptom analysis failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
