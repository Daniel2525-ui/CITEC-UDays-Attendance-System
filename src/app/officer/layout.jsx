"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSessionWithRole } from "@/lib/auth-helpers";

export default function OfficerLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      const { session, role } = await getSessionWithRole();

      if (!isMounted) return;

      if (!session) {
        router.replace("/");
        return;
      }

      if (role !== "officer") {
        router.replace("/admin/dashboard");
        return;
      }

      setChecking(false);
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking access...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
