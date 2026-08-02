import { Loader2, LogOut } from "lucide-react";

export default function OfficerScannerHeader({ onLogout, loggingOut }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-3 sm:mb-8 sm:gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          QR Scanner
        </h1>
        <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">
          Scan a student&apos;s QR Code.
        </p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 ring-1 ring-red-100 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
      >
        {loggingOut ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin sm:h-4 sm:w-4" />
        ) : (
          <LogOut className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        )}
        {loggingOut ? "Signing out..." : "Logout"}
      </button>
    </div>
  );
}