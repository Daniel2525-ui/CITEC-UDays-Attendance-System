import { CheckCircle2, AlertTriangle, XCircle, ClipboardList } from "lucide-react";

export default function AttendanceStats() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Present */}
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-800">932</p>
        <p className="mt-1 text-sm font-medium text-gray-500">Present</p>
      </div>

      {/* Incomplete */}
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-50">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-800">47</p>
        <p className="mt-1 text-sm font-medium text-gray-500">Incomplete</p>
      </div>

      {/* Absent */}
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50">
          <XCircle className="h-6 w-6 text-red-600" />
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-800">121</p>
        <p className="mt-1 text-sm font-medium text-gray-500">Absent</p>
      </div>

      {/* Total Records */}
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700/10">
          <ClipboardList className="h-6 w-6 text-blue-700" />
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-800">1,100</p>
        <p className="mt-1 text-sm font-medium text-gray-500">Total Records</p>
      </div>
    </div>
  );
}