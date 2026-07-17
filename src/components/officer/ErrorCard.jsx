import { XCircle } from "lucide-react";

const DEFAULT_REASON = "Invalid QR Code";

export default function ErrorCard({ reason = DEFAULT_REASON }) {
  return (
    <div className="rounded-3xl bg-red-50 p-6 ring-1 ring-red-100 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-600">
          <XCircle className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-base font-bold text-red-700 sm:text-lg">
          Unable to Record Attendance
        </h2>
      </div>

      <p className="mt-4 text-sm text-red-700/80">{reason}</p>

      <div className="mt-4 rounded-2xl bg-white/60 p-4 ring-1 ring-red-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600/70">
          Possible Reasons
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
          <li>Invalid QR Code</li>
          <li>Student Not Found</li>
          <li>Attendance Closed</li>
          <li>Already Timed In</li>
          <li>Already Timed Out</li>
        </ul>
      </div>
    </div>
  );
}
