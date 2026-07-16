import AttendanceDayRow from "./AttendanceDayRow";

export default function AttendanceDaysTable({
  days,
  deletingId,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-gray-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <tr>
            <th className="px-4 py-3">Day</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Time In Start</th>
            <th className="px-4 py-3">Time In Cutoff</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {days.map((day) => (
            <AttendanceDayRow
              key={day.id}
              day={day}
              isDeleting={deletingId === day.id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
