import { Loader2 } from "lucide-react";

export default function LoadingState({ label }) {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      <span className="ml-3 text-sm font-medium text-gray-400">{label}</span>
    </div>
  );
}
