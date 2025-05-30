"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import VoiceRecorder from "@/components/VoiceRecorder";
// import { set } from "react-hook-form";
import ReactMarkdown from "react-markdown";
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [transcript, setTranscript] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get language from URL params (e.g., ?lang=hi-IN&voice=female)
  const language = searchParams.get("lang") || "en-US";
  const voiceGender = searchParams.get("voice") || "female";

  // Initialize welcome message
  useEffect(() => {
    const initializeChat = async () => {
      setIsInitializing(true);
      const welcomeMessageEn =
        "Hello! I'm your health assistant. I'm here to help rural communities with basic health information and guidance. How can I help you today? You can speak or type your question.";

      try {
        let welcomeMessage = welcomeMessageEn;

        // Translate welcome message if not English
        if (language !== "en-US" && language !== "en") {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: welcomeMessageEn,
              target: language.split("-")[0], // Extract language code (hi from hi-IN)
            }),
          });

          if (response.ok) {
            const { translation } = await response.json();
            welcomeMessage = translation;
          }
        }

        const initialMessage: Message = {
          id: "welcome",
          text: welcomeMessage,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages([initialMessage]);
        setIsInitializing(false);

        // Speak the welcome message after a short delay
        setTimeout(() => {
          speakText(welcomeMessage);
        }, 500);
      } catch (error) {
        console.error("Error initializing chat:", error);
        // Fallback to English welcome message
        const fallbackMessage: Message = {
          id: "welcome",
          text: welcomeMessageEn,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([fallbackMessage]);
        setIsInitializing(false);
      }
    };

    // Only initialize once when component mounts
    if (language) {
      initializeChat();
    }
  }, [language]); // Remove isInitialized dependency

  const speakText = async (text: string) => {
    if (!text.trim() || isPlaying) return;

    setIsPlaying(true);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          language: language,
          gender: voiceGender,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing text:", error);
      setIsPlaying(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setTranscript("");
    setIsLoading(true);

    try {
      // Step 1: Translate user message to English (if not already English)
      let translatedInput = currentInput;
      if (language !== "en-US" && language !== "en") {
        const userInputTranslationRes = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: currentInput,
            target: "en",
          }),
        });

        if (userInputTranslationRes.ok) {
          const { translation } = await userInputTranslationRes.json();
          translatedInput = translation;
        }
      }

      // Step 2: Get Gemini response in English
      const geminiRes = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: translatedInput }),
      });

      if (!geminiRes.ok) {
        throw new Error("Failed to get AI response");
      }

      const { text: geminiResponse } = await geminiRes.json();

      // Step 3: Translate Gemini response back to selected language (if not English)
      let translatedResponse = geminiResponse;
      if (language !== "en-US" && language !== "en") {
        const aiTranslationRes = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: geminiResponse,
            target: language.split("-")[0], // Extract language code
          }),
        });

        if (aiTranslationRes.ok) {
          const { translation } = await aiTranslationRes.json();
          translatedResponse = translation;
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: translatedResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak the AI response
      await speakText(translatedResponse);
    } catch (error) {
      console.error("Chat error:", error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscriptChange = (transcript: string) => {
    setInputText(transcript);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getLanguageDisplayName = (lang: string) => {
    const languageNames: { [key: string]: string } = {
      "en-US": "English",
      "hi-IN": "Hindi",
      "bn-IN": "Bengali",
      "te-IN": "Telugu",
      "ta-IN": "Tamil",
      "gu-IN": "Gujarati",
      "kn-IN": "Kannada",
      "ml-IN": "Malayalam",
      "mr-IN": "Marathi",
      "pa-IN": "Punjabi",
      "or-IN": "Odia",
      "as-IN": "Assamese",
    };
    return languageNames[lang] || lang;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Health Assistant</h1>
            <p className="text-sm text-gray-500">
              Language: {getLanguageDisplayName(language)} | Voice:{" "}
              {voiceGender}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-md mx-auto p-4 h-[calc(100vh-200px)] flex flex-col">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {isInitializing && (
              <div className="flex justify-start">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-[80%] ${
                    message.isUser
                      ? "bg-blue-500 text-white"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">
                      {message.isUser ? message.text : (
                        <ReactMarkdown >
                          {message.text}
                        </ReactMarkdown>)}
                    </p>
                    {!message.isUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 px-2 hover:bg-gray-100"
                        onClick={() => speakText(message.text)}
                        disabled={isPlaying}
                      >
                        {isPlaying ? (
                          <VolumeX className="h-3 w-3" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                        <span className="ml-1 text-xs">
                          {isPlaying ? "Playing..." : "Listen"}
                        </span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your health question..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center">
            <VoiceRecorder
              language={language}
              onTranscriptChange={handleTranscriptChange}
              setTranscript={setTranscript}
              transcript={transcript}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
