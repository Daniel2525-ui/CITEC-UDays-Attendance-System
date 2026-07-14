/**
 * Formats a timestamp into a 12-hour time string.
 * Example: "2026-07-14T08:01:00Z" -> "8:01 AM"
 */
export function formatTime(timestamp) {
  if (!timestamp) return "-";

  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a date into a short readable string.
 * Example: "2026-07-14" -> "Jul 14, 2026"
 */
export function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Computes a student's attendance status for a given day.
 * Status is always derived, never read directly from attendance.status.
 */
export function computeAttendanceStatus(attendanceRecord, attendanceDay) {
  if (!attendanceRecord) {
    return attendanceDay?.attendance_open ? "Not Yet Timed In" : "Absent";
  }

  const { time_in: timeIn, time_out: timeOut } = attendanceRecord;

  if (timeIn && timeOut) return "Complete";
  if (timeIn) return "Timed In";

  return "Not Yet Timed In";
}

/**
 * Merges the full student roster with attendance records for a single day,
 * using a lookup map so every student appears exactly once, whether or not
 * they have scanned in yet.
 */
export function mergeStudentsWithAttendance(students, attendanceRecords, attendanceDay) {
  const attendanceByStudentId = new Map();

  attendanceRecords.forEach((record) => {
    attendanceByStudentId.set(record.student_id, record);
  });

  return students.map((student) => {
    const attendanceRecord = attendanceByStudentId.get(student.id) ?? null;

    return {
      rowKey: student.id,
      student,
      attendanceRecord,
      timeIn: attendanceRecord?.time_in ?? null,
      timeOut: attendanceRecord?.time_out ?? null,
      status: computeAttendanceStatus(attendanceRecord, attendanceDay),
    };
  });
}

export const STATUS_STYLES = {
  Complete: "bg-green-50 text-green-700 ring-1 ring-green-200",
  "Timed In": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  "Not Yet Timed In": "bg-gray-50 text-gray-700 ring-1 ring-gray-200",
  Absent: "bg-red-50 text-red-700 ring-1 ring-red-200",
};