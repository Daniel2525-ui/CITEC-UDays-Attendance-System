"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceTable from "@/components/attendance/AttendanceTable";

export default function Page() {
  const [attendanceDayId, setAttendanceDayId] = useState(null);

  useEffect(() => {
    const resolveCurrentAttendanceDay = async () => {

      const { data: openDay, error: openDayError } = await supabase
        .from("attendance_days")
        .select("id")
        .eq("attendance_open", true)
        .order("attendance_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (openDayError) {
        console.error("Failed to fetch open attendance day:", openDayError.message);
      }

      if (openDay) {
        setAttendanceDayId(openDay.id);
        return;
      }

      const { data: latestDay, error: latestDayError } = await supabase
        .from("attendance_days")
        .select("id")
        .order("attendance_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestDayError) {
        console.error("Failed to fetch latest attendance day:", latestDayError.message);
        return;
      }

      setAttendanceDayId(latestDay?.id ?? null);
    };

    resolveCurrentAttendanceDay();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <AttendanceHeader />

        <AttendanceStats />

        <AttendanceTable attendanceDayId={attendanceDayId} />
      </div>
    </div>
  );
}