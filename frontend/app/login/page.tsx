"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve query parameters if they exist, but set auth=login
    const params = new URLSearchParams(searchParams.toString());
    params.set("auth", "login");
    router.replace(`/?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0A100D] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A100D] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
      </div>
    }>
      <LoginRedirect />
    </Suspense>
  );
}
