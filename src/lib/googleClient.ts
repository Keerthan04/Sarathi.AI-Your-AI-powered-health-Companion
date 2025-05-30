// lib/googleClient.ts
import path from "path";
import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { v2 as Translate } from "@google-cloud/translate";

// const keyPath = path.join(process.cwd(),"src", "app", "keys", "gcp-key.json");
// const keyPath = "D:\A My Main Folder\Projects\sarathiai\src\keys\gcp-key.json";

const keyPath = path.join(process.cwd(), "src", "keys", "gcp-key.json");
console.log("Google Cloud Key Path:", keyPath);
export const speechClient = new SpeechClient({
  keyFilename: keyPath,
});

export const ttsClient = new TextToSpeechClient({
  keyFilename: keyPath,
});

export const translateClient = new Translate.Translate({
  keyFilename: keyPath,
});

// Language configurations for Speech-to-Text
export const STT_LANGUAGE_CODES = {
  english: "en-US",
  hindi: "hi-IN",
  tamil: "ta-IN",
  telugu: "te-IN",
  kannada: "kn-IN",
  malayalam: "ml-IN",
  gujarati: "gu-IN",
  marathi: "mr-IN",
  bengali: "bn-IN",
  punjabi: "pa-IN",
} as const;

// Voice configurations for Text-to-Speech
export const TTS_VOICE_CONFIGS = {
  "en-US": {
    male: { name: "en-US-Standard-B", ssmlGender: "MALE" },
    female: { name: "en-US-Standard-F", ssmlGender: "FEMALE" },
  },
  "hi-IN": {
    male: { name: "hi-IN-Standard-B", ssmlGender: "MALE" },
    female: { name: "hi-IN-Standard-A", ssmlGender: "FEMALE" },
  },
  "ta-IN": {
    male: { name: "ta-IN-Standard-B", ssmlGender: "MALE" },
    female: { name: "ta-IN-Standard-A", ssmlGender: "FEMALE" },
  },
  "te-IN": {
    male: { name: "te-IN-Standard-B", ssmlGender: "MALE" },
    female: { name: "te-IN-Standard-A", ssmlGender: "FEMALE" },
  },
  "kn-IN": {
    male: { name: "kn-IN-Standard-B", ssmlGender: "MALE" },
    female: { name: "kn-IN-Standard-A", ssmlGender: "FEMALE" },
  },
  "ml-IN": {
    male: { name: "ml-IN-Standard-B", ssmlGender: "MALE" },
    female: { name: "ml-IN-Standard-A", ssmlGender: "FEMALE" },
  },
} as const;
