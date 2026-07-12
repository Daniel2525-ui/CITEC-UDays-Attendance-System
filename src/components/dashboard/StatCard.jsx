export default function StatCard({ icon: Icon, label, value, subtext, loading }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700/10">
        <Icon className="h-6 w-6 text-blue-700" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500">{label}</p>

      {loading ? (
        <p className="animate-pulse rounded-lg">...</p>
      ) : (
        <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
      )}

      <p className="mt-1 text-xs text-gray-400">{subtext}</p>
    </div>
  );
}