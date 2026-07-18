"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { buildAttendanceReport } from "@/lib/attendance-helpers";

export function useAttendanceReport() {
  const [rows, setRows] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const [
        { data: students, error: studentsError },
        { data: attendanceDays, error: daysError },
        { data: attendanceRecords, error: recordsError },
      ] = await Promise.all([
        supabase.from("students").select("id, student_id, course, year_level"),
        supabase.from("attendance_days").select("*"),
        supabase
          .from("attendance")
          .select("student_id, attendance_day_id, time_in, time_out, status"),
      ]);

      if (studentsError || daysError || recordsError) {
        console.error(
          studentsError?.message || daysError?.message || recordsError?.message,
        );
        setErrorMessage("Unable to load the attendance report.");
        return;
      }

      const report = buildAttendanceReport(
        students || [],
        attendanceDays || [],
        attendanceRecords || [],
      );

      setRows(report);
      setTotalDays((attendanceDays || []).length);
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const sorted = [...rows].sort((a, b) =>
      (a.studentId || "").localeCompare(b.studentId || ""),
    );

    if (!searchTerm.trim()) return sorted;

    const term = searchTerm.toLowerCase();
    return sorted.filter(
      (row) =>
        row.studentId?.toLowerCase().includes(term) ||
        row.course?.toLowerCase().includes(term),
    );
  }, [rows, searchTerm]);

  const summary = useMemo(() => {
    const totalStudents = rows.length;
    const presentAtLeastOnce = rows.filter((row) => row.daysPresent > 0).length;
    const perfectAttendance = rows.filter(
      (row) => totalDays > 0 && row.daysPresent === totalDays,
    ).length;
    const neverAttended = rows.filter((row) => row.daysPresent === 0).length;

    return { totalStudents, presentAtLeastOnce, perfectAttendance, neverAttended };
  }, [rows, totalDays]);

  return {
    rows: filteredRows,
    summary,
    totalDays,
    loading,
    errorMessage,
    searchTerm,
    setSearchTerm,
    refetch: fetchReport,
  };
}
