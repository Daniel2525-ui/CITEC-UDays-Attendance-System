import { Loader2, LogOut } from "lucide-react";

export default function OfficerScannerHeader({ onLogout, loggingOut }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">QR Scanner</h1>
        <p className="mt-2 text-gray-500">Scan a student&apos;s QR Code.</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="flex shrink-0 items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-100 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {loggingOut ? "Signing out..." : "Logout"}
      </button>
    </div>
  );
}