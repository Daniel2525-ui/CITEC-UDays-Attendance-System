"use client";

import { Pencil } from "lucide-react";
import { formatDate, formatTime, STATUS_STYLES } from "@/lib/attendance-helpers";

export default function AttendanceRow({ row, attendanceDay, onEdit }) {
  const { student, timeIn, timeOut, status } = row;

  const statusStyle =
    STATUS_STYLES[status] || "bg-gray-50 text-gray-600 ring-1 ring-gray-200";

  return (
    <tr className="border-b border-gray-50 transition-colors hover:bg-gray-50/60">
      <td className="px-4 py-4 text-sm font-medium text-gray-800">
        {student.student_id}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">{student.full_name}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{student.course}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{student.year_level}</td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {attendanceDay?.day_number ?? "-"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {formatDate(attendanceDay?.attendance_date)}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">{formatTime(timeIn)}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{formatTime(timeOut)}</td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-4">
        <button
          onClick={() => onEdit(row)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </td>
    </tr>
  );
}