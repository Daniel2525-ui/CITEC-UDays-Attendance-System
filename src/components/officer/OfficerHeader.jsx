"use client";

import { useEffect, useState } from "react";

export default function OfficerHeader() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dateLabel = now
    ? now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const timeLabel = now
    ? now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Welcome, Officer
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with today&apos;s attendance
          session.
        </p>
      </div>

      <div className="rounded-2xl bg-white px-5 py-3 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {dateLabel || "—"}
        </p>
        <p className="text-lg font-bold tabular-nums text-blue-600">
          {timeLabel || "—"}
        </p>
      </div>
    </div>
  );
}
