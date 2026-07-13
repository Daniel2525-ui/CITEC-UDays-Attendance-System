"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabse";

const getTodayDate = () => new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

export default function AttendanceControl() {
  const [dayRecord, setDayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchActiveDay();
  }, []);

  const fetchActiveDay = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("attendance_days")
        .select("*")
        .eq("attendance_date", getTodayDate())
        .maybeSingle();

      if (error) {
        console.error(error.message);
        return;
      }

      setDayRecord(data);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Derived state — driven by two DB columns:
   *   attendance_open | time_out_enabled | meaning
   *   -----------------|-------------------|---------------------
   *   true             | false             | Time In enabled
   *   true             | true              | Time Out enabled
   *   false            | (any)             | Attendance closed
   *
   * Time In and Time Out are mutually exclusive phases, but both
   * toggles are ALWAYS visible and clickable — the admin has full
   * manual control at any point, nothing ever hides itself.
   */
  const isOpen = dayRecord?.attendance_open ?? false;
  const timeInEnabled = isOpen && !dayRecord?.time_out_enabled;
  const timeOutEnabled = isOpen && !!dayRecord?.time_out_enabled;

  const phaseLabel = timeInEnabled
    ? "TIME IN"
    : timeOutEnabled
      ? "TIME OUT"
      : "—";

  // Writes changes to today's row — creates it first if it doesn't exist yet.
  const applyChanges = async (changes) => {
    try {
      setUpdating(true);

      if (dayRecord?.id) {
        const { data, error } = await supabase
          .from("attendance_days")
          .update(changes)
          .eq("id", dayRecord.id)
          .select()
          .single();

        if (error) {
          console.error(error.message);
          return;
        }

        setDayRecord(data);
      } else {
        // No row for today yet — figure out the next day_number and create it.
        const { data: lastDay } = await supabase
          .from("attendance_days")
          .select("day_number")
          .order("day_number", { ascending: false })
          .limit(1)
          .maybeSingle();

        const nextDayNumber = (lastDay?.day_number || 0) + 1;

        const { data, error } = await supabase
          .from("attendance_days")
          .insert({
            day_number: nextDayNumber,
            attendance_date: getTodayDate(),
            attendance_open: false,
            time_out_enabled: false,
            ...changes,
          })
          .select()
          .single();

        if (error) {
          console.error(error.message);
          return;
        }

        setDayRecord(data);
      }
    } finally {
      setUpdating(false);
    }
  };

  // Admin toggles Time In on/off directly — always available.
  const handleToggleTimeIn = () => {
    if (timeInEnabled) {
      // Turning Time In off with nothing else active closes attendance.
      applyChanges({ attendance_open: false, time_out_enabled: false });
    } else {
      applyChanges({ attendance_open: true, time_out_enabled: false });
    }
  };

  // Admin toggles Time Out on/off directly — always available.
  const handleToggleTimeOut = () => {
    if (timeOutEnabled) {
      applyChanges({ attendance_open: false, time_out_enabled: false });
    } else {
      applyChanges({ attendance_open: true, time_out_enabled: true });
    }
  };

  return (
    <div className="mb-8 rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Attendance Control
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage the current University Days attendance session.
          </p>
        </div>

        {/* Status + Phase */}
        <div className="flex gap-6 sm:gap-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <p className="text-base font-bold text-gray-800">
                {loading ? "..." : isOpen ? "OPEN" : "CLOSED"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Current Phase
            </p>
            <p className="mt-1 text-base font-bold text-blue-700">
              {loading ? "..." : phaseLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Rows — always visible, admin has full manual control */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={handleToggleTimeIn}
          disabled={loading || updating}
          className="flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4 ring-1 ring-gray-100 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <p className="text-sm font-semibold text-gray-700">Time In</p>
          {timeInEnabled ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400">
              <XCircle className="h-4 w-4" />
              Disabled
            </span>
          )}
        </button>

        <button
          onClick={handleToggleTimeOut}
          disabled={loading || updating}
          className="flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4 ring-1 ring-gray-100 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <p className="text-sm font-semibold text-gray-700">Time Out</p>
          {timeOutEnabled ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400">
              <XCircle className="h-4 w-4" />
              Disabled
            </span>
          )}
        </button>
      </div>

      {updating && (
        <p className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Updating attendance session...
        </p>
      )}
    </div>
  );
}
