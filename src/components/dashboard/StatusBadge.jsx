import { STATUS_STYLES } from "@/lib/attendance-helpers";

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] || "bg-gray-50 text-gray-600 ring-1 ring-gray-200"
      }`}
    >
      {status}
    </span>
  );
}
