"use client";

import { useMemo, useState } from "react";
import { ClipboardX, Loader2 } from "lucide-react";
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
];

export default function AttendanceTable({
  attendanceDay,
  rows,
  loading,
  error,
}) {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      ({ student }) =>
        student.student_id.toLowerCase().includes(query) ||
        student.full_name.toLowerCase().includes(query),
    );
  }, [rows, search]);

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
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
