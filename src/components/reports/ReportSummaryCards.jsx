import { Users, UserCheck, Award, UserX } from "lucide-react";

export default function ReportSummaryCards({ summary, loading }) {
  const cards = [
    {
      label: "Total Students",
      value: summary.totalStudents,
      description: "Enrolled for University Days",
      icon: Users,
      iconBg: "bg-blue-700/10",
      iconColor: "text-blue-700",
    },
    {
      label: "Present at Least Once",
      value: summary.presentAtLeastOnce,
      description: "Completed at least 1 day",
      icon: UserCheck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Perfect Attendance",
      value: summary.perfectAttendance,
      description: "Completed every scheduled day",
      icon: Award,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      label: "Never Attended",
      value: summary.neverAttended,
      description: "Zero days completed",
      icon: UserX,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, description, icon: Icon, iconBg, iconColor }) => (
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
      ))}
    </div>
  );
}
