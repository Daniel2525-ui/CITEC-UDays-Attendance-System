"use client";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  CalendarX2,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const getTodayDate = () => new Date().toLocaleDateString("en-CA");

export default function AttendanceControl() {
  const [dayRecord, setDayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  const fetchTodayAttendance = async () => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("attendance_days")
      .select("*")
      .eq("attendance_date", getTodayDate())
      .maybeSingle();

    if (error) {
      setErrorMessage("Unable to load today's attendance session.");
      setLoading(false);
      return;
    }

    setDayRecord(data);
    setLoading(false);
  };

  const updateAttendanceSession = async (changes, successText) => {
    if (!dayRecord?.id) return;

    setUpdating(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("attendance_days")
      .update(changes)
      .eq("id", dayRecord.id)
      .select()
      .single();

    setUpdating(false);

    if (error) {
      setErrorMessage("Something went wrong while updating attendance.");
      return;
    }

    setDayRecord(data);
    setSuccessMessage(successText);
  };

  const handleOpenAttendance = () =>
    updateAttendanceSession(
      { attendance_open: true, time_out_enabled: false },
      "Time In is now open.",
    );

  const handleCloseAttendance = () =>
    updateAttendanceSession(
      { attendance_open: false, time_out_enabled: false },
      "Attendance has been closed.",
    );

  const handleEnableTimeOut = () =>
    updateAttendanceSession(
      { attendance_open: true, time_out_enabled: true },
      "Time Out is now enabled.",
    );

  const attendanceExists = !!dayRecord;
  const isOpen = dayRecord?.attendance_open ?? false;
  const isTimeOutEnabled = dayRecord?.time_out_enabled ?? false;

  const timeInActive = isOpen && !isTimeOutEnabled;
  const timeOutActive = isOpen && isTimeOutEnabled;

  const phaseLabel = !isOpen
    ? "CLOSED"
    : timeOutActive
      ? "TIME OUT"
      : "TIME IN";

  const phaseColor = !isOpen
    ? "text-gray-400"
    : timeOutActive
      ? "text-purple-700"
      : "text-blue-700";

  if (loading) {
    return (
      <div className="mb-8 flex items-center justify-center rounded-3xl bg-white p-10 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="ml-3 text-sm font-medium text-gray-400">
          Loading today's attendance session...
        </span>
      </div>
    );
  }

  if (!attendanceExists) {
    return (
      <div className="mb-8 rounded-3xl bg-white p-8 text-center shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 ring-1 ring-gray-100">
          <CalendarX2 className="h-7 w-7 text-gray-400" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-gray-800 sm:text-xl">
          No attendance session has been scheduled for today.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          Please create today's attendance schedule from the Attendance Days
          page.
        </p>

        {errorMessage && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-red-500">
            <AlertTriangle className="h-3.5 w-3.5" />
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Attendance Control
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Day {dayRecord.day_number} &middot; {dayRecord.attendance_date}
          </p>
        </div>

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
                {isOpen ? "OPEN" : "CLOSED"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Current Phase
            </p>
            <p className={`mt-1 text-base font-bold ${phaseColor}`}>
              {phaseLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          onClick={handleOpenAttendance}
          disabled={updating || timeInActive}
          className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          Enable Time In
        </button>

        <button
          onClick={handleEnableTimeOut}
          disabled={updating || !isOpen || timeOutActive}
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          Enable Time Out
        </button>

        <button
          onClick={handleCloseAttendance}
          disabled={updating || !isOpen}
          className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          Close Attendance
        </button>
      </div>

      {updating && (
        <p className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Updating attendance session...
        </p>
      )}

      {successMessage && (
        <p className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 flex items-center gap-2 text-xs font-medium text-red-500">
          <AlertTriangle className="h-3.5 w-3.5" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
