"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanLine } from "lucide-react";

export default function ScanPage() {
  const scannerRef = useRef(null);
  const [decodedText, setDecodedText] = useState("");

  useEffect(() => {
    if (scannerRef.current) return;

    const html5QrCode = new Html5Qrcode("qr-reader");
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
        (decodedText) => {
          setDecodedText(decodedText);

          // Stop after one successful scan
          html5QrCode.stop();
        },
        () => {
          // Ignore scan failures
        },
      )
      .catch((err) => {
        console.error(err);
      });

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            scannerRef.current.clear();
          });
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">QR Scanner</h1>

          <p className="mt-2 text-gray-500">Scan a student's QR Code.</p>
        </div>

        {/* Live Camera */}
        <div
          id="qr-reader"
          className="overflow-hidden rounded-3xl border border-gray-200"
        />

        {/* Result */}
        <div className="mt-8 rounded-2xl bg-blue-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-blue-700">
            <ScanLine className="h-5 w-5" />
            <span className="font-semibold">Scanned QR Code</span>
          </div>

          <div className="rounded-xl bg-white p-4 font-mono text-gray-700 ring-1 ring-blue-100">
            {decodedText || "Waiting for QR Code..."}
          </div>
        </div>
      </div>
    </main>
  );
}
