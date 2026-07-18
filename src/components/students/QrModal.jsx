"use client";
import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

export default function QrModal({ student, onClose }) {
  const svgRef = useRef(null);

  const handleDownload = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const image = new Image();

    image.onload = () => {

      const scale = 4;
      const canvas = document.createElement("canvas");
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;

        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${student?.student_id || "student"}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };

    image.src = svgUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/10 ring-1 ring-gray-100 sm:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Student QR Code
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Scan this code to record attendance
          </p>
        </div>

        <div className="mx-auto mb-6 flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
          <QRCodeSVG
            ref={svgRef}
            value={student?.student_id || ""}
            size={200}
          />
        </div>

        <div className="mb-6 rounded-2xl bg-blue-700/5 p-4 text-center">
          <p className="text-base font-semibold text-gray-800">
            {student?.full_name}
          </p>
          <p className="text-sm text-gray-500">{student?.student_id}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleDownload}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/25 transition-colors hover:bg-blue-800"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
