"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanLine, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { recordAttendanceScan } from "@/lib/scanAttendance";
import SuccessCard from "@/components/officer/SuccessCard";
import ErrorCard from "@/components/officer/ErrorCard";

const SCANNER_ELEMENT_ID = "qr-reader";
const RESUME_DELAY_MS = 3000;

export default function ScanPage() {
  const scannerRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);

    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        (decodedText) => handleDecode(decodedText),
        () => {},
      )
      .catch(console.error);

    return () => {
      clearTimeout(resumeTimeoutRef.current);

      const cleanup = async () => {
        if (!scannerRef.current) return;

        try {
          const state = scannerRef.current.getState();

          if (state === 2 || state === 3) {
            await scannerRef.current.stop();
          }

          await scannerRef.current.clear();
        } catch (err) {
          console.warn("Cleanup:", err.message);
        }

        scannerRef.current = null;
      };

      cleanup();
    };
  }, []);

  const handleDecode = async (decodedText) => {
    scannerRef.current?.pause(true);
    setIsProcessing(true);

    const outcome = await recordAttendanceScan(decodedText);

    setIsProcessing(false);
    setResult(
      outcome.success
        ? { type: "success", ...outcome.data }
        : { type: "error", reason: outcome.reason },
    );

    resumeTimeoutRef.current = setTimeout(() => {
      scannerRef.current?.resume();
    }, RESUME_DELAY_MS);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    clearTimeout(resumeTimeoutRef.current);

    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();

        if (state === 2 || state === 3) {
          await scannerRef.current.stop();
        }

        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Scanner cleanup:", err.message);
      }

      scannerRef.current = null;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      setLoggingOut(false);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">QR Scanner</h1>
            <p className="mt-2 text-gray-500">Scan a student&apos;s QR Code.</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
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

        {/* Live Camera */}
        <div
          id={SCANNER_ELEMENT_ID}
          className="overflow-hidden rounded-3xl border border-gray-200"
        />

        {/* Result */}
        <div className="mt-8">
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-blue-50 p-5 text-blue-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-semibold">
                Recording attendance...
              </span>
            </div>
          ) : result?.type === "success" ? (
            <SuccessCard
              data={{
                "Student Name": result.name,
                "Student ID": result.studentId,
                Course: result.course,
                "Year Level": result.yearLevel,
                "Time Recorded": result.time,
              }}
              status={result.action}
            />
          ) : result?.type === "error" ? (
            <ErrorCard reason={result.reason} />
          ) : (
            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="mb-3 flex items-center gap-2 text-blue-700">
                <ScanLine className="h-5 w-5" />
                <span className="font-semibold">Scanner Ready</span>
              </div>
              <div className="rounded-xl bg-white p-4 text-sm text-gray-500 ring-1 ring-blue-100">
                Waiting for QR Code...
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
