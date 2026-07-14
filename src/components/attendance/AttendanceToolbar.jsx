"use client";

export default function AttendanceToolbar({ search, onSearchChange }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Attendance Records
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          All students recorded for the selected attendance day.
        </p>
      </div>

      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by Student ID or Student Name..."
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 sm:w-80"
      />
    </div>
  );
}
