import { FileBarChart } from "lucide-react";

export default function ReportTable({ rows, loading }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
      <div className="overflow-x-auto rounded-2xl ring-1 ring-gray-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Year Level</th>
              <th className="px-4 py-3">Days Present</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-10 text-center text-sm text-gray-500">
                  Loading report...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-10">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <FileBarChart className="h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">
                      No matching students found.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.studentId} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-semibold text-gray-700">{row.studentId}</td>
                  <td className="px-4 py-3 text-gray-600">{row.course}</td>
                  <td className="px-4 py-3 text-gray-600">{row.yearLevel}</td>
                  <td className="px-4 py-3 text-gray-600">{row.daysPresent}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
