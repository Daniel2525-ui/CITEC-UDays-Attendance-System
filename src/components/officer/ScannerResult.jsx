import { ScanLine, Loader2, ArrowRight } from "lucide-react";
import SuccessCard from "./SuccessCard";
import ErrorCard from "./ErrorCard";

function ScanNextButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
    >
      Scan Next Student
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export default function ScannerResult({ isProcessing, result, onScanNext }) {
  if (isProcessing) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-blue-50 p-5 text-blue-700">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-semibold">Recording attendance...</span>
      </div>
    );
  }

  if (result?.type === "success") {
    return (
      <>
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
        <ScanNextButton onClick={onScanNext} />
      </>
    );
  }

  if (result?.type === "error") {
    return (
      <>
        <ErrorCard reason={result.reason} />
        <ScanNextButton onClick={onScanNext} />
      </>
    );
  }

  return (
    <div className="rounded-2xl bg-blue-50 p-5">
      <div className="mb-3 flex items-center gap-2 text-blue-700">
        <ScanLine className="h-5 w-5" />
        <span className="font-semibold">Scanner Ready</span>
      </div>
      <div className="rounded-xl bg-white p-4 text-sm text-gray-500 ring-1 ring-blue-100">
        Waiting for QR Code...
      </div>
    </div>
  );
}
