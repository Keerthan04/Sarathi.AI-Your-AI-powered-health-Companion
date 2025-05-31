// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { StatCard } from "@/components/StatCard";
// import {
//   User,
//   Activity,
//   Phone,
//   Mail,
//   MapPin,
//   FileText,
//   Pill,
//   TestTube,
// } from "lucide-react";

// export default function PatientInfoClient() {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const searchParams = useSearchParams();
//   const patientId = searchParams.get("patientId");
//   const router = useRouter();

//   useEffect(() => {
//     if (!patientId) return;

//     const fetchData = async () => {
//       setLoading(true);
//       const res = await fetch(`/api/patient/${patientId}`);
//       const json = await res.json();
//       setData(json);
//       setLoading(false);
//     };

//     fetchData();
//   }, [patientId]);

//   if (loading) return <div>Loading...</div>;
//   if (!data) return <div>No data found.</div>;

//   const { patient, history, prescriptions, tests } = data;

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-2xl p-6 shadow-sm">
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
//             <User className="w-8 h-8 text-blue-600" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
//             <p className="text-gray-600">Patient ID: {patient.patient_id}</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div className="flex items-center space-x-2">
//             <Activity className="w-4 h-4 text-gray-400" />
//             <span className="text-gray-600">Age:</span>
//             <span className="font-medium">{patient.age} years</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <User className="w-4 h-4 text-gray-400" />
//             <span className="text-gray-600">Gender:</span>
//             <span className="font-medium capitalize">{patient.gender}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Phone className="w-4 h-4 text-gray-400" />
//             <span className="text-gray-600">Contact:</span>
//             <span className="font-medium">{patient.contact}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Mail className="w-4 h-4 text-gray-400" />
//             <span className="text-gray-600">Email:</span>
//             <span className="font-medium">{patient.email}</span>
//           </div>
//         </div>

//         <div className="mt-4 flex items-start space-x-2">
//           <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
//           <div>
//             <span className="text-gray-600">Address:</span>
//             <p className="font-medium">{patient.address}</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard
//           icon={FileText}
//           title="Medical History"
//           count={history.length}
//           color="from-blue-500 to-blue-600"
//           onClick={() => router.push(`/medicalhistory?patientId=${patientId}`)}
//         />
//         <StatCard
//           icon={Pill}
//           title="Prescriptions"
//           count={prescriptions.length}
//           color="from-green-500 to-green-600"
//           onClick={() => router.push(`/prescriptions?patientId=${patientId}`)}
//         />
//         <StatCard
//           icon={TestTube}
//           title="Tests"
//           count={tests.length}
//           color="from-purple-500 to-purple-600"
//           onClick={() => router.push(`/tests?patientId=${patientId}`)}
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StatCard } from "@/components/StatCard";
import {
  User,
  Activity,
  Phone,
  Mail,
  MapPin,
  FileText,
  Pill,
  TestTube,
} from "lucide-react";
import { translateText } from "@/lib/utils";

interface TranslatedTexts {
  loading: string;
  noDataFound: string;
  patientId: string;
  age: string;
  years: string;
  gender: string;
  contact: string;
  email: string;
  address: string;
  medicalHistory: string;
  prescriptions: string;
  tests: string;
}

interface PatientInfoClientProps {
  language?: string;
}

export default function PatientInfoClient({
  language = "en-US",
}: PatientInfoClientProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [translatedTexts, setTranslatedTexts] = useState<TranslatedTexts>({
    loading: "Loading...",
    noDataFound: "No data found.",
    patientId: "Patient ID",
    age: "Age",
    years: "years",
    gender: "Gender",
    contact: "Contact",
    email: "Email",
    address: "Address",
    medicalHistory: "Medical History",
    prescriptions: "Prescriptions",
    tests: "Tests",
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const router = useRouter();

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      const languageCode = language.split("-")[0].toLowerCase();

      if (languageCode === "en") {
        // Reset to default English texts
        setTranslatedTexts({
          loading: "Loading...",
          noDataFound: "No data found.",
          patientId: "Patient ID",
          age: "Age",
          years: "years",
          gender: "Gender",
          contact: "Contact",
          email: "Email",
          address: "Address",
          medicalHistory: "Medical History",
          prescriptions: "Prescriptions",
          tests: "Tests",
        });
        return;
      }

      setIsTranslating(true);

      try {
        const textsToTranslate = {
          loading: "Loading...",
          noDataFound: "No data found.",
          patientId: "Patient ID",
          age: "Age",
          years: "years",
          gender: "Gender",
          contact: "Contact",
          email: "Email",
          address: "Address",
          medicalHistory: "Medical History",
          prescriptions: "Prescriptions",
          tests: "Tests",
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

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/patient/${patientId}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchData();
  }, [patientId]);

  if (loading) return <div>{translatedTexts.loading}</div>;
  if (!data) return <div>{translatedTexts.noDataFound}</div>;

  const { patient, history, prescriptions, tests } = data;

  return (
    <div className="space-y-6">
      {isTranslating && (
        <div className="text-sm text-gray-500 text-center">Translating...</div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
            <p className="text-gray-600">
              {translatedTexts.patientId}: {patient.patient_id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{translatedTexts.age}:</span>
            <span className="font-medium">
              {patient.age} {translatedTexts.years}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{translatedTexts.gender}:</span>
            <span className="font-medium capitalize">{patient.gender}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{translatedTexts.contact}:</span>
            <span className="font-medium">{patient.contact}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{translatedTexts.email}:</span>
            <span className="font-medium">{patient.email}</span>
          </div>
        </div>

        <div className="mt-4 flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <span className="text-gray-600">{translatedTexts.address}:</span>
            <p className="font-medium">{patient.address}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FileText}
          title={translatedTexts.medicalHistory}
          count={history.length}
          color="from-blue-500 to-blue-600"
          onClick={() => router.push(`/medicalhistory?patientId=${patientId}`)}
        />
        <StatCard
          icon={Pill}
          title={translatedTexts.prescriptions}
          count={prescriptions.length}
          color="from-green-500 to-green-600"
          onClick={() => router.push(`/prescriptions?patientId=${patientId}`)}
        />
        <StatCard
          icon={TestTube}
          title={translatedTexts.tests}
          count={tests.length}
          color="from-purple-500 to-purple-600"
          onClick={() => router.push(`/tests?patientId=${patientId}`)}
        />
      </div>
    </div>
  );
}