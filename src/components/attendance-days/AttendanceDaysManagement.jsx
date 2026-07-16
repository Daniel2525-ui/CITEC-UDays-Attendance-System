"use client";
import { useState } from "react";
import { useAttendanceDays } from "@/lib/hooks/useAttendanceDays";
import AttendanceDaysHeader from "./AttendanceDaysHeader";
import AttendanceDaysTable from "./AttendanceDaysTable";
import AttendanceDayModal from "./AttendanceDayModal";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import InlineMessage from "./InlineMessage";

const emptyForm = {
  day_number: "",
  attendance_date: "",
  time_in_start: "",
  time_in_cutoff: "",
};

export default function AttendanceDaysManagement() {
  const {
    days,
    loading,
    saving,
    deletingId,
    errorMessage,
    successMessage,
    saveAttendanceDay,
    deleteAttendanceDay,
  } = useAttendanceDays();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null); // null = creating
  const [form, setForm] = useState(emptyForm);

  const openCreateModal = () => {
    const nextDayNumber =
      days.length > 0 ? Math.max(...days.map((d) => d.day_number)) + 1 : 1;

    setEditingDay(null);
    setForm({ ...emptyForm, day_number: nextDayNumber });
    setIsModalOpen(true);
  };

  const openEditModal = (day) => {
    setEditingDay(day);
    setForm({
      day_number: day.day_number,
      attendance_date: day.attendance_date,
      time_in_start: day.time_in_start || "",
      time_in_cutoff: day.time_in_cutoff || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDay(null);
    setForm(emptyForm);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const success = await saveAttendanceDay(form, editingDay);
    if (success) closeModal();
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
      <AttendanceDaysHeader onCreateClick={openCreateModal} />

      <InlineMessage type="success">{successMessage}</InlineMessage>
      <InlineMessage type="error">{errorMessage}</InlineMessage>

      <div className="mt-6">
        {loading ? (
          <LoadingState label="Loading attendance days..." />
        ) : days.length === 0 ? (
          <EmptyState />
        ) : (
          <AttendanceDaysTable
            days={days}
            deletingId={deletingId}
            onEdit={openEditModal}
            onDelete={deleteAttendanceDay}
          />
        )}
      </div>

      {isModalOpen && (
        <AttendanceDayModal
          form={form}
          editingDay={editingDay}
          saving={saving}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
