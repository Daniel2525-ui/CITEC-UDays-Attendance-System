"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanLine, Loader2 } from "lucide-react";
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

  useEffect(() => {
    if (scannerRef.current) return;

    const html5QrCode = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = html5QrCode;

    html5QrCode
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
        () => {

        },
      )
      .catch((err) => {
        console.error(err);
      });

    return () => {
      clearTimeout(resumeTimeoutRef.current);
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            scannerRef.current?.clear();
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecode = async (decodedText) => {
    // Pause the camera stream while this scan is processed and its result
    // is shown, so the same code isn't re-read many times per second.
    scannerRef.current?.pause(true);
    setIsProcessing(true);

    const outcome = await recordAttendanceScan(decodedText);

    setIsProcessing(false);
    setResult(
      outcome.success
        ? { type: "success", ...outcome.data }
        : { type: "error", reason: outcome.reason },
    );

    // Give the officer a moment to read the result, then automatically
    // resume scanning for the next student.
    resumeTimeoutRef.current = setTimeout(() => {
      scannerRef.current?.resume();
    }, RESUME_DELAY_MS);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">QR Scanner</h1>
          <p className="mt-2 text-gray-500">Scan a student's QR Code.</p>
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
