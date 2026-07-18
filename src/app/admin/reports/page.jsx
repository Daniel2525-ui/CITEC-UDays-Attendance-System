"use client";
import { FileBarChart } from "lucide-react";
import { useAttendanceReport } from "@/lib/hooks/useAttendanceReport";
import ReportSummaryCards from "@/components/reports/ReportSummaryCards";
import ReportToolbar from "@/components/reports/ReportToolbar";
import ReportTable from "@/components/reports/ReportTable";

export default function ReportsPage() {
  const { rows, summary, loading, errorMessage, searchTerm, setSearchTerm } =
    useAttendanceReport();

  return (
    <div className="w-full px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
            <FileBarChart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
              University Days Attendance Report
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Final attendance totals for submission to the Program Dean.
            </p>
          </div>
        </div>

        {errorMessage && (
          <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
            {errorMessage}
          </p>
        )}

        <ReportSummaryCards summary={summary} loading={loading} />
        <ReportToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} rows={rows} />
        <ReportTable rows={rows} loading={loading} />
      </div>
    </div>
  );
}
