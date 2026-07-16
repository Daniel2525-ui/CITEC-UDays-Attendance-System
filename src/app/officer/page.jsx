import Link from "next/link";
import {
  QrCode,
  LogIn,
  LogOut,
  DoorOpen,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import OfficerHeader from "@/components/officer/OfficerHeader";

const STATS = [
  {
    label: "Students Scanned Today",
    value: "0",
    description: "Total scans recorded",
    icon: QrCode,
    iconBg: "bg-blue-600/10",
    iconColor: "text-blue-600",
  },
  {
    label: "Time In Count",
    value: "0",
    description: "Students who timed in",
    icon: LogIn,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    label: "Time Out Count",
    value: "0",
    description: "Students who timed out",
    icon: LogOut,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    label: "Attendance Status",
    value: "Closed",
    description: "Current session status",
    icon: DoorOpen,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
];

export default function OfficerDashboardPage() {
  return (
    <div>
      <OfficerHeader />

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, description, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
            >
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-800">{value}</p>
            <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col justify-between rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-600/20 sm:p-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <p className="mt-4 text-lg font-bold">QR Scanner</p>
            <p className="mt-1 text-sm text-blue-100">
              Scan a student&apos;s QR code to record Time In or Time Out.
            </p>
          </div>

          <Link
            href="/officer/scanner"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            Start Scanning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <p className="mt-4 text-lg font-bold text-gray-800">Recent Scans</p>
            <p className="mt-1 text-sm text-gray-500">
              View today&apos;s full attendance list and scan history.
            </p>
          </div>

          <Link
            href="/officer/recent"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-100 transition-colors hover:bg-gray-100"
          >
            View Recent Scans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
