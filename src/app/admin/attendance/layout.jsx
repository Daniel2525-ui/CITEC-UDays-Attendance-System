"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, ToggleLeft, CalendarRange } from "lucide-react";

const TABS = [
  { label: "Records", href: "/admin/attendance", icon: ClipboardList },
  { label: "Control", href: "/admin/attendance/control", icon: ToggleLeft },
  { label: "Schedule", href: "/admin/attendance/days", icon: CalendarRange },
];

export default function AttendanceLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="border-b border-gray-100 bg-white px-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto pt-6">
          {TABS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-t-xl border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}
