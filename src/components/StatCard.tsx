"use client";

import { cn } from "@/lib/utils"; // utility to join classNames conditionally

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  count: number;
  color: string; // e.g., "from-blue-500 to-blue-600"
  active?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  count,
  color,
  active = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer bg-white p-4 rounded-2xl shadow-sm transition-all border",
        active ? "border-blue-500 ring-2 ring-blue-500" : "hover:shadow-md"
      )}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`p-3 rounded-full bg-gradient-to-r ${color} text-white`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{count} entries</p>
        </div>
      </div>
    </div>
  );
};
