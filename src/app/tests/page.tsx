"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TestItem from "@/components/TestItem";
import { Heart, User, Activity, Phone, Mail, MapPin } from "lucide-react";

export default function Tests() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const patientId = searchParams.get("patientId");

    useEffect(() => {
      if (!patientId) return;

      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/patient/${patientId}`);
          const json = await res.json();
          setData(json);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [patientId]);

    if (loading)
      return <div className="text-center mt-10 text-gray-500">Loading...</div>;
    if (!data)
      return (
        <div className="text-center mt-10 text-gray-500">No data found.</div>
      );

    const { patient, tests = [] } = data;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <div className="text-center mb-8">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sarathi.AI</h1>
        <p className="text-gray-600">Rural Health Assistant</p>
        <p className="text-sm text-gray-500 mt-2">
          Your AI-powered health companion
        </p>
      </div>

      {/* Patient Details */}
      <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
            <p className="text-gray-500 text-sm">ID: {patient.patient_id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Age:</span>
            <span className="font-medium">{patient.age} years</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Gender:</span>
            <span className="font-medium capitalize">{patient.gender}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Contact:</span>
            <span className="font-medium">{patient.contact}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{patient.email}</span>
          </div>
        </div>

        <div className="mt-2 flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <span className="text-gray-600">Address:</span>
            <p className="font-medium">{patient.address}</p>
          </div>
        </div>
      </section>
      <h3 className="text-xl font-semibold text-gray-800">Tests</h3>
      {tests.map((test) => (
        <TestItem key={test.id} data={test} />
      ))}
    </div>
  );
}
