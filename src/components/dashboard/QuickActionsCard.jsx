"use client";
import { useRouter } from "next/navigation";
import { Users, FileText } from "lucide-react";
import QuickActionButton from "./QuickActionButton";

export default function QuickActionsCard() {
  const router = useRouter();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
      <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
      <p className="mt-1 text-sm text-gray-500">Jump to a common task</p>

      <div className="mt-5 space-y-3">
        <QuickActionButton
          icon={Users}
          label="Students"
          onClick={() => router.push("/admin/students")}
        />
        <QuickActionButton
          icon={FileText}
          label="Reports"
          onClick={() => router.push("/admin/reports")}
        />
      </div>
    </div>
  );
}