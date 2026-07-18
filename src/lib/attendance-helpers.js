export function formatTime(timestamp) {
  if (!timestamp) return "-";

  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function computeAttendanceStatus(attendanceRecord, attendanceDay) {
  if (!attendanceRecord) {
    return attendanceDay?.attendance_open ? "Not Yet Timed In" : "Absent";
  }

  if (attendanceRecord.status === "Absent") return "Absent";

  const { time_in: timeIn, time_out: timeOut } = attendanceRecord;

  if (timeIn && timeOut) return "Complete";
  if (timeIn) return "Timed In";

  return "Not Yet Timed In";
}

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

export function buildAttendanceReport(students, attendanceDays, attendanceRecords) {
  const recordIndex = new Map();

  attendanceRecords.forEach((record) => {
    recordIndex.set(`${record.student_id}-${record.attendance_day_id}`, record);
  });

  return students.map((student) => {
    let daysPresent = 0;

    attendanceDays.forEach((day) => {
      const record = recordIndex.get(`${student.id}-${day.id}`) ?? null;
      const status = computeAttendanceStatus(record, day);
      if (status === "Complete") daysPresent += 1;
    });

    return {
      studentId: student.student_id,
      course: student.course,
      yearLevel: student.year_level,
      daysPresent,
    };
  });
}

export const STATUS_STYLES = {
  Complete: "bg-green-50 text-green-700 ring-1 ring-green-200",
  "Timed In": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  "Not Yet Timed In": "bg-gray-50 text-gray-700 ring-1 ring-gray-200",
  Absent: "bg-red-50 text-red-700 ring-1 ring-red-200",
};