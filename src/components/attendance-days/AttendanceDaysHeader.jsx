import { Plus } from "lucide-react";

export default function AttendanceDaysHeader({ onCreateClick }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Attendance Days
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage scheduled attendance days.
        </p>
      </div>

      <button
        onClick={onCreateClick}
        className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        New Attendance Day
      </button>
    </div>
  );
}
