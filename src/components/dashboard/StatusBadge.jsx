export default function StatusBadge({ status }) {
  const styles = {
    Present: "bg-green-50 text-green-700 ring-1 ring-green-200",
    Incomplete: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    Absent: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-50 text-gray-600 ring-1 ring-gray-200"
      }`}
    >
      {status}
    </span>
  );
}