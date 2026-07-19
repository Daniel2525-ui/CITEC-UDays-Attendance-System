"use client";
import { useEffect, useState } from "react";
import { Users, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { mergeStudentsWithAttendance } from "@/lib/attendance-helpers";

export default function DashboardStats() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [present, setPresent] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("id");

      if (studentsError) console.error(studentsError.message);

      const today = new Date().toLocaleDateString("en-CA");

      const { data: dayRecord, error: dayError } = await supabase
        .from("attendance_days")
        .select("*")
        .eq("attendance_date", today)
        .maybeSingle();

      if (dayError) console.error(dayError.message);

      let attendanceRecords = [];

      if (dayRecord?.id) {
        const { data, error } = await supabase
          .from("attendance")
          .select("student_id, time_in, time_out, status")
          .eq("attendance_day_id", dayRecord.id);

        if (error) console.error(error.message);
        attendanceRecords = data || [];
      }

      const merged = mergeStudentsWithAttendance(
        students || [],
        attendanceRecords,
        dayRecord,
      );

      const presentCount = merged.filter(
        (row) => row.status === "Complete",
      ).length;
      const incompleteCount = merged.filter(
        (row) => row.status === "Timed In",
      ).length;

      const absentCount = merged.filter(
        (row) => row.status === "Absent",
      ).length;

      setTotalStudents(students?.length || 0);
      setPresent(presentCount);
      setIncomplete(incompleteCount);
      setAbsent(absentCount);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      description: "Enrolled for University Days",
      icon: Users,
      iconBg: "bg-blue-700/10",
      iconColor: "text-blue-700",
    },
    {
      label: "Present",
      value: present,
      description: "Completed Time In and Time Out",
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Incomplete",
      value: incomplete,
      description: "No Time Out",
      icon: AlertTriangle,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      label: "Absent",
      value: absent,
      description: "Did not attend today",
      icon: XCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(
        ({ label, value, description, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
            >
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">{label}</p>

            {loading ? (
              <p>...</p>
            ) : (
              <p className="mt-1 text-3xl font-bold text-gray-800">{value}</p>
            )}

            <p className="mt-1 text-xs text-gray-400">{description}</p>
          </div>
        ),
      )}
    </div>
  );
}
