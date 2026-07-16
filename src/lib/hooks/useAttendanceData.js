"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { mergeStudentsWithAttendance } from "@/lib/attendance-helpers";

export function useAttendanceData(attendanceDayId) {
  const [attendanceDay, setAttendanceDay] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceDay = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("attendance_days")
      .select("*")
      .eq("id", attendanceDayId)
      .single();
    if (fetchError) throw fetchError;
    return data;
  }, [attendanceDayId]);

  const fetchAllStudents = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("students")
      .select("*")
      .order("full_name");
    if (fetchError) throw fetchError;
    return data;
  }, []);

  const fetchAttendanceForDay = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("attendance")
      .select("*")
      .eq("attendance_day_id", attendanceDayId);
    if (fetchError) throw fetchError;
    return data;
  }, [attendanceDayId]);

  const loadAttendanceData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [day, students, attendanceRecords] = await Promise.all([
        fetchAttendanceDay(),
        fetchAllStudents(),
        fetchAttendanceForDay(),
      ]);
      setAttendanceDay(day);
      setRows(mergeStudentsWithAttendance(students, attendanceRecords, day));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAttendanceDay, fetchAllStudents, fetchAttendanceForDay]);

  useEffect(() => {
    if (!attendanceDayId) {
      setLoading(false);
      return;
    }
    loadAttendanceData();
  }, [attendanceDayId, loadAttendanceData]);

  return { attendanceDay, rows, loading, error, reload: loadAttendanceData };
}