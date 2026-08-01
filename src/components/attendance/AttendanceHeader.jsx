import { formatDate } from "@/lib/attendance-helpers";

export default function AttendanceHeader({ attendanceDay }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
          Attendance
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Monitor and manage student attendance records during University Days.
        </p>
      </div>

      {attendanceDay && (
        <p className="text-sm font-semibold text-blue-700 sm:text-right">
          Day {attendanceDay.day_number} &middot;{" "}
          {formatDate(attendanceDay.attendance_date)}
        </p>
      )}
    </div>
  );
}
