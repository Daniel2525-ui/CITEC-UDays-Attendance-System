export default function AttendanceDayForm({ form, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Day Number
        </label>
        <input
          type="number"
          min="1"
          value={form.day_number}
          onChange={(e) => onChange("day_number", e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Attendance Date
        </label>
        <input
          type="date"
          value={form.attendance_date}
          onChange={(e) => onChange("attendance_date", e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Time In Start
          </label>
          <input
            type="time"
            value={form.time_in_start}
            onChange={(e) => onChange("time_in_start", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Time In Cutoff
          </label>
          <input
            type="time"
            value={form.time_in_cutoff}
            onChange={(e) => onChange("time_in_cutoff", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
}
