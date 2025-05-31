/* eslint-disable @typescript-eslint/no-explicit-any */
// // /app/api/gemini/route.ts
// import { NextRequest, NextResponse } from "next/server";
// // import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });


// // System prompt tailored for rural health assistant use case
// // const HEALTH_SYSTEM_PROMPT = `
// // You are a helpful health assistant specifically designed to support rural communities by providing basic health guidance, preventive care advice, and culturally sensitive responses.
// // Give me short as possible should be less than 3000 bytes the answer to the user's question.Let the answer be consise and practical.
// // Give me the response in markdown format.
// // `;
// const HEALTH_SYSTEM_PROMPT = `
// Role: Trusted and Evidence based  health assistant for rural India using [WHO](https://www.who.int), [MoHFW](https://mohfw.gov.in), and Gemini's Deep Medical Search.

// Intro (Always start):  
// Based on latest health guidelines

// ---

// 📋 Response Format (Markdown, <3000 bytes):  
// For ANY health topic - diseases, prevention, nutrition, mental wellness, hygiene, etc.:

// 1. 💊 Key Medicines (if applicable)  
//    - Generic names only • Dosage needs doctor advice

// 2. ⏳ Timeline  
//    - How long issues last or when to expect improvement

// 3. 🛡 Prevention & Protection  
//    - 3 simple steps anyone can follow

// 4. 🌿 Daily Care Habits  
//    - Easy rural-friendly practices

// 5. 🚨 Urgent Warning Signs  
//    - "Get immediate help if: [clear symptoms]"

// 6. 🌐 Trusted Sources  
//    - Links to: [MoHFW](https://mohfw.gov.in) • [NHM](https://nhm.gov.in) • [WHO](https://www.who.int) • [CDC](https://www.cdc.gov)

// ---

// ⚕ Special Notes:  
// - Children/pregnant women/elders: Require medical supervision  
// - Emergencies: "Go to nearest health center NOW"  
// - Language: Simple words only (like talking to neighbor)  
// - 💡 Gemini uses Deep Search across 100+ sources including:  
//   • All government health portals  
//   • Medical journals  
//   • Rural health databases  

// ---

// 🩺 Example Topics Covered:  
// - Specific illnesses (fever, dengue, etc.)  
// - General health (nutrition, mental wellness, hygiene)  
// - Prevention (vaccines, sanitation)  
// - Women's/men's/child health  
// - Chronic care (diabetes, BP)  
// - First aid and home care  
// - Seasonal health challenges`;
// export async function POST(req: NextRequest) {
//   try {
//     const { prompt } = await req.json();
//     console.log("Received prompt:", prompt);

//     if (!prompt || typeof prompt !== "string") {
//       return NextResponse.json(
//         { error: "Invalid prompt provided" },
//         { status: 400 }
//       );
//     }

//     const fullPrompt = `${HEALTH_SYSTEM_PROMPT}\n\nUser Question: ${prompt}\n\nPlease provide a helpful, safe, and practical response:`;
//     console.log("Full prompt for Gemini:", fullPrompt);
//     const result = await ai.models.generateContent({
//         model: "gemini-1.5-pro",
//         contents: fullPrompt,
//     })
//     const response = result.text;
//     console.log("Raw Gemini response:", response);
//     console.log("Gemini response:", response);
//     const text = response ?? "";

//     // Ensure safety disclaimer is present
//     const lowerText = text.toLowerCase();
//     const containsDisclaimer =
//       lowerText.includes("consult a healthcare professional") ||
//       lowerText.includes("see a doctor") ||
//       lowerText.includes("medical attention");

//     const finalResponse = containsDisclaimer
//       ? text
//       : `${text}\n\nIf your symptoms continue or get worse, please consult a healthcare professional as soon as possible.`;

//     return NextResponse.json({ text: finalResponse });
//   } catch (error) {
//     console.error("Gemini error:", error);

//     const fallbackResponse =
//       "I'm sorry, I'm having trouble processing your request right now. For any health concerns, please consult with a healthcare professional or visit your nearest health center.";

//     return NextResponse.json({ text: fallbackResponse });
//   }
// }
// /app/api/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {getMedicalHistorylimit, getPatientInfo, getPrescriptionslimit, getTestslimit } from "@/lib/actions";
// import { neon } from "@neondatabase/serverless";

// const sql = neon(process.env.DATABASE_URL!);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Patient data fetching functions
// async function getPatientInfo(patientId: string) {
//   try {
//     const result = await sql`
//       SELECT patient_id, name, email, age, gender, contact, address 
//       FROM Patients 
//       WHERE patient_id = ${patientId}
//     `;
//     return result[0] || null;
//   } catch (error) {
//     console.error("Error fetching patient info:", error);
//     return null;
//   }
// }

// async function getMedicalHistory(patientId: string, limit: number = 3) {
//   try {
//     const result = await sql`
//       SELECT history_id, diagnosis, date_of_diagnosis, treatment_given, family_history
//       FROM Medical_History 
//       WHERE patient_id = ${patientId}
//       ORDER BY date_of_diagnosis DESC
//       LIMIT ${limit}
//     `;
//     return result;
//   } catch (error) {
//     console.error("Error fetching medical history:", error);
//     return [];
//   }
// }

// async function getPrescriptions(patientId: string, limit: number = 3) {
//   try {
//     const result = await sql`
//       SELECT p.prescription_id, p.medication_name, p.dosage, p.frequency, d.name as doctor_name
//       FROM Prescriptions p
//       LEFT JOIN Doctors d ON p.doctor_id = d.doctor_id
//       WHERE p.patient_id = ${patientId}
//       ORDER BY p.prescription_id DESC
//       LIMIT ${limit}
//     `;
//     return result;
//   } catch (error) {
//     console.error("Error fetching prescriptions:", error);
//     return [];
//   }
// }

// async function getTests(patientId: string, limit: number = 3) {
//   try {
//     const completedTests = await sql`
//       SELECT test_id as id, test_name, result, date_taken as date, 'completed' as status
//       FROM Tests_Taken 
//       WHERE patient_id = ${patientId}
//       ORDER BY date_taken DESC
//       LIMIT ${Math.ceil(limit / 2)}
//     `;

//     const recommendedTests = await sql`
//       SELECT tr.recommendation_id as id, tr.test_name, tr.result, tr.recommendation_date as date, 'recommended' as status, d.name as doctor_name
//       FROM Tests_Recommended tr
//       LEFT JOIN Doctors d ON tr.doctor_id = d.doctor_id
//       WHERE tr.patient_id = ${patientId}
//       ORDER BY tr.recommendation_date DESC
//       LIMIT ${Math.ceil(limit / 2)}
//     `;

//     const allTests = [...completedTests, ...recommendedTests];
//     return allTests.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     ).slice(0, limit);
//   } catch (error) {
//     console.error("Error fetching tests:", error);
//     return [];
//   }
// }

// Build patient context for the prompt
function buildPatientContext(patientInfo: any, medicalHistory: any[], prescriptions: any[], tests: any[]) {
  if (!patientInfo) return "";

  let context = `\n\n--- PATIENT CONTEXT ---\n`;
  context += `Patient: ${patientInfo.name} (Age: ${patientInfo.age}, Gender: ${patientInfo.gender})\n`;
  
  if (medicalHistory.length > 0) {
    context += `\nRecent Medical History:\n`;
    medicalHistory.forEach((history, index) => {
      context += `${index + 1}. ${history.diagnosis} (${new Date(history.date_of_diagnosis).toLocaleDateString()}) - Treatment: ${history.treatment_given}\n`;
    });
  }

  if (prescriptions.length > 0) {
    context += `\nCurrent/Recent Prescriptions:\n`;
    prescriptions.forEach((prescription, index) => {
      context += `${index + 1}. ${prescription.medication_name} - ${prescription.dosage}, ${prescription.frequency}${prescription.doctor_name ? ` (Dr. ${prescription.doctor_name})` : ''}\n`;
    });
  }

  if (tests.length > 0) {
    context += `\nRecent Tests:\n`;
    tests.forEach((test, index) => {
      const statusIcon = test.status === 'completed' ? '✅' : '📋';
      context += `${index + 1}. ${statusIcon} ${test.test_name}${test.result ? ` - Result: ${test.result}` : ''} (${new Date(test.date).toLocaleDateString()})\n`;
    });
  }

  context += `--- END PATIENT CONTEXT ---\n\n`;
  return context;
}

const HEALTH_SYSTEM_PROMPT = `
Role: Trusted and Evidence-based health assistant for rural India using [WHO](https://www.who.int), [MoHFW](https://mohfw.gov.in), and Gemini's Deep Medical Search.

IMPORTANT: You have access to this patient's medical history, current prescriptions, and recent tests. Use this information to provide personalized, contextual health advice while being mindful of their medical background.

Intro (Always start):  
Based on latest health guidelines and your medical history

---

📋 Response Format (Markdown, <3000 bytes):  
For ANY health topic - diseases, prevention, nutrition, mental wellness, hygiene, etc.:

1. 🎯 Personalized Assessment  
   - Consider patient's age, gender, and medical history
   - Note any relevant interactions with current medications

2. 💊 Key Medicines (if applicable)  
   - Generic names only • Dosage needs doctor advice
   - ⚠️ Alert if conflicts with current prescriptions

3. ⏳ Timeline  
   - How long issues last or when to expect improvement
   - Consider patient's health status

4. 🛡 Prevention & Protection  
   - 3 simple steps tailored to patient profile

5. 🌿 Daily Care Habits  
   - Easy rural-friendly practices suitable for patient

6. 🚨 Urgent Warning Signs  
   - "Get immediate help if: [clear symptoms]"
   - Special attention to patient's medical conditions

7. 🌐 Trusted Sources  
   - Links to: [MoHFW](https://mohfw.gov.in) • [NHM](https://nhm.gov.in) • [WHO](https://www.who.int) • [CDC](https://www.cdc.gov)

---

⚕ Special Considerations:  
- Always reference patient's medical history when relevant
- Consider drug interactions with current prescriptions
- Account for patient's age and gender in recommendations
- Be extra cautious with patients having chronic conditions
- Emergencies: "Go to nearest health center NOW"
- Language: Simple words only (like talking to neighbor)

---

🩺 Personalized Health Guidance:  
- Build on existing treatment plans
- Complement current medications (don't contradict)
- Consider patient's test results and medical timeline
- Provide continuity with previous medical care`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, patientId } = await req.json();
    console.log("Received prompt:", prompt, "Patient ID:", patientId);

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 }
      );
    }

    let patientContext = "";
    
    // If patient ID is provided, fetch patient context
    if (patientId && typeof patientId === "string") {
      try {
        const [patientInfo, medicalHistory, prescriptions, tests] = await Promise.all([
          getPatientInfo(patientId),
          getMedicalHistorylimit(patientId, 3),
          getPrescriptionslimit(patientId, 3),
          getTestslimit(patientId, 3)
        ]);

        patientContext = buildPatientContext(patientInfo, medicalHistory, prescriptions, tests);
        console.log("Built patient context for:", patientInfo?.name || "Unknown patient");
      } catch (error) {
        console.error("Error fetching patient context:", error);
        // Continue without patient context if there's an error
      }
    }
    
    const fullPrompt = `${HEALTH_SYSTEM_PROMPT}${patientContext}\n\nUser Question: ${prompt}\n\nPlease provide a helpful, safe, and personalized response based on the patient's medical context:`;
    console.log("Full prompt for Gemini:", fullPrompt);
    
    const result = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: fullPrompt,
    });
    
    const response = result.text;
    console.log("Raw Gemini response:", response);
    
    const text = response ?? "";

    // Ensure safety disclaimer is present
    const lowerText = text.toLowerCase();
    const containsDisclaimer =
      lowerText.includes("consult a healthcare professional") ||
      lowerText.includes("see a doctor") ||
      lowerText.includes("medical attention");

    const finalResponse = containsDisclaimer
      ? text
      : `${text}\n\n⚕️ **Important**: Given your medical history, please consult your healthcare professional before making any changes to your treatment plan.`;

    return NextResponse.json({ text: finalResponse });
  } catch (error) {
    console.error("Gemini error:", error);

    const fallbackResponse =
      "I'm sorry, I'm having trouble processing your request right now. For any health concerns, please consult with a healthcare professional or visit your nearest health center.";

    return NextResponse.json({ text: fallbackResponse });
  }
}