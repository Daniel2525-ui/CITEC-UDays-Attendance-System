"use client";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQrScanner } from "@/lib/hooks/useQrScanner";
import OfficerScannerHeader from "@/components/officer/OfficerScannerHeader";
import ScannerCamera from "@/components/officer/ScannerCamera";
import ScannerResult from "@/components/officer/ScannerResult";
import ManualEntryForm from "@/components/officer/ManualEntryForm";
export default function ScanPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const {
    elementId,
    result,
    isProcessing,
    handleScanNext,
    recordManualId,
    stopScanner,
  } = useQrScanner();

  const [mode, setMode] = useState("scan"); // "scan" | "manual"
  const [manualId, setManualId] = useState("");
  const manualInputRef = useRef(null);

  const handleLogout = async () => {
    setLoggingOut(true);
    await stopScanner();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error.message);
      setLoggingOut(false);
      return;
    }
    router.replace("/");
  };

  const handleManualSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const value = manualId.trim();
      if (!value || isProcessing) return;

      if (student_id.length !== 11) {
        alert("Student ID must be exactly 11 digits.");
        return;
      }

      await recordManualId(value);
      setManualId("");
      manualInputRef.current?.focus();
    },
    [manualId, isProcessing, recordManualId],
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <OfficerScannerHeader onLogout={handleLogout} loggingOut={loggingOut} />

        {/* Mode toggle */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode("scan")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
              mode === "scan"
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Camera className="h-4 w-4" />
            Scan QR Code
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
              mode === "manual"
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            Enter ID Manually
          </button>
        </div>

        <div className={mode === "scan" ? "block" : "hidden"}>
          <ScannerCamera elementId={elementId} />
        </div>

        {mode === "manual" && (
          <ManualEntryForm
            ref={manualInputRef}
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            onSubmit={handleManualSubmit}
            isProcessing={isProcessing}
          />
        )}

        <div className="mt-8">
          <ScannerResult
            isProcessing={isProcessing}
            result={result}
            onScanNext={handleScanNext}
          />
        </div>
      </div>
    </main>
  );
}
