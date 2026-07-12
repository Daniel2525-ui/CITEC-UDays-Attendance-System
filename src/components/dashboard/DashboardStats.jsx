import { Users, CheckCircle, BarChart } from "lucide-react";
import StatCard from "./StatCard";
import AttendanceStatusCard from "./AttendanceStatusCard";

export default function DashboardStats({
  totalStudents,
  scannedToday,
  attendanceRate,
  attendanceOpen,
  loading,
}) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Students */}
      <StatCard
        icon={Users}
        label="Total Students"
        loading={loading}
        value={totalStudents.toLocaleString()}
        subtext="Enrolled students"
      />

      {/* Students Scanned Today */}
      <StatCard
        icon={CheckCircle}
        label="Scanned Today"
        loading={loading}
        value={scannedToday.toLocaleString()}
        subtext="Unique students"
      />

      {/* Attendance Rate */}
      <StatCard
        icon={BarChart}
        label="Attendance Rate"
        loading={loading}
        value={`${attendanceRate}%`}
        subtext="Of total students"
      />

      {/* Attendance Status */}
      <AttendanceStatusCard attendanceOpen={attendanceOpen} />
    </div>
  );
}