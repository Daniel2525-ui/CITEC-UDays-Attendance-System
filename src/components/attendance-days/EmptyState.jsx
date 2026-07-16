import { CalendarDays } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-gray-100">
      <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />
      <p className="mt-3 text-sm font-medium text-gray-500">
        No attendance days have been created yet.
      </p>
    </div>
  );
}
