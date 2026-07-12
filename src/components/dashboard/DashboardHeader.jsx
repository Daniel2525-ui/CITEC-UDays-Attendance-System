"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function DashboardHeader() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeLabel = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          University Days 2026 Attendance Overview
        </p>
      </div>

      {/* Live clock */}
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-md shadow-blue-900/5 ring-1 ring-gray-100">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-700/10">
          <Clock className="h-4 w-4 text-blue-700" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">{dateLabel}</p>
          <p className="text-lg font-bold tabular-nums text-gray-800">
            {timeLabel}
          </p>
        </div>
      </div>
    </div>
  );
}