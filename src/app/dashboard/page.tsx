// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { MessageCircle, Stethoscope, Globe, Heart } from "lucide-react"
// import { useRouter } from "next/navigation"

// const languages = [
//   { code: "en-US", name: "English", native: "English" },
//   { code: "hi-IN", name: "Hindi", native: "हिंदी" },
//   { code: "bn-IN", name: "Bengali", native: "বাংলা" },
//   { code: "te-IN", name: "Telugu", native: "తెలుగు" },
//   { code: "ta-IN", name: "Tamil", native: "தமிழ்" },
//   { code: "mr-IN", name: "Marathi", native: "मराठी" },
//   { code: "kn-IN", name: "Kannada", native: "ಕನ್ನಡ" },
//   { code: "ml-IN", name: "Malayalam", native: "മലയാളം" },
//   { code: "gu-IN", name: "Gujarati", native: "ગુજરાતી" },
//   { code: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
//   { code: "or-IN", name: "Odia", native: "ଓଡ଼ିଆ" },
//   { code: "as-IN", name: "Assamese", native: "অসমীয়া" },
//   { code: "ur-IN", name: "Urdu", native: "اردو" },
// ];

// export default function WelcomePage() {
//   const [selectedLanguage, setSelectedLanguage] = useState("en-US");
//   const router = useRouter();

//   const handleChatbot = () => {
//     // router.push(`/chatbot?lang=${selectedLanguage}`)
//     router.push(`/chatbot?lang=${selectedLanguage}&voice=female`);
//   }

//   const handleSymptomChecker = () => {
//     router.push(`/symptom-checker?lang=${selectedLanguage}`)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
//       <div className="max-w-md mx-auto space-y-6 pt-8">
//         {/* Header */}
//         <div className="text-center space-y-4">
//           <div className="flex justify-center">
//             <div className="bg-white p-4 rounded-full shadow-lg">
//               <Heart className="h-12 w-12 text-red-500" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800">
//             Sarathi.AI
//           </h1>
//           <h1 className="text-xl font-bold text-gray-800">
//             Rural Health Assistant
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Your AI-powered health companion
//           </p>
//         </div>

//         {/* Language Selection */}
//         <Card className="shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="flex items-center justify-center gap-2">
//               <Globe className="h-5 w-5" />
//               Choose Your Language
//             </CardTitle>
//             <CardDescription>
//               Select your preferred language for better assistance
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Select
//               value={selectedLanguage}
//               onValueChange={setSelectedLanguage}
//             >
//               <SelectTrigger className="w-full text-lg h-12">
//                 <SelectValue placeholder="Select language" />
//               </SelectTrigger>
//               <SelectContent>
//                 {languages.map((lang) => (
//                   <SelectItem
//                     key={lang.code}
//                     value={lang.code}
//                     className="text-lg"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <span className="font-medium">{lang.native}</span>
//                       <span className="text-sm text-gray-500">{lang.name}</span>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </CardContent>
//         </Card>

//         {/* Main Options */}
//         <div className="space-y-4">
//           <Card
//             className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
//             onClick={handleChatbot}
//           >
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-blue-100 p-3 rounded-full">
//                   <MessageCircle className="h-8 w-8 text-blue-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-xl font-semibold text-gray-800">
//                     Talk to Health Bot
//                   </h3>
//                   <p className="text-gray-600">
//                     Ask questions about your health concerns
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card
//             className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
//             onClick={handleSymptomChecker}
//           >
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-green-100 p-3 rounded-full">
//                   <Stethoscope className="h-8 w-8 text-green-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-xl font-semibold text-gray-800">
//                     Symptom Checker
//                   </h3>
//                   <p className="text-gray-600">
//                     Check your symptoms with AI assistance
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Footer */}
//         <div className="text-center text-sm text-gray-500 pt-4">
//           <p>This app provides health information only.</p>
//           <p>Always consult a doctor for medical advice.</p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Stethoscope, Globe, Heart, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { translateText } from "@/lib/utils";
// import RenderPatientInfo from "@/components/renderPatientInfo";
import PatientInfoClient from "@/components/renderPatientInfo";

const languages = [
  { code: "en-US", name: "English", native: "English" },
  { code: "hi-IN", name: "Hindi", native: "हिंदी" },
  { code: "bn-IN", name: "Bengali", native: "বাংলা" },
  { code: "te-IN", name: "Telugu", native: "తెలుగు" },
  { code: "ta-IN", name: "Tamil", native: "தமிழ்" },
  { code: "mr-IN", name: "Marathi", native: "मराठी" },
  { code: "kn-IN", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml-IN", name: "Malayalam", native: "മലയാളം" },
  { code: "gu-IN", name: "Gujarati", native: "ગુજરાતી" },
  { code: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or-IN", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as-IN", name: "Assamese", native: "অসমীয়া" },
  { code: "ur-IN", name: "Urdu", native: "اردو" },
];

interface TranslatedTexts {
  appTitle: string;
  subtitle: string;
  tagline: string;
  chooseLanguage: string;
  languageDescription: string;
  talkToHealthBot: string;
  healthBotDescription: string;
  symptomChecker: string;
  symptomCheckerDescription: string;
  disclaimer1: string;
  disclaimer2: string;
  mentalHealthDescription: string;
  mentalHealthTitle?: string;
}

export default function WelcomePage() {
  // const id = localStorage.getItem("patientId");
  
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [translatedTexts, setTranslatedTexts] = useState<TranslatedTexts>({
    appTitle: "Sarathi.AI",
    subtitle: "Rural Health Assistant",
    tagline: "Your AI-powered health companion",
    chooseLanguage: "Choose Your Language",
    languageDescription: "Select your preferred language for better assistance",
    talkToHealthBot: "Talk to Health Bot",
    healthBotDescription: "Ask questions about your health concerns",
    symptomChecker: "Symptom Checker",
    symptomCheckerDescription: "Check your symptoms with AI assistance",
    disclaimer1: "This app provides health information only.",
    disclaimer2: "Always consult a doctor for medical advice.",
    mentalHealthDescription: "Get support for your mental well-being",
    mentalHealthTitle: "Mental Health",
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const router = useRouter();
  

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      const languageCode = selectedLanguage.split("-")[0].toLowerCase();

      if (languageCode === "en") {
        // Reset to default English texts
        setTranslatedTexts({
          appTitle: "Sarathi.AI",
          subtitle: "Rural Health Assistant",
          tagline: "Your AI-powered health companion",
          chooseLanguage: "Choose Your Language",
          languageDescription:
            "Select your preferred language for better assistance",
          talkToHealthBot: "Talk to Health Bot",
          healthBotDescription: "Ask questions about your health concerns",
          symptomChecker: "Symptom Checker",
          symptomCheckerDescription: "Check your symptoms with AI assistance",
          disclaimer1: "This app provides health information only.",
          disclaimer2: "Always consult a doctor for medical advice.",
          mentalHealthDescription: "Get support for your mental well-being",
          mentalHealthTitle: "Mental Health",
        });
        return;
      }

      setIsTranslating(true);

      try {
        const textsToTranslate = {
          appTitle: "Sarathi.AI",
          subtitle: "Rural Health Assistant",
          tagline: "Your AI-powered health companion",
          chooseLanguage: "Choose Your Language",
          languageDescription:
            "Select your preferred language for better assistance",
          talkToHealthBot: "Talk to Health Bot",
          healthBotDescription: "Ask questions about your health concerns",
          symptomChecker: "Symptom Checker",
          symptomCheckerDescription: "Check your symptoms with AI assistance",
          disclaimer1: "This app provides health information only.",
          disclaimer2: "Always consult a doctor for medical advice.",
        };

        const translatedResults: Partial<TranslatedTexts> = {};

        // Translate all texts
        for (const [key, text] of Object.entries(textsToTranslate)) {
          try {
            // Keep app name as is, translate others
            if (key === "appTitle") {
              translatedResults[key as keyof TranslatedTexts] = text;
            } else {
              translatedResults[key as keyof TranslatedTexts] =
                await translateText(text, languageCode);
            }
          } catch (error) {
            console.error(`Failed to translate ${key}:`, error);
            translatedResults[key as keyof TranslatedTexts] = text; // Fallback to English
          }
        }

        setTranslatedTexts(translatedResults as TranslatedTexts);
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsTranslating(false);
      }
    };

    loadTranslations();
  }, [selectedLanguage]);

  const handleChatbot = () => {
    router.push(`/chatbot?lang=${selectedLanguage}&voice=female&patientId=${localStorage.getItem("patientId")}`);
  };

  const handleSymptomChecker = () => {
    router.push(`/symptom-checker?lang=${selectedLanguage}&patientId=${localStorage.getItem("patientId")}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {translatedTexts.appTitle}
          </h1>
          <h1 className="text-xl font-bold text-gray-800">
            {translatedTexts.subtitle}
          </h1>
          <p className="text-gray-600 text-lg">{translatedTexts.tagline}</p>
        </div>

        {/* Language Selection */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Globe className="h-5 w-5" />
              {translatedTexts.chooseLanguage}
            </CardTitle>
            <CardDescription>
              {translatedTexts.languageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              disabled={isTranslating}
            >
              <SelectTrigger className="w-full text-lg h-12">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem
                    key={lang.code}
                    value={lang.code}
                    className="text-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{lang.native}</span>
                      <span className="text-sm text-gray-500">{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isTranslating && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Translating...
              </p>
            )}
          </CardContent>
        </Card>
        {/* Patient Info */}
        <PatientInfoClient language={selectedLanguage}/>
        {/* Main Options */}
        <div className="space-y-4">
          <Card
            className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={handleChatbot}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {translatedTexts.talkToHealthBot}
                  </h3>
                  <p className="text-gray-600">
                    {translatedTexts.healthBotDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={handleSymptomChecker}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {translatedTexts.symptomChecker}
                  </h3>
                  <p className="text-gray-600">
                    {translatedTexts.symptomCheckerDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push(`/mentalhealth?lang=${selectedLanguage}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {translatedTexts.mentalHealthTitle || "Mental Health"}
                  </h3>
                  <p className="text-gray-600">
                    {translatedTexts.mentalHealthDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>{translatedTexts.disclaimer1}</p>
          <p>{translatedTexts.disclaimer2}</p>
        </div>
      </div>
    </div>
  );
}