import { Pencil, Trash2, Loader2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function AttendanceDayRow({
  day,
  isDeleting,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="hover:bg-gray-50/60">
      <td className="px-4 py-3 font-semibold text-gray-700">
        {day.day_number}
      </td>
      <td className="px-4 py-3 text-gray-600">{day.attendance_date}</td>
      <td className="px-4 py-3 text-gray-600">
        {day.time_in_start || "—"}
      </td>
      <td className="px-4 py-3 text-gray-600">
        {day.time_in_cutoff || "—"}
      </td>
      <td className="px-4 py-3">
        <StatusBadge isOpen={day.attendance_open} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(day)}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
            aria-label="Edit attendance day"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(day.id)}
            disabled={isDeleting}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            aria-label="Delete attendance day"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
