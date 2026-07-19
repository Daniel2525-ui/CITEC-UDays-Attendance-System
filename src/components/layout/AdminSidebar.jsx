"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  FileBarChart,
  QrCode,
  LogOut,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: FileBarChart },
];

//added feature logout
function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

const handleLogout = async () => {
  if (isLoggingOut) return;

  setIsLoggingOut(true);

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      return;
    }

    // Redirect to the login page 
    router.replace("/");
    router.refresh();
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setIsLoggingOut(false);
  }
};
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white">
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-700">
          <QrCode className="h-6 w-6 text-yellow-400" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-gray-800">
            CITEC Portal
          </p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            pathname?.startsWith(href + "/") ||
            (href === "/admin/dashboard" && pathname === "/admin");

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-700 text-white shadow-md shadow-blue-700/25"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-yellow-400" : "text-gray-400"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-2">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <LogOut className="h-5 w-5 text-gray-400" />
          )}
          {isLoggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-5">
        <p className="text-xs leading-relaxed text-gray-400">
          College of Information Technology Education and Computing
        </p>
      </div>
    </aside>
  );
}

export default AdminSidebar;