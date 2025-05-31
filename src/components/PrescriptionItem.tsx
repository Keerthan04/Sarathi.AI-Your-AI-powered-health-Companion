// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PrescriptionItem({ data }: { data: any }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
      <p>
        <strong>Medication:</strong> {data.medication_name}
      </p>
      <p>
        <strong>Dosage:</strong> {data.dosage}
      </p>
      <p>
        <strong>Frequency:</strong> {data.frequency}
      </p>
      <p>
        <strong>Prescribed by:</strong> Dr. {data.doctor_name}
      </p>
    </div>
  );
}
