"use client";

import { useEffect, useState } from "react";
import { Pencil, ClipboardX, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AttendanceTable({ attendanceDayId }) {
  const [records, setRecords] = useState([]);
  const [attendanceDay, setAttendanceDay] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (attendanceDayId) {
      fetchAttendance();
    }
  }, [attendanceDayId]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: dayData, error: dayError } = await supabase
        .from("attendance_days")
        .select("*")
        .eq("id", attendanceDayId)
        .single();

      if (dayError) throw dayError;

      setAttendanceDay(dayData);

      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .order("full_name");

      if (studentsError) throw studentsError;

      const { data: attendance, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("attendance_day_id", attendanceDayId);

      if (attendanceError) throw attendanceError;

      const attendanceMap = {};

      attendance.forEach((record) => {
        attendanceMap[record.student_id] = record;
      });

      const merged = students.map((student) => {
        const record = attendanceMap[student.id];

        return {
          student,

          attendance: record || null,

          id: record?.id ?? student.id,

          time_in: record?.time_in ?? null,

          time_out: record?.time_out ?? null,

          status: getStatus(record, dayData),
        };
      });

      setRecords(merged);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const getStatus = (attendance, day) => {
    if (!attendance) {
      if (day?.attendance_open) {
        return "Not Yet Timed In";
      }

      return "Absent";
    }

    if (attendance.time_in && attendance.time_out) {
      return "Complete";
    }

    if (attendance.time_in) {
      return "Timed In";
    }

    return "Not Yet Timed In";
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "-";

    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusStyles = {
    Complete: "bg-green-50 text-green-700 ring-1 ring-green-200",

    "Timed In": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",

    "Not Yet Timed In": "bg-gray-50 text-gray-700 ring-1 ring-gray-200",

    Absent: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };

  const filteredRecords = records.filter((record) => {
    const query = search.toLowerCase();

    return (
      record.student.student_id.toLowerCase().includes(query) ||
      record.student.full_name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Attendance Records
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            All students recorded for the selected attendance day.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Student ID or Student Name..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 sm:w-80"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading attendance records...
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 px-4 py-4 text-center text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      ) : filteredRecords.length === 0 ? (
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
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Student ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Student Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Course
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Year Level
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Day
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Time In
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Time Out
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/60"
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-800">
                    {record.students?.student_id}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {record.students?.full_name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {record.students?.course}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {record.students?.year_level}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {record.attendance_days?.day_number}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {formatDate(record.attendance_days?.attendance_date)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {formatTime(record.time_in)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {formatTime(record.time_out)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[record.status] ||
                        "bg-gray-50 text-gray-600 ring-1 ring-gray-200"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-700">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
