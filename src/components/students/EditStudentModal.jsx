"use client";

import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EditStudentModal({
  student,
  onClose,
  onUpdated,
}) {
  const [fullName, setFullName] = useState(student?.full_name ?? "");
  const [course, setCourse] = useState(student?.course ?? "");
  const [yearLevel, setYearLevel] = useState(student?.year_level ?? "");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student?.id) return;

    try {
      setSaving(true);
      setErrorMsg("");

      const { error } = await supabase
        .from("students")
        .update({
          full_name: fullName,
          course,
          year_level: yearLevel,
        })
        .eq("id", student.id);

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      onUpdated?.({
        ...student,
        full_name: fullName,
        course,
        year_level: yearLevel,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={saving ? undefined : onClose}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/10 ring-1 ring-gray-100 sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700/10">
            <Pencil className="h-5 w-5 text-blue-700" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Edit Student
            </h2>
            <p className="text-sm text-gray-500">
              {student?.student_id}
            </p>
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="full_name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Student Name
            </label>

            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            />
          </div>

          {/* Course */}
          <div>
            <label
              htmlFor="course"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Course
            </label>

            <input
              id="course"
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            />
          </div>

          {/* Year Level */}
          <div>
            <label
              htmlFor="year_level"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Year Level
            </label>

            <select
              id="year_level"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            >
              <option value="" disabled>
                Select year level
              </option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/25 transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-700 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}