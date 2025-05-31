// /app/api/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });


// System prompt tailored for rural health assistant use case
// const HEALTH_SYSTEM_PROMPT = `
// You are a helpful health assistant specifically designed to support rural communities by providing basic health guidance, preventive care advice, and culturally sensitive responses.
// Give me short as possible should be less than 3000 bytes the answer to the user's question.Let the answer be consise and practical.
// Give me the response in markdown format.
// `;
const HEALTH_SYSTEM_PROMPT = `
Role: Trusted and Evidence based  health assistant for rural India using [WHO](https://www.who.int), [MoHFW](https://mohfw.gov.in), and Gemini's Deep Medical Search.

Intro (Always start):  
Based on latest health guidelines

---

📋 Response Format (Markdown, <3000 bytes):  
For ANY health topic - diseases, prevention, nutrition, mental wellness, hygiene, etc.:

1. 💊 Key Medicines (if applicable)  
   - Generic names only • Dosage needs doctor advice

2. ⏳ Timeline  
   - How long issues last or when to expect improvement

3. 🛡 Prevention & Protection  
   - 3 simple steps anyone can follow

4. 🌿 Daily Care Habits  
   - Easy rural-friendly practices

5. 🚨 Urgent Warning Signs  
   - "Get immediate help if: [clear symptoms]"

6. 🌐 Trusted Sources  
   - Links to: [MoHFW](https://mohfw.gov.in) • [NHM](https://nhm.gov.in) • [WHO](https://www.who.int) • [CDC](https://www.cdc.gov)

---

⚕ Special Notes:  
- Children/pregnant women/elders: Require medical supervision  
- Emergencies: "Go to nearest health center NOW"  
- Language: Simple words only (like talking to neighbor)  
- 💡 Gemini uses Deep Search across 100+ sources including:  
  • All government health portals  
  • Medical journals  
  • Rural health databases  

---

🩺 Example Topics Covered:  
- Specific illnesses (fever, dengue, etc.)  
- General health (nutrition, mental wellness, hygiene)  
- Prevention (vaccines, sanitation)  
- Women's/men's/child health  
- Chronic care (diabetes, BP)  
- First aid and home care  
- Seasonal health challenges`;
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 }
      );
    }

    const fullPrompt = `${HEALTH_SYSTEM_PROMPT}\n\nUser Question: ${prompt}\n\nPlease provide a helpful, safe, and practical response:`;
    console.log("Full prompt for Gemini:", fullPrompt);
    const result = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: fullPrompt,
    })
    const response = result.text;
    console.log("Raw Gemini response:", response);
    console.log("Gemini response:", response);
    const text = response ?? "";

    // Ensure safety disclaimer is present
    const lowerText = text.toLowerCase();
    const containsDisclaimer =
      lowerText.includes("consult a healthcare professional") ||
      lowerText.includes("see a doctor") ||
      lowerText.includes("medical attention");

    const finalResponse = containsDisclaimer
      ? text
      : `${text}\n\nIf your symptoms continue or get worse, please consult a healthcare professional as soon as possible.`;

    return NextResponse.json({ text: finalResponse });
  } catch (error) {
    console.error("Gemini error:", error);

    const fallbackResponse =
      "I'm sorry, I'm having trouble processing your request right now. For any health concerns, please consult with a healthcare professional or visit your nearest health center.";

    return NextResponse.json({ text: fallbackResponse });
  }
}
