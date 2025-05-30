/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tts/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { TextToSpeechClient } from "@google-cloud/text-to-speech";
// import path from "path";

// const keyPath = path.join(process.cwd(), "keys/gcp-key.json");
// const ttsClient = new TextToSpeechClient({
//   keyFilename: keyPath,
// });
import {ttsClient} from "@/lib/googleClient"

// Language to voice mapping
const getVoiceConfig = (language: string) => {
  const voiceMap: Record<
    string,
    { languageCode: string; name: string; ssmlGender: string }
  > = {
    "en-US": {
      languageCode: "en-US",
      name: "en-US-Standard-F",
      ssmlGender: "FEMALE",
    },
    "hi-IN": {
      languageCode: "hi-IN",
      name: "hi-IN-Standard-A",
      ssmlGender: "FEMALE",
    },
    "ta-IN": {
      languageCode: "ta-IN",
      name: "ta-IN-Standard-A",
      ssmlGender: "FEMALE",
    },
    "te-IN": {
      languageCode: "te-IN",
      name: "te-IN-Standard-A",
      ssmlGender: "FEMALE",
    },
    "kn-IN": {
      languageCode: "kn-IN",
      name: "kn-IN-Standard-A",
      ssmlGender: "FEMALE",
    },
    "ml-IN": {
      languageCode: "ml-IN",
      name: "ml-IN-Standard-A",
      ssmlGender: "FEMALE",
    },
  };

  return voiceMap[language] || voiceMap["en-US"];
};

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en-US" }: { text: string; language: string } = await request.json();
    console.log("Received language:", language);
    console.log("Received text:", text);
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const voiceConfig = getVoiceConfig(language);
    console.log("Using voice config:", voiceConfig);
    // Configure the text-to-speech request
    const TTSrequest = {
      input: { text: text },
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.name,
        ssmlGender: voiceConfig.ssmlGender as any,
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    };

    // Perform text-to-speech
    const [response] = await ttsClient.synthesizeSpeech(TTSrequest);

    if (!response.audioContent) {
      return NextResponse.json(
        { error: "Failed to generate speech" },
        { status: 500 }
      );
    }

    // Return audio as blob
    const audioBuffer = response.audioContent as Buffer;
    console.log(audioBuffer);
    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
