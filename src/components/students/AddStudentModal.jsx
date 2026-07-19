"use client";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function AddStudentModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    student_id: "",
    full_name: "",
    course: "",
    year_level: YEAR_LEVELS[0],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const student_id = form.student_id.trim();
    const full_name = form.full_name.trim();
    const course = form.course.trim();

    if (!student_id || !full_name || !course) {
      setError("Please fill in Student ID, Name, and Course.");
      return;
    }

    setIsSaving(true);

    try {
      const { data, error: insertError } = await supabase
        .from("students")
        .insert([
          {
            student_id,
            full_name,
            course,
            year_level: form.year_level,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error(insertError.message);
        setError(
          insertError.code === "23505"
            ? "A student with this ID already exists."
            : "Couldn't create this student. Please try again.",
        );
        return;
      }

      onCreated?.(data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Add Student</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enroll a new student for University Days 2026.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              value={form.student_id}
              onChange={updateField("student_id")}
              placeholder="e.g. 2021-00123"
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={updateField("full_name")}
              placeholder="e.g. Juan Dela Cruz"
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Course
            </label>
            <input
              type="text"
              value={form.course}
              onChange={updateField("course")}
              placeholder="e.g. BS Computer Science"
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Year Level
            </label>
            <select
              value={form.year_level}
              onChange={updateField("year_level")}
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
            >
              {YEAR_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}