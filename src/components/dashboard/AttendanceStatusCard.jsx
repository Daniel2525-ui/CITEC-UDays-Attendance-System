import { Activity } from "lucide-react";

export default function AttendanceStatusCard({ attendanceOpen }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700/10">
        <Activity className="h-6 w-6 text-blue-700" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500">
        Attendance Status
      </p>
      <div className="mt-1 flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            attendanceOpen ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <p className="text-lg font-bold text-gray-800">
          {attendanceOpen ? "Attendance Open" : "Attendance Closed"}
        </p>
      </div>
    </div>
  );
}