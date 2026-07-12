"use client";
import { Users, Search, QrCode, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabse";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");

    if (error) {
      console.error("error.message ");
      return;
    }

    setStudents(data);
  };

  const bsitCount = students.filter(
    (student) => student.program === "BSIT",
  ).length;

  return (
    <main className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            Students
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage enrolled students for University Days 2026.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Student ID or Student Name..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            />
          </div>
        </div>

        {/* Summary Card */}
        <div className="mb-8 flex w-full items-center gap-4 rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-700/10">
            <Users className="h-7 w-7 text-blue-700" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-800">
              {students.length}
            </p>
          </div>
        </div>
        {bsitCount}

        {/* Students Table */}
        <div className="rounded-3xl bg-white p-2 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-100 border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student ID
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student Name
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Course
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Year Level
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    QR Code
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map(
                  ({ id, student_id, full_name, course, year_level }) => (
                    <tr
                      key={id}
                      className="border-b border-gray-50 transition-colors hover:bg-gray-50/60"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">
                        {student_id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {full_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {course}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {year_level}
                      </td>
                      <td className="px-4 py-4">
                        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-700/25 transition-colors hover:bg-blue-800">
                          <QrCode className="h-4 w-4" />
                          View QR
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-700">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
