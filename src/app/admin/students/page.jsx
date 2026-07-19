"use client";
import { Search, QrCode, Pencil, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import QrModal from "@/components/students/QrModal.jsx";
import EditStudentModal from "@/components/students/EditStudentModal";
import AddStudentModal from "@/components/students/AddStudentModal"; //added feature

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.from("students").select("*");

      if (error) {
        console.error("error.message ");
        return;
      }

      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Remove ${student.full_name} (${student.student_id}) from the student list? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(student.id);

    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", student.id);

      if (error) {
        console.error(error.message);
        window.alert("Couldn't delete this student. Please try again.");
        return;
      }

      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStudents = students.filter((student) => {
    return (
      student.student_id.includes(search) ||
      student.full_name.toLowerCase().includes(search.toLocaleLowerCase())
    );
  });

  return (
    <main className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
              Students
            </h1>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage enrolled students for University Days 2026.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Student ID or Student Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            />
          </div>
        </div>

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
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      Loading Students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      {students.length === 0
                        ? "No students yet. Click \u201cAdd Student\u201d to create one."
                        : "No students match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(
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
                          <button
                            onClick={() => {
                              setSelectedStudent({
                                id,
                                student_id,
                                full_name,
                              });

                              setShowQRModal(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white"
                          >
                            <QrCode className="h-4 w-4" />
                            View QR
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedStudent({
                                  id,
                                  student_id,
                                  full_name,
                                  course,
                                  year_level,
                                });
                                setShowEditModal(true);
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-700"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete({ id, student_id, full_name })
                              }
                              disabled={deletingId === id}
                              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:border-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              {deletingId === id ? "Removing..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showQRModal && (
        <QrModal
          student={selectedStudent}
          onClose={() => {
            setShowQRModal(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {showEditModal && (
        <EditStudentModal
          student={selectedStudent}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStudent(null);
          }}
          onUpdated={(updated) => {
            setStudents((prev) =>
              prev.map((student) =>
                student.id === updated.id
                  ? { ...student, ...updated }
                  : student,
              ),
            );
          }}
        />
      )}
      
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onCreated={(created) => {
            setStudents((prev) => [...prev, created]);
            setShowAddModal(false);
          }}
        />
      )}
    </main>
  );
}