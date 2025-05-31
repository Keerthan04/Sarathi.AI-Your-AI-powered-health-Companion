"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface VoiceRecorderProps {
  language?: string;
  onTranscriptChange?: (text: string) => void;
  setTranscript: (text: string) => void;
  transcript: string;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

export default function VoiceRecorder({
  language = "en-US",
  onTranscriptChange,
  setTranscript,
  transcript = "",
}: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  //   const [transcript, setTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("language", language);

        try {
          const response = await fetch("/api/stt", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const transcribedText = data.transcript || "No speech detected";
          setTranscript(transcribedText);

          // Pass transcript to parent component
          if (onTranscriptChange) {
            onTranscriptChange(transcribedText);
          }
        } catch (error) {
          console.error("Error transcribing audio:", error);
          setTranscript("Error transcribing audio");
        }

        // Clean up stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const playText = async (text: string) => {
    if (!text.trim()) return;

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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      console.log("audioBlob:", audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("audiourl", audioUrl);
      const audio = new Audio(audioUrl);
      console.log(audio);

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

  return (
    <div className="flex-1 flex flex-col gap-2">
      <Input
        value={transcript}
        onChange={(e) => {
          setTranscript(e.target.value);
          if (onTranscriptChange) {
            onTranscriptChange(e.target.value);
          }
        }}
        placeholder="Speak or type your message..."
        className="text-base w-full h-20"
      />
      <div className="flex items-center justify-between mt-2">
        <Button
          variant={recording ? "destructive" : "outline"}
          size="icon"
          onClick={recording ? stopRecording : startRecording}
          disabled={isPlaying}
        >
          {recording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        {transcript && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => playText(transcript)}
            disabled={recording || isPlaying}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
