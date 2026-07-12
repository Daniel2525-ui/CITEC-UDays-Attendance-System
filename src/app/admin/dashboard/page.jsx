"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabse";

import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import DashboardStats from "@/components/dashboard/DashboardStats.jsx";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard.jsx";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard.jsx";

export default function Page() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [scannedToday, setScannedToday] = useState(0);
  const [attendanceOpen, setAttendanceOpen] = useState(true); // placeholder — will come from DB later
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalStudents();
  }, []);

  const fetchTotalStudents = async () => {
    try {
      setLoading(true);

      const { count, error } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error(error.message);
        return;
      }

      setTotalStudents(count);

      // TODO: Replace with real Supabase query, e.g.
      // const { count: scannedCount } = await supabase
      //   .from("attendance_logs")
      //   .select("student_id", { count: "exact", head: true })
      //   .gte("scanned_at", startOfToday)
      //   .lte("scanned_at", endOfToday);
      // setScannedToday(scannedCount || 0);
      setScannedToday(0); // placeholder
    } finally {
      setLoading(false);
    }
  };

  const attendanceRate =
    totalStudents > 0 ? Math.round((scannedToday / totalStudents) * 100) : 0;

  // Placeholder recent activity — replace with Supabase data later
  const recentActivity = [
    { name: "Juan Dela Cruz", studentId: "2024-00123", time: "2:35:18 PM" },
    { name: "Maria Santos", studentId: "2024-00456", time: "2:33:52 PM" },
    { name: "Carlo Reyes", studentId: "2024-00789", time: "2:31:07 PM" },
    { name: "Angela Lim", studentId: "2024-00234", time: "2:29:44 PM" },
    { name: "Mark Villanueva", studentId: "2024-00567", time: "2:27:10 PM" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <DashboardHeader />

        {/* Statistics Cards */}
        <DashboardStats
          totalStudents={totalStudents}
          scannedToday={scannedToday}
          attendanceRate={attendanceRate}
          attendanceOpen={attendanceOpen}
          loading={loading}
        />

        {/* Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RecentActivityCard activity={recentActivity} />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
