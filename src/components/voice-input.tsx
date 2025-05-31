"use client";


import { useEffect, useState } from "react";
import VoiceRecorder from "./VoiceRecorder";
import { translateText } from "@/lib/utils";

interface VoiceInputProps {
  language: string;
  onTextChange: (text: string) => void;
  symptomText: string;
}
interface TranslatedTexts {
  tellus: string;
}
export default function VoiceInput({
  language,
  onTextChange,
  symptomText,
}: VoiceInputProps) {
  // const [transcript, setTranscript] = useState("");
  const handleTranscriptChange = (symptomText: string) => {
    onTextChange(symptomText);
  };
  const [translatedTexts, setTranslatedTexts] = useState<TranslatedTexts>({
        tellus: "Tell us about your symptoms",
      });
  useEffect(() => {
        const loadTranslations = async () => {
          if (language === "en") {
            // Keep default English texts
            return
          }
    
          try {
            const textsToTranslate = {
              tellus: "Tell us about your symptoms",
            };
    
            const translatedResults: Partial<TranslatedTexts> = {}
    
            // Translate all texts
            for (const [key, text] of Object.entries(textsToTranslate)) {
              try {
                translatedResults[key as keyof TranslatedTexts] = await translateText(text, language)
              } catch (error) {
                console.error(`Failed to translate ${key}:`, error)
                translatedResults[key as keyof TranslatedTexts] = text // Fallback to English
              }
            }
    
            setTranslatedTexts(translatedResults as TranslatedTexts)
          } catch (error) {
            console.error("Failed to load translations:", error)
          }
        }
    
        loadTranslations()
      }, [language])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{translatedTexts.tellus}</h3>
        {/* <Button variant="outline" size="sm" onClick={speakInstructions}>
          <Volume2 className="h-4 w-4" />
        </Button> */}
      </div>

      <VoiceRecorder
        language={language}
        onTranscriptChange={handleTranscriptChange}
        setTranscript={onTextChange}
        transcript={symptomText}
      />
    </div>
  );
}
