"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabse";
import StatusBadge from "./StatusBadge";

export default function RecentAttendance() {
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentAttendance();
  }, []);

  const fetchRecentAttendance = async () => {
    try {
      setLoading(true);

      // Pull the 5 most recent attendance records, joined with student info.
      // "students" here is the embedded relationship from attendance.student_id -> students.id
      const { data, error } = await supabase
        .from("attendance")
        .select(
          `
          time_in,
          time_out,
          status,
          students (
            student_id,
            full_name
          )
        `,
        )
        .order("time_in", { ascending: false })
        .limit(5);

      if (error) {
        console.error(error.message);
        return;
      }

      // Reshape rows into the flat structure the table expects.
      // DB status is 'Complete' / 'Incomplete' — map 'Complete' to 'Present'
      // so it matches the badge styles already used across the dashboard.
      const formatted = (data || []).map((row) => ({
        studentId: row.students?.student_id,
        name: row.students?.full_name,
        timeIn: formatTime(row.time_in),
        timeOut: row.time_out ? formatTime(row.time_out) : null,
        status: row.status === "Complete" ? "Present" : "Incomplete",
      }));

      setRecentAttendance(formatted);
    } finally {
      setLoading(false);
    }
  };

  // Formats a timestamptz value into e.g. "8:02 AM"
  const formatTime = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
      <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
        Recent Attendance
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Latest students recorded for today&apos;s session.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-160 border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Student ID
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Student Name
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Time In
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Time Out
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  Loading recent attendance...
                </td>
              </tr>
            ) : recentAttendance.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No attendance records yet.
                </td>
              </tr>
            ) : (
              recentAttendance.map((entry, index) => (
                <tr
                  key={entry.studentId ?? index}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/60"
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-800">
                    {entry.studentId}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {entry.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {entry.timeIn}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {entry.timeOut ? (
                      <span className="text-gray-700">{entry.timeOut}</span>
                    ) : (
                      <span className="text-gray-300">———</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={entry.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
