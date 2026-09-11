"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Sprout } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#216869] to-[#49A078] flex items-center justify-center animate-pulse shadow-lg shadow-emerald-900/40">
          <Sprout className="w-6 h-6 text-white animate-spin" />
        </div>
        <p className="text-sm font-bold tracking-wider text-slate-400 uppercase">
          Securing Farm Session...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
