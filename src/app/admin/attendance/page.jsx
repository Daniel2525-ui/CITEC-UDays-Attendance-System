"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAttendanceData } from "@/lib/hooks/useAttendanceData";
import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceTable from "@/components/attendance/AttendanceTable";

const getTodayDate = () => new Date().toLocaleDateString("en-CA");

export default function Page() {
  const [attendanceDayId, setAttendanceDayId] = useState(null);

  useEffect(() => {
    const resolveCurrentAttendanceDay = async () => {
      const today = getTodayDate();

      // 1. Prefer today's actual day, regardless of open/closed — this is
      // what an admin looking at "Attendance" almost always means.
      const { data: todayDay, error: todayError } = await supabase
        .from("attendance_days")
        .select("id")
        .eq("attendance_date", today)
        .maybeSingle();

      if (todayError) {
        console.error(
          "Failed to fetch today's attendance day:",
          todayError.message,
        );
      }

      if (todayDay) {
        setAttendanceDayId(todayDay.id);
        return;
      }

      // 2. No day scheduled for today — fall back to the most recent day
      // that has already happened. Never picks a future-dated day (e.g.
      // one already created ahead of time in Schedule), since that would
      // show an empty day with everyone incorrectly appearing absent.
      const { data: pastDay, error: pastDayError } = await supabase
        .from("attendance_days")
        .select("id")
        .lte("attendance_date", today)
        .order("attendance_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pastDayError) {
        console.error(
          "Failed to fetch most recent attendance day:",
          pastDayError.message,
        );
        return;
      }

      setAttendanceDayId(pastDay?.id ?? null);
    };

    resolveCurrentAttendanceDay();
  }, []);

  const { attendanceDay, rows, loading, error } =
    useAttendanceData(attendanceDayId);

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <AttendanceHeader />
        <AttendanceStats rows={rows} />
        <AttendanceTable
          attendanceDay={attendanceDay}
          rows={rows}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
