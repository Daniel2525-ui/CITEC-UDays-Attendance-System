"use client";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

export default function QrModal({ student, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/10 ring-1 ring-gray-100 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Student QR Code
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Scan this code to record attendance
          </p>
        </div>

        {/* QR Code Placeholder */}
        <div className="mx-auto mb-6 flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
          <QRCodeSVG value={student?.student_id || ""} size={200} />
        </div>

        {/* Student Info */}
        <div className="mb-6 rounded-2xl bg-blue-700/5 p-4 text-center">
          <p className="text-base font-semibold text-gray-800">
            {student?.full_name}
          </p>
          <p className="text-sm text-gray-500">{student?.student_id}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/25 transition-colors hover:bg-blue-800">
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
