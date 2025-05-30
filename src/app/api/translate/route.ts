// /app/api/translate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as TranslateV2 } from "@google-cloud/translate";

const { Translate } = TranslateV2;

const translate = new Translate({
  key: process.env.GOOGLE_API_KEY,
});

// Language code mapping for better compatibility
const LANGUAGE_CODE_MAP: { [key: string]: string } = {
  "en-US": "en",
  en: "en",
  "hi-IN": "hi",
  hi: "hi",
  "bn-IN": "bn",
  bn: "bn",
  "te-IN": "te",
  te: "te",
  "ta-IN": "ta",
  ta: "ta",
  "gu-IN": "gu",
  gu: "gu",
  "kn-IN": "kn",
  kn: "kn",
  "ml-IN": "ml",
  ml: "ml",
  "mr-IN": "mr",
  mr: "mr",
  "pa-IN": "pa",
  pa: "pa",
  "or-IN": "or",
  or: "or",
  "as-IN": "as",
  as: "as",
  "ur-IN": "ur",
  ur: "ur",
};

export async function POST(req: NextRequest) {
  try {
    const { text, target } = await req.json();

    // Validate input
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid text provided" },
        { status: 400 }
      );
    }

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { error: "Invalid target language provided" },
        { status: 400 }
      );
    }

    // Normalize language code
    const normalizedTarget = LANGUAGE_CODE_MAP[target] || target;

    // Skip translation if target is English and text appears to be English
    if (normalizedTarget === "en" && isLikelyEnglish(text)) {
      return NextResponse.json({ translation: text });
    }

    // Perform translation
    const [translation] = await translate.translate(text, {
      to: normalizedTarget,
      format: "text",
    });

    return NextResponse.json({
      translation: translation || text, // Fallback to original text if translation fails
    });
  } catch (error) {
    console.error("Translation error:", error);

    // Return original text as fallback
    const { text } = await req.json().catch(() => ({ text: "" }));

    return NextResponse.json({
      translation: text,
      error: "Translation service temporarily unavailable",
    });
  }
}

// Simple heuristic to detect if text is likely English
function isLikelyEnglish(text: string): boolean {
  const englishWords = [
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "you",
    "i",
    "a",
    "an",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
  ];

  const words = text.toLowerCase().split(/\s+/);
  const englishWordCount = words.filter((word) =>
    englishWords.includes(word)
  ).length;

  return englishWordCount / words.length > 0.3; // If 30% or more words are common English words
}
