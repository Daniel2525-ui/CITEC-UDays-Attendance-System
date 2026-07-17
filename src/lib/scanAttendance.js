import { supabase } from "@/lib/supabase";
import { formatTime } from "@/lib/attendance-helpers";

const getTodayDate = () => new Date().toLocaleDateString("en-CA");

/**
 * Validates a decoded QR value against today's attendance session and
 * records a Time In or Time Out accordingly.
 *
 * Returns:
 *   { success: true, data: { studentId, name, course, yearLevel, time, action } }
 *   { success: false, reason: "<human-readable reason>" }
 */
export async function recordAttendanceScan(qrValue) {
  const studentIdValue = (qrValue || "").trim();

  if (!studentIdValue) {
    return { success: false, reason: "Invalid QR Code" };
  }

  const today = getTodayDate();

  const { data: dayRecord, error: dayError } = await supabase
    .from("attendance_days")
    .select("*")
    .eq("attendance_date", today)
    .maybeSingle();

  if (dayError) {
    console.error(dayError.message);
    return { success: false, reason: "Something went wrong. Please try again." };
  }

  if (!dayRecord || !dayRecord.attendance_open) {
    return { success: false, reason: "Attendance Closed" };
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, student_id, full_name, course, year_level")
    .eq("student_id", studentIdValue)
    .maybeSingle();

  if (studentError) {
    console.error(studentError.message);
    return { success: false, reason: "Something went wrong. Please try again." };
  }

  if (!student) {
    return { success: false, reason: "Student Not Found" };
  }

  const { data: existing, error: existingError } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", student.id)
    .eq("attendance_day_id", dayRecord.id)
    .maybeSingle();

  if (existingError) {
    console.error(existingError.message);
    return { success: false, reason: "Something went wrong. Please try again." };
  }

  const isTimeOutPhase = dayRecord.time_out_enabled;

  if (!isTimeOutPhase) {
    return recordTimeIn({ student, dayRecord, existing });
  }

  return recordTimeOut({ student, existing });
}

async function recordTimeIn({ student, dayRecord, existing }) {
  if (existing) {
    return { success: false, reason: "Already Timed In" };
  }

  const nowIso = new Date().toISOString();

  const { error: insertError } = await supabase.from("attendance").insert({
    student_id: student.id,
    attendance_day_id: dayRecord.id,
    time_in: nowIso,
    status: "Incomplete",
  });

  if (insertError) {
    console.error(insertError.message);
    return { success: false, reason: "Something went wrong. Please try again." };
  }

  return {
    success: true,
    data: buildScanResult(student, nowIso, "TIME IN"),
  };
}

async function recordTimeOut({ student, existing }) {
  if (!existing || !existing.time_in) {
    return { success: false, reason: "No Time In Recorded For Today" };
  }

  if (existing.time_out) {
    return { success: false, reason: "Already Timed Out" };
  }

  const nowIso = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("attendance")
    .update({ time_out: nowIso, status: "Complete" })
    .eq("id", existing.id);

  if (updateError) {
    console.error(updateError.message);
    return { success: false, reason: "Something went wrong. Please try again." };
  }

  return {
    success: true,
    data: buildScanResult(student, nowIso, "TIME OUT"),
  };
}

function buildScanResult(student, timestampIso, action) {
  return {
    studentId: student.student_id,
    name: student.full_name,
    course: student.course,
    yearLevel: student.year_level,
    time: formatTime(timestampIso),
    action,
  };
}