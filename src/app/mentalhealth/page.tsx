// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Video,
//   Phone,
//   Heart,
//   ExternalLink,
//   Users,
//   FileText,
// } from "lucide-react";

// interface VideoCallButtonProps {
//   meetLink?: string;
// }

// function VideoCallButton({
//   meetLink = "https://meet.google.com/abc-defg-hij",
// }: VideoCallButtonProps) {
//   const handleClick = () => {
//     window.open(meetLink, "_blank", "noopener,noreferrer");
//   };

//   return (
//     <Card className="mt-8">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Video className="h-5 w-5 text-green-600" />
//           Video Consultation with Family Doctor
//         </CardTitle>
//         <CardDescription>
//           Connect with your healthcare provider through a secure video call
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Button
//           onClick={handleClick}
//           className="w-full bg-green-600 hover:bg-green-700 text-white"
//           size="lg"
//         >
//           <Video className="mr-2 h-4 w-4" />
//           Join Video Call with Doctor
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// export default function MentalHealthCounseling() {
//   const handleHelplineClick = () => {
//     window.open(
//       "https://www.aasra.info/helpline.html",
//       "_blank",
//       "noopener,noreferrer"
//     );
//   };

//   const handlePolicyClick = () => {
//     window.open(
//       "https://www.pib.gov.in/pressreleaseshare.aspx?prid=1576128",
//       "_blank",
//       "noopener,noreferrer"
//     );
//   };

//   const guidelines = [
//     "Talk to someone you trust.",
//     "Practice self-care techniques (meditation, exercise, healthy eating).",
//     "Seek professional help if needed.",
//     "Stay connected with supportive friends and family.",
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
//       <div className="max-w-4xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">
//             Mental Health Counseling
//           </h1>
//           <p className="text-lg text-gray-600">
//             Your mental health matters. Get the support you need.
//           </p>
//         </div>

//         {/* Emergency Helpline */}
//         <Alert className="border-red-200 bg-red-50">
//           <Phone className="h-4 w-4 text-red-600" />
//           <AlertDescription className="text-red-800">
//             <strong>Need immediate help?</strong> Crisis support is available
//             24/7.
//           </AlertDescription>
//         </Alert>

//         <Card className="border-red-200">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-red-700">
//               <Heart className="h-5 w-5" />
//               Emergency Support
//             </CardTitle>
//             <CardDescription>
//               Get immediate access to suicide prevention helpline numbers
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button
//               onClick={handleHelplineClick}
//               variant="destructive"
//               size="lg"
//               className="w-full"
//             >
//               <Phone className="mr-2 h-4 w-4" />
//               Get Suicide Prevention Helpline Numbers
//               <ExternalLink className="ml-2 h-4 w-4" />
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Guidelines */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="h-5 w-5 text-blue-600" />
//               Guidelines for Patients in Distress
//             </CardTitle>
//             <CardDescription>
//               Simple steps you can take to support your mental wellbeing
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-3">
//               {guidelines.map((guideline, index) => (
//                 <li key={index} className="flex items-start gap-3">
//                   <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
//                   <span className="text-gray-700">{guideline}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         {/* Government Policies */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5 text-purple-600" />
//               Indian Government Healthcare Policies
//             </CardTitle>
//             <CardDescription>
//               Learn about rural healthcare initiatives and support programs
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-700 mb-4">
//               Stay informed about government healthcare policies designed to
//               support rural families and communities.
//             </p>
//             <Button
//               onClick={handlePolicyClick}
//               variant="outline"
//               className="w-full"
//             >
//               <FileText className="mr-2 h-4 w-4" />
//               Policies
//               <ExternalLink className="ml-2 h-4 w-4" />
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Video Call Component */}
//         <VideoCallButton meetLink="https://meet.google.com/abc-defg-hij" />

//         {/* Footer */}
//         <div className="text-center text-sm text-gray-500 pt-4">
//           <p>
//             If you&apos;re experiencing a mental health crisis, please reach out for
//             help immediately.
//           </p>
//           <p className="mt-2">
//             Remember: You are not alone, and help is available.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Video,
  Phone,
  Heart,
  ExternalLink,
  Users,
  FileText,
} from "lucide-react";
import { translateText } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
interface TranslatedTexts {
  title: string;
  subtitle: string;
  needHelp: string;
  crisisSupport: string;
  emergencySupport: string;
  emergencyDescription: string;
  helplineButton: string;
  guidelinesTitle: string;
  guidelinesDescription: string;
  guideline1: string;
  guideline2: string;
  guideline3: string;
  guideline4: string;
  policiesTitle: string;
  policiesDescription: string;
  policiesText: string;
  policiesButton: string;
  videoTitle: string;
  videoDescription: string;
  videoButton: string;
  footerText1: string;
  footerText2: string;
  translating: string;
}

interface VideoCallButtonProps {
  meetLink?: string;
  translatedTexts: TranslatedTexts;
}

interface MentalHealthCounselingProps {
  language?: string;
}

function VideoCallButton({
  meetLink = "https://meet.google.com/abc-defg-hij",
  translatedTexts,
}: VideoCallButtonProps) {
  const handleClick = () => {
    window.open(meetLink, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-green-600" />
          {translatedTexts.videoTitle}
        </CardTitle>
        <CardDescription>{translatedTexts.videoDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <Video className="mr-2 h-4 w-4" />
          {translatedTexts.videoButton}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function MentalHealthCounseling({
}: MentalHealthCounselingProps) {
  const searchParams = useSearchParams();
  const language = searchParams.get("lang") || "en-US";
  const [translatedTexts, setTranslatedTexts] = useState<TranslatedTexts>({
    title: "Mental Health Counseling",
    subtitle: "Your mental health matters. Get the support you need.",
    needHelp: "Need immediate help?",
    crisisSupport: "Crisis support is available 24/7.",
    emergencySupport: "Emergency Support",
    emergencyDescription:
      "Get immediate access to suicide prevention helpline numbers",
    helplineButton: "Get Suicide Prevention Helpline Numbers",
    guidelinesTitle: "Guidelines for Patients in Distress",
    guidelinesDescription:
      "Simple steps you can take to support your mental wellbeing",
    guideline1: "Talk to someone you trust.",
    guideline2:
      "Practice self-care techniques (meditation, exercise, healthy eating).",
    guideline3: "Seek professional help if needed.",
    guideline4: "Stay connected with supportive friends and family.",
    policiesTitle: "Indian Government Healthcare Policies",
    policiesDescription:
      "Learn about rural healthcare initiatives and support programs",
    policiesText:
      "Stay informed about government healthcare policies designed to support rural families and communities.",
    policiesButton: "Government Healthcare Policies",
    videoTitle: "Video Consultation with Family Doctor",
    videoDescription:
      "Connect with your healthcare provider through a secure video call",
    videoButton: "Join Video Call with Doctor",
    footerText1:
      "If you're experiencing a mental health crisis, please reach out for help immediately.",
    footerText2: "Remember: You are not alone, and help is available.",
    translating: "Translating...",
  });
  const [isTranslating, setIsTranslating] = useState(false);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      const languageCode = language.split("-")[0].toLowerCase();

      if (languageCode === "en") {
        // Reset to default English texts
        setTranslatedTexts({
          title: "Mental Health Counseling",
          subtitle: "Your mental health matters. Get the support you need.",
          needHelp: "Need immediate help?",
          crisisSupport: "Crisis support is available 24/7.",
          emergencySupport: "Emergency Support",
          emergencyDescription:
            "Get immediate access to suicide prevention helpline numbers",
          helplineButton: "Get Suicide Prevention Helpline Numbers",
          guidelinesTitle: "Guidelines for Patients in Distress",
          guidelinesDescription:
            "Simple steps you can take to support your mental wellbeing",
          guideline1: "Talk to someone you trust.",
          guideline2:
            "Practice self-care techniques (meditation, exercise, healthy eating).",
          guideline3: "Seek professional help if needed.",
          guideline4: "Stay connected with supportive friends and family.",
          policiesTitle: "Indian Government Healthcare Policies",
          policiesDescription:
            "Learn about rural healthcare initiatives and support programs",
          policiesText:
            "Stay informed about government healthcare policies designed to support rural families and communities.",
          policiesButton: "Government Healthcare Policies for Rural Families",
          videoTitle: "Video Consultation with Family Doctor",
          videoDescription:
            "Connect with your healthcare provider through a secure video call",
          videoButton: "Join Video Call with Doctor",
          footerText1:
            "If you're experiencing a mental health crisis, please reach out for help immediately.",
          footerText2: "Remember: You are not alone, and help is available.",
          translating: "Translating...",
        });
        return;
      }

      setIsTranslating(true);

      try {
        const textsToTranslate = {
          title: "Mental Health Counseling",
          subtitle: "Your mental health matters. Get the support you need.",
          needHelp: "Need immediate help?",
          crisisSupport: "Crisis support is available 24/7.",
          emergencySupport: "Emergency Support",
          emergencyDescription:
            "Get immediate access to suicide prevention helpline numbers",
          helplineButton: "Get Suicide Prevention Helpline Numbers",
          guidelinesTitle: "Guidelines for Patients in Distress",
          guidelinesDescription:
            "Simple steps you can take to support your mental wellbeing",
          guideline1: "Talk to someone you trust.",
          guideline2:
            "Practice self-care techniques (meditation, exercise, healthy eating).",
          guideline3: "Seek professional help if needed.",
          guideline4: "Stay connected with supportive friends and family.",
          policiesTitle: "Indian Government Healthcare Policies",
          policiesDescription:
            "Learn about rural healthcare initiatives and support programs",
          policiesText:
            "Stay informed about government healthcare policies designed to support rural families and communities.",
          policiesButton: "Government Healthcare Policies for Rural Families",
          videoTitle: "Video Consultation with Family Doctor",
          videoDescription:
            "Connect with your healthcare provider through a secure video call",
          videoButton: "Join Video Call with Doctor",
          footerText1:
            "If you're experiencing a mental health crisis, please reach out for help immediately.",
          footerText2: "Remember: You are not alone, and help is available.",
          translating: "Translating...",
        };

        const translatedResults: Partial<TranslatedTexts> = {};

        // Translate all texts
        for (const [key, text] of Object.entries(textsToTranslate)) {
          try {
            translatedResults[key as keyof TranslatedTexts] =
              await translateText(text, languageCode);
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
  }, [language]);
  const handleHelplineClick = () => {
    window.open(
      "https://www.aasra.info/helpline.html",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePolicyClick = () => {
    window.open(
      "https://www.pib.gov.in/pressreleaseshare.aspx?prid=1576128",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const guidelines = [
    translatedTexts.guideline1,
    translatedTexts.guideline2,
    translatedTexts.guideline3,
    translatedTexts.guideline4,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Translation Loading Indicator */}
        {isTranslating && (
          <div className="text-sm text-gray-500 text-center">
            {translatedTexts.translating}
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {translatedTexts.title}
          </h1>
          <p className="text-lg text-gray-600">{translatedTexts.subtitle}</p>
        </div>

        {/* Emergency Helpline */}
        <Alert className="border-red-200 bg-red-50">
          <Phone className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{translatedTexts.needHelp}</strong>{" "}
            {translatedTexts.crisisSupport}
          </AlertDescription>
        </Alert>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Heart className="h-5 w-5" />
              {translatedTexts.emergencySupport}
            </CardTitle>
            <CardDescription>
              {translatedTexts.emergencyDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleHelplineClick}
              variant="destructive"
              size="lg"
              className="w-full"
            >
              <Phone className="mr-2 h-4 w-4" />
              {translatedTexts.helplineButton}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {translatedTexts.guidelinesTitle}
            </CardTitle>
            <CardDescription>
              {translatedTexts.guidelinesDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {guidelines.map((guideline, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{guideline}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Government Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              {translatedTexts.policiesTitle}
            </CardTitle>
            <CardDescription>
              {translatedTexts.policiesDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{translatedTexts.policiesText}</p>
            <Button
              onClick={handlePolicyClick}
              variant="outline"
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              {translatedTexts.policiesButton}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Video Call Component */}
        <VideoCallButton
          meetLink="https://meet.google.com/abc-defg-hij"
          translatedTexts={translatedTexts}
        />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>{translatedTexts.footerText1}</p>
          <p className="mt-2">{translatedTexts.footerText2}</p>
        </div>
      </div>
    </div>
  );
}