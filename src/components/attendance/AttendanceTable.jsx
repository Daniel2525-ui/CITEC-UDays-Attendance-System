"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardX, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { mergeStudentsWithAttendance } from "@/lib/attendance-helpers";
import AttendanceToolbar from "./AttendanceToolbar";
import AttendanceRow from "./AttendanceRow";

const TABLE_HEADERS = [
  "Student ID",
  "Student Name",
  "Course",
  "Year Level",
  "Day",
  "Date",
  "Time In",
  "Time Out",
  "Status",
  "Actions",
];

export default function AttendanceTable({ attendanceDayId }) {
  const [attendanceDay, setAttendanceDay] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

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

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return rows;

    return rows.filter(({ student }) => {
      return (
        student.student_id.toLowerCase().includes(query) ||
        student.full_name.toLowerCase().includes(query)
      );
    });
  }, [rows, search]);

  const handleEdit = (row) => {
    console.log("Edit attendance for", row.student.student_id);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
      <AttendanceToolbar search={search} onSearchChange={setSearch} />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading attendance records...
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 px-4 py-4 text-center text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <ClipboardX className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-400">
            No attendance records found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-240 border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <AttendanceRow
                  key={row.rowKey}
                  row={row}
                  attendanceDay={attendanceDay}
                  onEdit={handleEdit}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
