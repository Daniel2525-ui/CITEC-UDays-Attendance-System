"use client";
import { useEffect, useState } from "react";
import { Users, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardStats() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [present, setPresent] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const { count: studentCount, error: studentError } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      if (studentError) console.error(studentError.message);

      const today = new Date().toISOString().split("T")[0]; 

      const { data: dayRecord, error: dayError } = await supabase
        .from("attendance_days")
        .select("id")
        .eq("attendance_date", today)
        .maybeSingle();

      if (dayError) console.error(dayError.message);

      let presentCount = 0;
      let incompleteCount = 0;

      // Only query attendance if a session exists for today
      if (dayRecord?.id) {
        const [{ count: completeCount }, { count: incompleteCountRes }] =
          await Promise.all([
            supabase
              .from("attendance")
              .select("*", { count: "exact", head: true })
              .eq("attendance_day_id", dayRecord.id)
              .eq("status", "Complete"),
            supabase
              .from("attendance")
              .select("*", { count: "exact", head: true })
              .eq("attendance_day_id", dayRecord.id)
              .eq("status", "Incomplete"),
          ]);

        presentCount = completeCount || 0;
        incompleteCount = incompleteCountRes || 0;
      }

      setTotalStudents(studentCount || 0);
      setPresent(presentCount);
      setIncomplete(incompleteCount);
    } finally {
      setLoading(false);
    }
  };

  const absent = Math.max(totalStudents - present - incomplete, 0);

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
      description: "Scanned in today",
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Incomplete",
      value: incomplete,
      description: "Missing Time Out",
      icon: AlertTriangle,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      label: "Absent",
      value: absent,
      description: "Not yet scanned",
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
