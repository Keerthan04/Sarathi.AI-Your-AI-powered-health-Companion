import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const QUERY_BACKEND_URL =
  process.env.QUERY_BACKEND_URL || "http://localhost:5000/predict";

export async function POST(request: NextRequest) {
  try {
    const { symptomText, language }: { symptomText: string; language: string } =
      await request.json();

    console.log("Symptom Text:", symptomText);
    console.log("Language:", language);

    // Input validation
    if (!symptomText || typeof symptomText !== "string") {
      return NextResponse.json(
        { error: "Symptom text is required" },
        { status: 400 }
      );
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

    // Call backend for symptom prediction
    const backendResponse = await axios.post(QUERY_BACKEND_URL, {
      symptom: symptomText,
    });

    console.log("Response from backend:", backendResponse.data);

    const { symptom, predicted_class } = backendResponse.data;

    console.log("Predicted Symptom:", symptom);
    console.log("Predicted Class:", predicted_class);

    // Validate backend response
    if (!symptom || typeof symptom !== "string") {
      return NextResponse.json(
        { error: "Invalid symptom response from backend" },
        { status: 500 }
      );
    }

    if (!predicted_class || typeof predicted_class !== "string") {
      return NextResponse.json(
        { error: "Invalid predicted class from backend" },
        { status: 500 }
      );
    }

    let finalTranslation = symptom; // Default to original symptom

    // Translate the symptom to target language
    try {
      const baseUrl =
        process.env.NEXTAUTH_URL || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";

      const translateResponse = await fetch(`${baseUrl}/api/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any required auth headers if needed
        },
        body: JSON.stringify({
          text: symptom,
          target: language.split("-")[0], // Extract language code (hi from hi-IN)
        }),
      });

      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        if (translateData.translation) {
          finalTranslation = translateData.translation;
        }
      } else {
        console.warn("Translation API failed:", translateResponse.status);
      }
    } catch (translationError) {
      console.error("Translation error:", translationError);
      // Continue with original symptom if translation fails
    }

    // Return the response
    return NextResponse.json({
      translation: finalTranslation,
      originalSymptom: symptom,
      predictedClass: predicted_class,
      success: true,
    });
  } catch (error) {
    console.error("Symptom analysis error:", error);

    // More specific error handling
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          { error: `Backend error: ${error.response.status}` },
          { status: error.response.status }
        );
      } else if (error.request) {
        return NextResponse.json(
          { error: "Failed to connect to backend service" },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze symptoms" },
      { status: 500 }
    );
  }
}
