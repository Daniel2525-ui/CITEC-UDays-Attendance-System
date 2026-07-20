"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const ManualEntryForm = forwardRef(function ManualEntryForm(
  { value, onChange, onSubmit, isProcessing },
  ref,
) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-gray-200 bg-gray-50 p-6"
    >
      <label
        htmlFor="manual-student-id"
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        Student ID
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="manual-student-id"
          ref={ref}
          type="text"
          inputMode="numeric"
          autoFocus
          value={value}
          onChange={onChange}
          placeholder="e.g. 2021-00123"
          disabled={isProcessing}
          className="w-full flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none ring-blue-200 placeholder:text-gray-400 focus:ring-2 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isProcessing || !value.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Record Attendance"
          )}
        </button>
      </div>
    </form>
  );
});

export default ManualEntryForm;
