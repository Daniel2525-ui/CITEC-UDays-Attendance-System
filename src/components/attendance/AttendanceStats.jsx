"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ClipboardList,
} from "lucide-react";

export default function AttendanceStats({ rows = [] }) {
  const stats = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        if (row.status === "Complete") acc.present += 1;
        else if (row.status === "Timed In") acc.incomplete += 1;
        else if (row.status === "Absent") acc.absent += 1;
        acc.total += 1;
        return acc;
      },
      { present: 0, incomplete: 0, absent: 0, total: 0 },
    );
  }, [rows]);

  const cards = [
    {
      label: "Present",
      value: stats.present,
      icon: CheckCircle2,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      label: "Incomplete",
      value: stats.incomplete,
      icon: AlertTriangle,
      bg: "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      label: "Absent",
      value: stats.absent,
      icon: XCircle,
      bg: "bg-red-50",
      color: "text-red-600",
    },
    {
      label: "Total Records",
      value: stats.total,
      icon: ClipboardList,
      bg: "bg-blue-700/10",
      color: "text-blue-700",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, bg, color }) => (
        <div
          key={label}
          className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100"
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bg}`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-800">
            {value.toLocaleString()}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
