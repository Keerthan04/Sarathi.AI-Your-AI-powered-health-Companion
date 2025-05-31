// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// Authentication
export async function loginPatient(email: string, password: string) {
  try {
    const result = await sql`
      SELECT patient_id, name, email, age, gender, contact, address 
      FROM Patients 
      WHERE email = ${email} AND password = ${password}
    `;

    if (result.length === 0) {
      throw new Error("Invalid credentials");
    }

    return result[0];
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed");
  }
}

// Get patient basic info
export async function getPatientInfo(patientId: string) {
  try {
    const result = await sql`
      SELECT patient_id, name, email, age, gender, contact, address 
      FROM Patients 
      WHERE patient_id = ${patientId}
    `;

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching patient info:", error);
    throw new Error("Failed to fetch patient information");
  }
}

// Get medical history
export async function getMedicalHistory(patientId: string) {
  try {
    const result = await sql`
      SELECT history_id, diagnosis, date_of_diagnosis, treatment_given, family_history
      FROM Medical_History 
      WHERE patient_id = ${patientId}
      ORDER BY date_of_diagnosis DESC
    `;

    return result;
  } catch (error) {
    console.error("Error fetching medical history:", error);
    throw new Error("Failed to fetch medical history");
  }
}

// Get prescriptions
export async function getPrescriptions(patientId: string) {
  try {
    const result = await sql`
      SELECT p.prescription_id, p.medication_name, p.dosage, p.frequency, d.name as doctor_name
      FROM Prescriptions p
      LEFT JOIN Doctors d ON p.doctor_id = d.doctor_id
      WHERE p.patient_id = ${patientId}
      ORDER BY p.prescription_id DESC
    `;

    return result;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw new Error("Failed to fetch prescriptions");
  }
}

// Get tests (both taken and recommended)
export async function getTests(patientId: string) {
  try {
    // Get completed tests
    const completedTests = await sql`
      SELECT test_id as id, test_name, result, date_taken as date, 'completed' as status
      FROM Tests_Taken 
      WHERE patient_id = ${patientId}
    `;

    // Get recommended tests
    const recommendedTests = await sql`
      SELECT tr.recommendation_id as id, tr.test_name, tr.result, tr.recommendation_date as date, 'recommended' as status, d.name as doctor_name
      FROM Tests_Recommended tr
      LEFT JOIN Doctors d ON tr.doctor_id = d.doctor_id
      WHERE tr.patient_id = ${patientId}
    `;

    // Combine and sort by date
    const allTests = [...completedTests, ...recommendedTests];
    return allTests.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw new Error("Failed to fetch tests");
  }
}

// Add new medical history entry
export async function addMedicalHistory(
  patientId: string,
  diagnosis: string,
  treatmentGiven: string,
  familyHistory?: string
) {
  try {
    const result = await sql`
      INSERT INTO Medical_History (patient_id, diagnosis, date_of_diagnosis, treatment_given, family_history)
      VALUES (${patientId}, ${diagnosis}, CURRENT_DATE, ${treatmentGiven}, ${
      familyHistory || null
    })
      RETURNING history_id
    `;

    return result[0];
  } catch (error) {
    console.error("Error adding medical history:", error);
    throw new Error("Failed to add medical history");
  }
}

// Add new prescription
export async function addPrescription(
  doctorId: string,
  patientId: string,
  medicationName: string,
  dosage: string,
  frequency: string,
  appointmentId?: number
) {
  try {
    const result = await sql`
      INSERT INTO Prescriptions (doctor_id, patient_id, medication_name, dosage, frequency, appointment_id)
      VALUES (${doctorId}, ${patientId}, ${medicationName}, ${dosage}, ${frequency}, ${
      appointmentId || null
    })
      RETURNING prescription_id
    `;

    return result[0];
  } catch (error) {
    console.error("Error adding prescription:", error);
    throw new Error("Failed to add prescription");
  }
}

// Add test recommendation
export async function addTestRecommendation(
  doctorId: string,
  patientId: string,
  testName: string
) {
  try {
    const result = await sql`
      INSERT INTO Tests_Recommended (doctor_id, patient_id, test_name, recommendation_date)
      VALUES (${doctorId}, ${patientId}, ${testName}, CURRENT_DATE)
      RETURNING recommendation_id
    `;

    return result[0];
  } catch (error) {
    console.error("Error adding test recommendation:", error);
    throw new Error("Failed to add test recommendation");
  }
}

// Add test result
export async function addTestResult(
  patientId: string,
  testName: string,
  result: string
) {
  try {
    const insertResult = await sql`
      INSERT INTO Tests_Taken (patient_id, test_name, result, date_taken)
      VALUES (${patientId}, ${testName}, ${result}, CURRENT_DATE)
      RETURNING test_id
    `;

    return insertResult[0];
  } catch (error) {
    console.error("Error adding test result:", error);
    throw new Error("Failed to add test result");
  }
}

// Update patient information
// export async function updatePatientInfo(
//   patientId: string,
//   updates: {
//     name?: string;
//     contact?: string;
//     address?: string;
//     email?: string;
//   }
// ) {
//   try {
//     const setClause = Object.entries(updates)
//       .filter(([_, value]) => value !== undefined)
//       .map(([key, _]) => `${key} = $${key}`)
//       .join(", ");

//     if (!setClause) {
//       throw new Error("No valid updates provided");
//     }

//     const result = await sql`
//       UPDATE Patients 
//       SET ${sql.unsafe(setClause)}
//       WHERE patient_id = ${patientId}
//       RETURNING patient_id, name, email, age, gender, contact, address
//     `;

//     return result[0];
//   } catch (error) {
//     console.error("Error updating patient info:", error);
//     throw new Error("Failed to update patient information");
//   }
// }

// Get patient summary for chatbot context
export async function getPatientSummary(patientId: string) {
  try {
    const [patient, history, prescriptions, tests] = await Promise.all([
      getPatientInfo(patientId),
      getMedicalHistory(patientId),
      getPrescriptions(patientId),
      getTests(patientId),
    ]);

    return {
      patient,
      medicalHistory: history,
      currentPrescriptions: prescriptions,
      recentTests: tests.slice(0, 5), // Last 5 tests
    };
  } catch (error) {
    console.error("Error fetching patient summary:", error);
    throw new Error("Failed to fetch patient summary");
  }
}

// Search patients (for admin/doctor use)
export async function searchPatients(searchTerm: string) {
  try {
    const result = await sql`
      SELECT patient_id, name, email, age, gender, contact
      FROM Patients 
      WHERE name ILIKE ${"%" + searchTerm + "%"} 
         OR email ILIKE ${"%" + searchTerm + "%"}
         OR patient_id ILIKE ${"%" + searchTerm + "%"}
      ORDER BY name
      LIMIT 20
    `;

    return result;
  } catch (error) {
    console.error("Error searching patients:", error);
    throw new Error("Failed to search patients");
  }
}

// Register new patient
// export async function registerPatient(
//   name: string,
//   email: string,
//   password: string,
//   age: number,
//   gender: "male" | "female",
//   contact: string,
//   address: string
// ) {
//   try {
//     // Generate patient ID
//     const patientCount = await sql`SELECT COUNT(*) as count FROM Patients`;
//     const patientNumber = (parseInt(patientCount[0].count) + 1)
//       .toString()
//       .padStart(3, "0");
//     const patientId = `PAT${patientNumber}`;

//     const result = await sql`
//       INSERT INTO Patients (patient_id, name, email, password, age, gender, contact, address)
//       VALUES (${patientId}, ${name}, ${email}, ${password}, ${age}, ${gender}, ${contact}, ${address})
//       RETURNING patient_id, name, email, age, gender, contact, address
//     `;

//     return result[0];
//   } catch (error) {
//     console.error("Error registering patient:", error);
//     if (error.message.includes("duplicate key")) {
//       throw new Error("Email already exists");
//     }
//     throw new Error("Failed to register patient");
//   }
// }

// async function getPatientInfolimit(patientId: string) {
//   try {
//     const result = await sql`
//       SELECT patient_id, name, email, age, gender, contact, address 
//       FROM Patients 
//       WHERE patient_id = ${patientId}
//     `;
//     return result[0] || null;
//   } catch (error) {
//     console.error("Error fetching patient info:", error);
//     return null;
//   }
// }

export async function getMedicalHistorylimit(patientId: string, limit: number = 3) {
  try {
    const result = await sql`
      SELECT history_id, diagnosis, date_of_diagnosis, treatment_given, family_history
      FROM Medical_History 
      WHERE patient_id = ${patientId}
      ORDER BY date_of_diagnosis DESC
      LIMIT ${limit}
    `;
    return result;
  } catch (error) {
    console.error("Error fetching medical history:", error);
    return [];
  }
}

export async function getPrescriptionslimit(patientId: string, limit: number = 3) {
  try {
    const result = await sql`
      SELECT p.prescription_id, p.medication_name, p.dosage, p.frequency, d.name as doctor_name
      FROM Prescriptions p
      LEFT JOIN Doctors d ON p.doctor_id = d.doctor_id
      WHERE p.patient_id = ${patientId}
      ORDER BY p.prescription_id DESC
      LIMIT ${limit}
    `;
    return result;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return [];
  }
}

export async function getTestslimit(patientId: string, limit: number = 3) {
  try {
    const completedTests = await sql`
      SELECT test_id as id, test_name, result, date_taken as date, 'completed' as status
      FROM Tests_Taken 
      WHERE patient_id = ${patientId}
      ORDER BY date_taken DESC
      LIMIT ${Math.ceil(limit / 2)}
    `;

    const recommendedTests = await sql`
      SELECT tr.recommendation_id as id, tr.test_name, tr.result, tr.recommendation_date as date, 'recommended' as status, d.name as doctor_name
      FROM Tests_Recommended tr
      LEFT JOIN Doctors d ON tr.doctor_id = d.doctor_id
      WHERE tr.patient_id = ${patientId}
      ORDER BY tr.recommendation_date DESC
      LIMIT ${Math.ceil(limit / 2)}
    `;

    const allTests = [...completedTests, ...recommendedTests];
    return allTests
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return [];
  }
}