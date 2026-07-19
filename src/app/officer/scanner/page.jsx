"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanLine, Loader2, KeyRound, Camera } from "lucide-react";
import { recordAttendanceScan } from "@/lib/scanAttendance";
import SuccessCard from "@/components/officer/SuccessCard";
import ErrorCard from "@/components/officer/ErrorCard";
import ManualEntryForm from "@/components/officer/ManualEntryForm"; //Added feature

const SCANNER_ELEMENT_ID = "qr-reader";
const RESUME_DELAY_MS = 3000;

export default function ScanPage() {
  const scannerRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const isScannerRunningRef = useRef(false);

  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const [mode, setMode] = useState("scan"); // "scan" | "manual"
  const [manualId, setManualId] = useState("");
  const manualInputRef = useRef(null);

  const handleDecode = useCallback(async (decodedText) => {
    const scanner = scannerRef.current;

    if (!scanner || !isScannerRunningRef.current || isProcessing) return;

    scanner.pause(true);
    setIsProcessing(true);

    try {
      const outcome = await recordAttendanceScan(decodedText);

      setResult(
        outcome.success
          ? { type: "success", ...outcome.data }
          : { type: "error", reason: outcome.reason }
      );
    } finally {
      setIsProcessing(false);

      clearTimeout(resumeTimeoutRef.current);

      resumeTimeoutRef.current = setTimeout(() => {
        if (scannerRef.current && isScannerRunningRef.current) {
          try {
            scannerRef.current.resume();
          } catch {
          }
        }
      }, RESUME_DELAY_MS);
    }
  }, [isProcessing]);

  useEffect(() => {
    if (mode !== "scan") return;
    if (scannerRef.current) return;

    let mounted = true;

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          handleDecode,
          () => {}
        );

        if (mounted) {
          isScannerRunningRef.current = true;
        }
      } catch (err) {
        console.error("Failed to start scanner:", err);
      }
    };

    startScanner();

    return () => {
      mounted = false;

      clearTimeout(resumeTimeoutRef.current);

      const currentScanner = scannerRef.current;
      scannerRef.current = null;

      if (!currentScanner) return;

      const safeClear = () => {
        try {
          // Ayaw butangi og .catch() ang clear() kay dili man siya Promise. Kung gusto kag error handling, gamita ang try...catch
          currentScanner.clear();
        } catch {
          // Ignore if there's nothing to clear.
        }
      };

      if (isScannerRunningRef.current) {
        currentScanner
          .stop()
          .catch(() => {
            // Ignore "scanner is not running" errors.
          })
          .finally(() => {
            isScannerRunningRef.current = false;
            safeClear();
          });
      } else {
        safeClear();
      }
    };
  }, [handleDecode, mode]);

  // --- Manual submit uses the exact same recordAttendanceScan call and result handling ---
  const handleManualSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const value = manualId.trim();
      if (!value || isProcessing) return;

      setIsProcessing(true);

      try {
        const outcome = await recordAttendanceScan(value);

        setResult(
          outcome.success
            ? { type: "success", ...outcome.data }
            : { type: "error", reason: outcome.reason }
        );
      } finally {
        setIsProcessing(false);
        setManualId("");
        manualInputRef.current?.focus();
      }
    },
    [manualId, isProcessing]
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">QR Scanner</h1>
          <p className="mt-2 text-gray-500">
            Scan a student&apos;s QR code, or enter their ID manually if a
            code isn&apos;t available.
          </p>
        </div>

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

        {/* Scanner view */}
        <div className={mode === "scan" ? "block" : "hidden"}>
          <div
            id={SCANNER_ELEMENT_ID}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50"
          />
        </div>

        {/* MANUAL LOGIC */}
        {mode === "manual" && (
          <ManualEntryForm
            ref={manualInputRef}
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            onSubmit={handleManualSubmit}
            isProcessing={isProcessing}
          />
        )}

        <div className="mt-6">
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
                {mode === "scan"
                  ? "Waiting for QR code..."
                  : "Enter a student ID above and press Record Attendance."}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}