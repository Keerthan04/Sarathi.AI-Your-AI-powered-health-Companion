"use client";


import VoiceRecorder from "./VoiceRecorder";

interface VoiceInputProps {
  language: string;
  onTextChange: (text: string) => void;
  symptomText: string;
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
 

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tell us about your symptoms</h3>
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
