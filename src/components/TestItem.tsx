// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TestItem({ data }: { data: any }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
      <p>
        <strong>Test Name:</strong> {data.test_name}
      </p>
      <p>
        <strong>Status:</strong> {data.status}
      </p>
      <p>
        <strong>Date:</strong> {new Date(data.date).toLocaleDateString()}
      </p>
      {data.result && (
        <p>
          <strong>Result:</strong> {data.result}
        </p>
      )}
      {data.doctor_name && (
        <p>
          <strong>Recommended by:</strong> Dr. {data.doctor_name}
        </p>
      )}
    </div>
  );
}
