"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, QrCode, ClipboardList, ScanLine } from "lucide-react";

const NAV_ITEMS = [
  { href: "/officer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/officer/scanner", label: "QR Scanner", icon: QrCode },
  { href: "/officer/recent", label: "Recent Scans", icon: ClipboardList },
];

export default function OfficerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-gray-100 bg-white px-4 py-6">
      <div className="flex items-center gap-3 px-2 pb-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600">
          <ScanLine className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-800">CITEC Portal</p>
          <p className="text-xs text-gray-400">Officer Panel</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/officer" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
