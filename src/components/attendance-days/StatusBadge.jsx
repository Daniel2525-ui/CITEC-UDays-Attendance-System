export default function StatusBadge({ isOpen }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isOpen ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOpen ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}
