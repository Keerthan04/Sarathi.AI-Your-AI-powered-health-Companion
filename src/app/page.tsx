"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Stethoscope, Globe, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

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

export default function WelcomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const router = useRouter();

  const handleChatbot = () => {
    // router.push(`/chatbot?lang=${selectedLanguage}`)
    router.push(`/chatbot?lang=${selectedLanguage}&voice=female`);
  }

  const handleSymptomChecker = () => {
    router.push(`/symptom-checker?lang=${selectedLanguage}`)
  }

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
            Sarathi.AI
          </h1>
          <h1 className="text-xl font-bold text-gray-800">
            Rural Health Assistant
          </h1>
          <p className="text-gray-600 text-lg">
            Your AI-powered health companion
          </p>
        </div>

        {/* Language Selection */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Globe className="h-5 w-5" />
              Choose Your Language
            </CardTitle>
            <CardDescription>
              Select your preferred language for better assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
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
          </CardContent>
        </Card>

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
                    Talk to Health Bot
                  </h3>
                  <p className="text-gray-600">
                    Ask questions about your health concerns
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
                    Symptom Checker
                  </h3>
                  <p className="text-gray-600">
                    Check your symptoms with AI assistance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>This app provides health information only.</p>
          <p>Always consult a doctor for medical advice.</p>
        </div>
      </div>
    </div>
  );
}
