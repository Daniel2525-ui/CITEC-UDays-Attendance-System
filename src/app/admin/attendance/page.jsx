import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceToolbar from "@/components/attendance/AttendanceToolbar";
import AttendanceTable from "@/components/attendance/AttendanceTable";

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Page Header */}
        <AttendanceHeader />

        {/* Summary Cards */}
        <AttendanceStats />

        {/* Search & Filter Bar */}
        <AttendanceToolbar />

        {/* Attendance Table */}
        <AttendanceTable />
      </div>
    </div>
  );
}