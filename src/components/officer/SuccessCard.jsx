import { CheckCircle2 } from "lucide-react";

const FIELDS = [
  { label: "Student Name", value: "Juan Dela Cruz" },
  { label: "Student ID", value: "2024-0001" },
  { label: "Course", value: "BS Information Technology" },
  { label: "Year Level", value: "2nd Year" },
  { label: "Time Recorded", value: "8:05 AM" },
];

export default function SuccessCard({ data = {}, status = "TIME IN" }) {
  const fields = FIELDS.map((field) => ({
    ...field,
    value: data[field.label] ?? field.value,
  }));

  return (
    <div className="rounded-3xl bg-green-50 p-6 ring-1 ring-green-100 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-600">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-base font-bold text-green-700 sm:text-lg">
          Attendance Recorded Successfully
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs font-medium uppercase tracking-wide text-green-600/70">
              {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {value}
            </p>
          </div>
        ))}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-green-600/70">
            Status
          </p>
          <span className="mt-1 inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}