import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentAttendance from "@/components/dashboard/RecentAttendance";

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Statistics Cards */}
        <DashboardStats />

        {/* Recent Attendance */}
        <RecentAttendance />
      </div>
    </div>
  );
}