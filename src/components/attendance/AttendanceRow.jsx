"use client";

import {
  formatDate,
  formatTime,
  STATUS_STYLES,
} from "@/lib/attendance-helpers";

export default function AttendanceRow({ row, attendanceDay }) {
  const { student, timeIn, timeOut, status } = row;

  const statusStyle =
    STATUS_STYLES[status] || "bg-gray-50 text-gray-600 ring-1 ring-gray-200";

  return (
    <tr className="border-b border-gray-50 transition-colors hover:bg-gray-50/60">
      <td className="px-4 py-4 text-sm font-medium text-gray-800">
        {student.student_id}
      </td>
      <td className="px-4 py-4 text-sm">{student.full_name}</td>
      <td className="px-4 py-4 text-sm">{student.course}</td>
      <td className="px-4 py-4 text-sm">{student.year_level}</td>
      <td className="px-4 py-4 text-sm">
        {attendanceDay?.day_number ?? "-"}
      </td>
      <td className="px-4 py-4 text-sm">
        {formatDate(attendanceDay?.attendance_date)}
      </td>
      <td className="px-4 py-4 text-sm">{formatTime(timeIn)}</td>
      <td className="px-4 py-4 text-sm">{formatTime(timeOut)}</td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
