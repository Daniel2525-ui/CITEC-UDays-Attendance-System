export default function RecentActivityCard({ activity }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 lg:col-span-2">
      <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
      <p className="mt-1 text-sm text-gray-500">
        Latest students who scanned indasdsa
      </p>

      <div className="mt-5 divide-y divide-gray-50">
        {activity.map((entry, index) => (
          <div key={index} className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700/10 text-sm font-semibold text-blue-700">
                {entry.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {entry.name}
                </p>
                <p className="text-xs text-gray-500">{entry.studentId}</p>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-400">{entry.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
