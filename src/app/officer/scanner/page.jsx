"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useQrScanner } from "@/lib/hooks/useQrScanner";
import OfficerScannerHeader from "@/components/officer/OfficerScannerHeader";
import ScannerCamera from "@/components/officer/ScannerCamera";
import ScannerResult from "@/components/officer/ScannerResult";

export default function ScanPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const { elementId, result, isProcessing, handleScanNext, stopScanner } =
    useQrScanner();

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

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <OfficerScannerHeader onLogout={handleLogout} loggingOut={loggingOut} />

        <ScannerCamera elementId={elementId} />

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
