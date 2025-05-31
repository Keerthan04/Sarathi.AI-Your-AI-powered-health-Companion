// "use client";

// import React, { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Camera, Upload, X } from "lucide-react";
// import Image from "next/image";

// interface ImageUploadProps {
//   onImageUpload: (imageUrl: string | null) => void;
//   uploadedImage: string | null;
//   category: string;
//   language: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   setAnalysisResult: (result: any) => void;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   analysisResults: any;
// }

// const instructionTranslations: Record<string, Record<string, string>> = {
//   skin: {
//     "en-US":
//       "Take a clear photo of the affected skin area. Ensure good lighting and focus.",
//     "hi-IN":
//       "प्रभावित त्वचा क्षेत्र की एक स्पष्ट फोटो लें। अच्छा प्रकाश और फोकस सुनिश्चित करें।",
//     "kn-IN":
//       "ಪರಿಣಾಮಿತ ಚರ್ಮದ ಭಾಗದ ಸ್ಪಷ್ಟವಾದ ಫೋಟೊ ತೆಗೆದುಕೊಳ್ಳಿ. ಉತ್ತಮ ಬೆಳಕು ಮತ್ತು ಗಮನ ನೀಡುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
//   },
//   eye: {
//     "en-US":
//       "Take a photo of your eye. Make sure the image is clear and well-lit.",
//     "hi-IN":
//       "अपनी आंख की एक फोटो लें। सुनिश्चित करें कि छवि स्पष्ट और अच्छी रोशनी में हो।",
//     "kn-IN":
//       "ನಿಮ್ಮ ಕಣ್ಣಿನ ಫೋಟೊ ತೆಗೆದುಕೊಳ್ಳಿ. ಚಿತ್ರ ಸ್ಪಷ್ಟವಾಗಿರಲಿ ಮತ್ತು ಬೆಳಕಿನಲ್ಲಿರಲಿ.",
//   },
//   dental: {
//     "en-US":
//       "Take a photo of your teeth or gums. Open your mouth wide for a clear view.",
//     "hi-IN":
//       "अपने दांतों या मसूड़ों की एक फोटो लें। स्पष्ट दृश्य के लिए अपना मुंह चौड़ा खोलें।",
//     "kn-IN":
//       "ನಿಮ್ಮ ಹಲ್ಲುಗಳು ಅಥವಾ ಹಲ್ಲಿನ ಮಾಂಸಕಟ್ಟಿನ ಫೋಟೊ ತೆಗೆದುಕೊಳ್ಳಿ. ಸ್ಪಷ್ಟ ದೃಶ್ಯಕ್ಕಾಗಿ ಬಾಯಿಯನ್ನು ಅಗಲವಾಗಿ ತೆರೆಯಿರಿ.",
//   },
//   ear: {
//     "en-US":
//       "Take a photo of your ear. Use good lighting to show the affected area.",
//     "hi-IN":
//       "अपने कान की एक फोटो लें। प्रभावित क्षेत्र दिखाने के लिए अच्छी रोशनी का उपयोग करें।",
//     "kn-IN":
//       "ನಿಮ್ಮ ಕಿವಿಯ ಫೋಟೊ ತೆಗೆದುಕೊಳ್ಳಿ. ಪರಿಣಾಮಿತ ಪ್ರದೇಶವನ್ನು ತೋರಿಸಲು ಉತ್ತಮ ಬೆಳಕು ಬಳಸಿ.",
//   },
//   default: {
//     "en-US": "Take a clear photo of the affected area.",
//     "hi-IN": "प्रभावित क्षेत्र की एक स्पष्ट फोटो लें।",
//     "kn-IN": "ಪರಿಣಾಮಿತ ಪ್ರದೇಶದ ಸ್ಪಷ್ಟವಾದ ಫೋಟೊ ತೆಗೆದುಕೊಳ್ಳಿ.",
//   },
// };

// export default function ImageUpload({
//   onImageUpload,
//   uploadedImage,
//   category,
//   language,
//   setAnalysisResult,
//   analysisResults
// }: ImageUploadProps) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   // const [analysisResult, setAnalysisResult] = useState<string | null>(null);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const getTranslatedInstruction = () => {
//     return (
//       instructionTranslations[category]?.[language] ||
//       instructionTranslations["default"][language] ||
//       instructionTranslations["default"]["en-US"]
//     );
//   };

//   const handleFileSelect = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Create preview URL and set it immediately
//       const previewUrl = URL.createObjectURL(file);
//       setSelectedFile(file);
//       onImageUpload(previewUrl); // This will show the image immediately

//       // Start analysis
//       setIsAnalyzing(true);
//       setAnalysisResult(null); // Clear previous results

//       const formData = new FormData();
//       formData.append("file", file);
//       console.log("Category in image upload:", category);
//       formData.append("category", category); // Add category to the request

//       try {
//         const response = await fetch("/api/cnnmodel", {
//           method: "POST",
//           body: formData,
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (data.error) {
//           throw new Error(data.error);
//         }

//         setAnalysisResult(data?.predicted_class || "No result received.");
//       } catch (error) {
//         console.error("Error sending image:", error);
//         setAnalysisResult(
//           `Error analyzing image: ${
//             typeof error === "object" && error !== null && "message" in error
//               ? (error as { message?: string }).message
//               : "Unknown error"
//           }`
//         );
//       } finally {
//         setIsAnalyzing(false);
//       }
//     }
//   };

//   const removeImage = () => {
//     // Clean up the object URL to prevent memory leaks
//     if (uploadedImage && uploadedImage.startsWith("blob:")) {
//       URL.revokeObjectURL(uploadedImage);
//     }

//     onImageUpload(null);
//     setSelectedFile(null);
//     setAnalysisResult(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleUploadDifferentPhoto = () => {
//     // Clean up previous object URL
//     if (uploadedImage && uploadedImage.startsWith("blob:")) {
//       URL.revokeObjectURL(uploadedImage);
//     }

//     setSelectedFile(null);
//     setAnalysisResult(null);
//     onImageUpload(null);

//     // Trigger file input
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <h3 className="text-lg font-medium mb-2">Upload Image for Analysis</h3>
//         <p className="text-sm text-gray-600 mb-4">
//           {getTranslatedInstruction()}
//         </p>
//       </div>

//       {!uploadedImage ? (
//         <div className="space-y-3">
//           <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
//             <CardContent className="p-8 text-center">
//               <div className="space-y-4">
//                 <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//                   <Camera className="h-8 w-8 text-gray-400" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium">Upload or take a photo</h4>
//                   <p className="text-sm text-gray-500">
//                     Clear images help our AI provide better analysis
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="grid grid-cols-2 gap-3">
//             <Button
//               variant="outline"
//               className="h-12"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <Upload className="h-4 w-4 mr-2" />
//               Upload Photo
//             </Button>
//             <Button
//               variant="outline"
//               className="h-12"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <Camera className="h-4 w-4 mr-2" />
//               Take Photo
//             </Button>
//           </div>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             capture="environment"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <Card>
//             <CardContent className="p-4">
//               <div className="relative">
//                 <Image
//                   src={uploadedImage}
//                   alt="Uploaded symptom image"
//                   width={400}
//                   height={300}
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   className="absolute top-2 right-2"
//                   onClick={removeImage}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {isAnalyzing && (
//             <Card className="bg-blue-50 border-blue-200">
//               <CardContent className="p-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                   <div>
//                     <p className="font-medium text-blue-800">
//                       Analyzing image...
//                     </p>
//                     <p className="text-sm text-blue-600">
//                       Our AI is examining your photo
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {analysisResults && !isAnalyzing && (
//             <Card
//               className={`border-2 ${
//                 analysisResults.includes("Error")
//                   ? "border-red-200 bg-red-50"
//                   : "border-green-200 bg-green-50"
//               }`}
//             >
//               <CardContent className="p-4">
//                 <p
//                   className={`font-semibold ${
//                     analysisResults.includes("Error")
//                       ? "text-red-700"
//                       : "text-green-700"
//                   }`}
//                 >
//                   {analysisResults.includes("Error")
//                     ? "Error:"
//                     : "Analysis Result:"}
//                 </p>
//                 <p
//                   className={`text-sm ${
//                     analysisResults.includes("Error")
//                       ? "text-red-600"
//                       : "text-green-600"
//                   }`}
//                 >
//                   {analysisResults.includes("Error")
//                     ? "Error:"
//                     : "Analysis Result:"}
//                 </p>
//                 <p
//                   className={`text-sm ${
//                     analysisResults.includes("Error")
//                       ? "text-red-600"
//                       : "text-green-600"
//                   }`}
//                 >
//                   {analysisResults}
//                 </p>
//               </CardContent>
//             </Card>
//           )}

//           <Button
//             variant="outline"
//             onClick={handleUploadDifferentPhoto}
//             className="w-full"
//           >
//             Upload Different Photo
//           </Button>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             capture="environment"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";
import Image from "next/image";
import { translateText } from "@/lib/utils";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string | null) => void;
  uploadedImage: string | null;
  category: string;
  language: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAnalysisResult: (result: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  analysisResults: any;
}

const instructionTranslations: Record<string, Record<string, string>> = {
  skin: {
    "en-US":
      "Take a clear photo of the affected skin area. Ensure good lighting and focus.",
  },
  eye: {
    "en-US":
      "Take a photo of your eye. Make sure the image is clear and well-lit.",
  },
  dental: {
    "en-US":
      "Take a photo of your teeth or gums. Open your mouth wide for a clear view.",
  },
  ear: {
    "en-US":
      "Take a photo of your ear. Use good lighting to show the affected area.",
  },
  default: {
    "en-US": "Take a clear photo of the affected area.",
  },
};

interface TranslatedTexts {
  uploadTitle: string;
  uploadInstruction: string;
  uploadOrTakePhoto: string;
  clearImagesHelp: string;
  uploadPhoto: string;
  takePhoto: string;
  analyzingImage: string;
  aiExamining: string;
  analysisResult: string;
  error: string;
  uploadDifferentPhoto: string;
}

export default function ImageUpload({
  onImageUpload,
  uploadedImage,
  category,
  language,
  setAnalysisResult,
  analysisResults,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [translatedTexts, setTranslatedTexts] = useState<TranslatedTexts>({
    uploadTitle: "Upload Image for Analysis",
    uploadInstruction:
      instructionTranslations[category]?.["en-US"] ||
      instructionTranslations["default"]["en-US"],
    uploadOrTakePhoto: "Upload or take a photo",
    clearImagesHelp: "Clear images help our AI provide better analysis",
    uploadPhoto: "Upload Photo",
    takePhoto: "Take Photo",
    analyzingImage: "Analyzing image...",
    aiExamining: "Our AI is examining your photo",
    analysisResult: "Analysis Result:",
    error: "Error:",
    uploadDifferentPhoto: "Upload Different Photo",
  });
  const [isTranslating, setIsTranslating] = useState(false);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      const languageCode = language.split("-")[0].toLowerCase();

      if (languageCode === "en") {
        // Reset to default English texts
        setTranslatedTexts({
          uploadTitle: "Upload Image for Analysis",
          uploadInstruction:
            instructionTranslations[category]?.["en-US"] ||
            instructionTranslations["default"]["en-US"],
          uploadOrTakePhoto: "Upload or take a photo",
          clearImagesHelp: "Clear images help our AI provide better analysis",
          uploadPhoto: "Upload Photo",
          takePhoto: "Take Photo",
          analyzingImage: "Analyzing image...",
          aiExamining: "Our AI is examining your photo",
          analysisResult: "Analysis Result:",
          error: "Error:",
          uploadDifferentPhoto: "Upload Different Photo",
        });
        return;
      }

      setIsTranslating(true);

      try {
        const textsToTranslate = {
          uploadTitle: "Upload Image for Analysis",
          uploadInstruction:
            instructionTranslations[category]?.["en-US"] ||
            instructionTranslations["default"]["en-US"],
          uploadOrTakePhoto: "Upload or take a photo",
          clearImagesHelp: "Clear images help our AI provide better analysis",
          uploadPhoto: "Upload Photo",
          takePhoto: "Take Photo",
          analyzingImage: "Analyzing image...",
          aiExamining: "Our AI is examining your photo",
          analysisResult: "Analysis Result:",
          error: "Error:",
          uploadDifferentPhoto: "Upload Different Photo",
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
  }, [language, category]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL and set it immediately
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      onImageUpload(previewUrl); // This will show the image immediately

      // Start analysis
      setIsAnalyzing(true);
      setAnalysisResult(null); // Clear previous results

      const formData = new FormData();
      formData.append("file", file);
      console.log("Category in image upload:", category);
      formData.append("category", category); // Add category to the request

      try {
        const response = await fetch("/api/cnnmodel", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setAnalysisResult(data?.predicted_class || "No result received.");
      } catch (error) {
        console.error("Error sending image:", error);
        setAnalysisResult(
          `Error analyzing image: ${
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message
              : "Unknown error"
          }`
        );
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const removeImage = () => {
    // Clean up the object URL to prevent memory leaks
    if (uploadedImage && uploadedImage.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedImage);
    }

    onImageUpload(null);
    setSelectedFile(null);
    setAnalysisResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadDifferentPhoto = () => {
    // Clean up previous object URL
    if (uploadedImage && uploadedImage.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedImage);
    }

    setSelectedFile(null);
    setAnalysisResult(null);
    onImageUpload(null);

    // Trigger file input
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">
          {translatedTexts.uploadTitle}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {translatedTexts.uploadInstruction}
        </p>
        {isTranslating && (
          <p className="text-sm text-gray-500 mb-2">Translating...</p>
        )}
      </div>

      {!uploadedImage ? (
        <div className="space-y-3">
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {translatedTexts.uploadOrTakePhoto}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {translatedTexts.clearImagesHelp}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTranslating}
            >
              <Upload className="h-4 w-4 mr-2" />
              {translatedTexts.uploadPhoto}
            </Button>
            <Button
              variant="outline"
              className="h-12"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTranslating}
            >
              <Camera className="h-4 w-4 mr-2" />
              {translatedTexts.takePhoto}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Image
                  src={uploadedImage}
                  alt="Uploaded symptom image"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {isAnalyzing && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="font-medium text-blue-800">
                      {translatedTexts.analyzingImage}
                    </p>
                    <p className="text-sm text-blue-600">
                      {translatedTexts.aiExamining}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisResults && !isAnalyzing && (
            <Card
              className={`border-2 ${
                analysisResults.includes("Error")
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <CardContent className="p-4">
                <p
                  className={`font-semibold ${
                    analysisResults.includes("Error")
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {analysisResults.includes("Error")
                    ? translatedTexts.error
                    : translatedTexts.analysisResult}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    analysisResults.includes("Error")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {analysisResults}
                </p>
              </CardContent>
            </Card>
          )}

          <Button
            variant="outline"
            onClick={handleUploadDifferentPhoto}
            className="w-full"
            disabled={isTranslating}
          >
            {translatedTexts.uploadDifferentPhoto}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}