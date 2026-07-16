"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import OfficerSidebar from "@/components/officer/OfficerSidebar";

export default function OfficerRootLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <OfficerSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50 h-full">
            <OfficerSidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 lg:hidden">
          <p className="text-base font-bold text-gray-800">Officer Panel</p>
          <button
            onClick={() => setMobileNavOpen(true)}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-50"
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {mobileNavOpen && (
          <button
            onClick={() => setMobileNavOpen(false)}
            className="fixed right-4 top-4 z-50 rounded-xl bg-white p-2 text-gray-500 shadow-lg lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
