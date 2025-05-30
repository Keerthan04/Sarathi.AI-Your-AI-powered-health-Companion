// app/api/stt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { speechClient } from "@/lib/googleClient";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const language = (formData.get("language") as string) || "en-US";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert audio file to buffer
    const audioBytes = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(audioBytes);

    // Configure the speech recognition request
    const STTrequest = {
      audio: {
        content: audioBuffer.toString("base64"),
      },
      config: {
        encoding: "WEBM_OPUS" as const,
        sampleRateHertz: 48000,
        languageCode: language,
        enableAutomaticPunctuation: true,
        model: "latest_long",
        useEnhanced: true,
      },
    };

    // Perform speech recognition
    const [response] = await speechClient.recognize(STTrequest);

    if (!response.results || response.results.length === 0) {
      return NextResponse.json({ transcript: "" });
    }

    // Extract transcript from the first result
    const transcript = response.results
      .map((result) => result.alternatives?.[0]?.transcript || "")
      .join(" ")
      .trim();

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
