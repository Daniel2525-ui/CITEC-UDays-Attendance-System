"use client";
import { Search, Download } from "lucide-react";
import { downloadCsv } from "@/lib/csv-export";

const CSV_COLUMNS = [
  { key: "studentId", label: "Student ID" },
  { key: "course", label: "Course" },
  { key: "yearLevel", label: "Year Level" },
  { key: "daysPresent", label: "Days Present" },
];

export default function ReportToolbar({ searchTerm, onSearchChange, rows }) {
  const handleDownload = () => {
    downloadCsv("University_Days_Attendance_Report.csv", CSV_COLUMNS, rows);
  };

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Student ID or Course..."
          className="w-full rounded-2xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        onClick={handleDownload}
        disabled={rows.length === 0}
        className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        Download CSV
      </button>
    </div>
  );
}
