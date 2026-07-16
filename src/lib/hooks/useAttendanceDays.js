import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAttendanceDays() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchAttendanceDays();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  // ==========================================
  // FETCH
  // ==========================================
  const fetchAttendanceDays = async () => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("attendance_days")
      .select("*")
      .order("attendance_date", { ascending: false });

    if (error) {
      setErrorMessage("Unable to load attendance days.");
      setLoading(false);
      return;
    }

    setDays(data);
    setLoading(false);
  };

  // ==========================================
  // CREATE
  // ==========================================
  const createAttendanceDay = async (payload) => {
    const { error } = await supabase.from("attendance_days").insert({
      day_number: Number(payload.day_number),
      attendance_date: payload.attendance_date,
      time_in_start: payload.time_in_start || null,
      time_in_cutoff: payload.time_in_cutoff || null,
      attendance_open: false,
      time_out_enabled: false,
    });

    if (error) throw error;
  };

  // ==========================================
  // UPDATE
  // ==========================================
  const updateAttendanceDay = async (id, payload) => {
    const { error } = await supabase
      .from("attendance_days")
      .update({
        day_number: Number(payload.day_number),
        attendance_date: payload.attendance_date,
        time_in_start: payload.time_in_start || null,
        time_in_cutoff: payload.time_in_cutoff || null,
      })
      .eq("id", id);

    if (error) throw error;
  };

  // ==========================================
  // SAVE (create or update, used by the modal form)
  // ==========================================
  const saveAttendanceDay = async (form, editingDay) => {
    if (!form.day_number || !form.attendance_date) {
      setErrorMessage("Day number and attendance date are required.");
      return false;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      if (editingDay) {
        await updateAttendanceDay(editingDay.id, form);
        setSuccessMessage("Attendance day updated.");
      } else {
        await createAttendanceDay(form);
        setSuccessMessage("Attendance day created.");
      }

      await fetchAttendanceDays();
      return true;
    } catch (error) {
      setErrorMessage(
        error?.message?.includes("duplicate")
          ? "An attendance day with this date or day number already exists."
          : "Something went wrong while saving."
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================
  const deleteAttendanceDay = async (id) => {
    setDeletingId(id);
    setErrorMessage(null);

    const { error } = await supabase
      .from("attendance_days")
      .delete()
      .eq("id", id);

    setDeletingId(null);

    if (error) {
      setErrorMessage("Unable to delete this attendance day.");
      return;
    }

    setDays((prev) => prev.filter((day) => day.id !== id));
    setSuccessMessage("Attendance day deleted.");
  };

  return {
    days,
    loading,
    saving,
    deletingId,
    errorMessage,
    successMessage,
    saveAttendanceDay,
    deleteAttendanceDay,
  };
}
