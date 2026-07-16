import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function InlineMessage({ type, children }) {
  if (!children) return null;

  const isError = type === "error";
  const Icon = isError ? AlertTriangle : CheckCircle2;

  return (
    <p
      className={`mt-4 flex items-center gap-2 text-xs font-medium ${
        isError ? "text-red-500" : "text-green-600"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}
