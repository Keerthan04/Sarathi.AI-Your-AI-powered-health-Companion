// /app/api/results/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// System prompt tailored for rural health assistant use case
const RURAL_HEALTH_SYSTEM_PROMPT = `
You are an AI healthcare assistant specifically designed to support rural and underserved communities. Your role is to:

1. **Bridge Healthcare Gaps**: Provide accessible health guidance where immediate medical care may be limited
2. **Cultural Sensitivity**: Respect local traditions while promoting safe medical practices
3. **Resource Awareness**: Consider limited healthcare infrastructure and suggest practical solutions
4. **Preventive Focus**: Emphasize prevention and early intervention to reduce healthcare burden
5. **Safety First**: Always prioritize safety and clearly indicate when professional medical care is essential

**Key Principles:**
- Use simple, clear language that can be understood by people with varying education levels
- Provide both modern medical advice and acknowledge safe traditional practices
- Consider accessibility issues (transportation, cost, availability of healthcare)
- Include community-based solutions where appropriate
- Emphasize when to seek immediate medical attention
- Provide practical home care that's feasible in rural settings
- Be respectful of cultural beliefs while promoting health

**Response Format:** Provide responses in valid JSON format with structured fields for easy processing.

**Important:** Your advice should complement, not replace, professional medical care. Always include guidance on when and how to access professional healthcare services.
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log(
      "Received prompt for rural health analysis:",
      prompt?.substring(0, 200) + "..."
    );

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 }
      );
    }

    // Enhanced prompt for rural healthcare context
    const enhancedPrompt = `${RURAL_HEALTH_SYSTEM_PROMPT}

${prompt}

**Additional Instructions:**
- Keep the response concise but comprehensive (under 3000 bytes total)
- Ensure JSON format is valid and properly structured
- Include practical advice suitable for rural communities
- Consider limited access to medications and healthcare facilities
- Provide culturally appropriate guidance
- Include both immediate and long-term care recommendations
- Emphasize prevention and health education
- Be specific about warning signs that require immediate medical attention

**Response must be in this exact JSON structure:**
{
  "diagnosis": "Clear explanation of likely condition in simple terms",
  "urgency": "low/medium/high",
  "confidence": number between 0-100,
  "recommendations": ["step 1", "step 2", "step 3"],
  "homeRemedies": ["safe remedy 1", "safe remedy 2"],
  "doctorVisit": "specific guidance on when and why to seek professional care",
  "ruralSpecificAdvice": ["advice for rural settings", "resource accessibility tips"],
  "preventiveCare": ["prevention tip 1", "prevention tip 2"],
  "culturalConsiderations": ["cultural advice 1", "cultural advice 2"]
}

Please provide your response:`;

    console.log("Sending enhanced prompt to Gemini...");

    const result = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: enhancedPrompt,
    });

    const response = result.text;
    console.log("Raw Gemini response length:", response?.length);

    if (!response) {
      throw new Error("No response from Gemini");
    }

    let processedResponse = response;

    // Clean up the response to ensure it's valid JSON
    try {
      // Remove any markdown code block markers
      processedResponse = processedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");

      // Find JSON object in the response
      const jsonMatch = processedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        processedResponse = jsonMatch[0];
      }

      // Validate JSON format
      const testParse = JSON.parse(processedResponse);
      console.log("JSON validation successful");

      // Ensure required fields exist
      const requiredFields = [
        "diagnosis",
        "urgency",
        "confidence",
        "recommendations",
        "homeRemedies",
        "doctorVisit",
      ];
      const missingFields = requiredFields.filter((field) => !testParse[field]);

      if (missingFields.length > 0) {
        console.warn("Missing required fields:", missingFields);
        // Add default values for missing fields
        if (!testParse.urgency) testParse.urgency = "medium";
        if (!testParse.confidence) testParse.confidence = 75;
        if (!testParse.recommendations)
          testParse.recommendations = ["Consult healthcare provider"];
        if (!testParse.homeRemedies)
          testParse.homeRemedies = ["Rest and stay hydrated"];
        if (!testParse.doctorVisit)
          testParse.doctorVisit =
            "Seek medical attention if symptoms persist or worsen";
        if (!testParse.ruralSpecificAdvice)
          testParse.ruralSpecificAdvice = [
            "Contact nearest community health center",
          ];
        if (!testParse.preventiveCare)
          testParse.preventiveCare = ["Maintain good hygiene practices"];
        if (!testParse.culturalConsiderations)
          testParse.culturalConsiderations = [
            "Follow safe traditional practices alongside modern care",
          ];

        processedResponse = JSON.stringify(testParse);
      }
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);

      // Fallback: create structured response from the text
      const fallbackResponse = {
        diagnosis:
          response.substring(0, 300).replace(/[{}[\]"]/g, "") ||
          "Unable to determine specific condition. General health guidance provided.",
        urgency: "medium",
        confidence: 70,
        recommendations: [
          "Monitor symptoms closely",
          "Rest and stay hydrated",
          "Seek medical attention if symptoms worsen",
        ],
        homeRemedies: [
          "Get adequate rest",
          "Maintain proper hydration",
          "Eat nutritious foods if appetite allows",
        ],
        doctorVisit:
          "Consult a healthcare professional if symptoms persist for more than 2-3 days or if you experience severe symptoms",
        ruralSpecificAdvice: [
          "Contact your nearest community health worker",
          "If transportation is an issue, call local health services for guidance",
          "Keep emergency contact numbers readily available",
        ],
        preventiveCare: [
          "Maintain good personal hygiene",
          "Eat a balanced diet with locally available nutritious foods",
          "Stay physically active within your capabilities",
        ],
        culturalConsiderations: [
          "Combine traditional wisdom with modern healthcare practices safely",
          "Consult with community elders about traditional remedies while seeking medical advice",
        ],
      };

      processedResponse = JSON.stringify(fallbackResponse);
    }

    // Final safety check and disclaimer addition
    const lowerText = processedResponse.toLowerCase();
    const containsDisclaimer =
      lowerText.includes("consult") ||
      lowerText.includes("healthcare") ||
      lowerText.includes("medical attention");

    if (!containsDisclaimer) {
      try {
        const parsed = JSON.parse(processedResponse);
        parsed.doctorVisit +=
          " Always consult healthcare professionals for proper medical care.";
        processedResponse = JSON.stringify(parsed);
      } catch (e) {
        console.error("Error adding disclaimer:", e);
      }
    }

    console.log("Final processed response ready");
    return NextResponse.json({ text: processedResponse });
  } catch (error) {
    console.error("Gemini API error:", error);

    // Comprehensive fallback response for rural healthcare
    const fallbackResponse = {
      diagnosis:
        "I'm experiencing technical difficulties analyzing your symptoms. This doesn't mean your concerns aren't valid.",
      urgency: "medium",
      confidence: 50,
      recommendations: [
        "Document your symptoms (when they started, severity, changes)",
        "Rest and stay hydrated",
        "Monitor for any worsening of symptoms",
      ],
      homeRemedies: [
        "Get plenty of rest",
        "Drink clean water regularly",
        "Eat light, easily digestible foods",
      ],
      doctorVisit:
        "Since I cannot properly analyze your symptoms right now, please consult with a healthcare professional, community health worker, or call a medical helpline for proper guidance.",
      ruralSpecificAdvice: [
        "Contact your nearest Primary Health Center (PHC) or Community Health Center (CHC)",
        "Reach out to ASHA workers or ANM in your area",
        "Use telemedicine services if available in your region",
        "Call national health helplines for immediate guidance",
      ],
      preventiveCare: [
        "Maintain regular health check-ups when possible",
        "Keep a basic first aid kit at home",
        "Stay informed about common health issues in your area",
      ],
      culturalConsiderations: [
        "Seek advice from trusted community health advocates",
        "Balance traditional practices with modern medical advice safely",
      ],
    };

    return NextResponse.json({
      text: JSON.stringify(fallbackResponse),
      warning:
        "This is a fallback response due to technical issues. Please seek professional medical advice.",
    });
  }
}
