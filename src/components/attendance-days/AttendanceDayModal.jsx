import { X, Loader2 } from "lucide-react";
import AttendanceDayForm from "./AttendanceDayForm";

export default function AttendanceDayModal({
  form,
  editingDay,
  saving,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {editingDay ? "Edit Attendance Day" : "New Attendance Day"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <AttendanceDayForm form={form} onChange={onChange} />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingDay ? "Save Changes" : "Create Day"}
          </button>
        </div>
      </div>
    </div>
  );
}
