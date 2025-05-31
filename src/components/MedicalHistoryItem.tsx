import { CalendarHeart } from "lucide-react";

interface MedicalHistoryItem {
  history_id: string;
  diagnosis: string;
  date_of_diagnosis: string;
  treatment_given: string;
  family_history: string;
}

export function MedicalHistoryItem({ item }: { item: MedicalHistoryItem }) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm space-y-2">
      <div className="text-base font-semibold text-gray-800">
        {item.diagnosis}
      </div>
      <div className="text-sm text-gray-600">
        Treatment: {item.treatment_given}
      </div>
      <div className="text-sm text-gray-600">
        Family History: {item.family_history}
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-400">
        <CalendarHeart className="w-3 h-3" />
        <span>{item.date_of_diagnosis}</span>
      </div>
    </div>
  );
}
