export default function QuickActionButton({ icon: Icon, label, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold transition-colors ${
        primary
          ? "bg-blue-700 text-white shadow-md shadow-blue-700/25 hover:bg-blue-800"
          : "border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-700"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          primary ? "bg-white/15" : "bg-blue-700/10"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${primary ? "text-yellow-400" : "text-blue-700"}`}
        />
      </div>
      {label}
    </button>
  );
}