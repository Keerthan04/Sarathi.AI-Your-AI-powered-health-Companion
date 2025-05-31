import {
  getMedicalHistory,
  getPatientInfo,
  getPrescriptions,
  getTests,
} from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const patientId = await params.id;

  try {
    const [patient, history, prescriptions, tests] = await Promise.all([
      getPatientInfo(patientId),
      getMedicalHistory(patientId),
      getPrescriptions(patientId),
      getTests(patientId),
    ]);

    return NextResponse.json({ patient, history, prescriptions, tests });
  } catch (error) {
    console.error("Failed to fetch patient data:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}
