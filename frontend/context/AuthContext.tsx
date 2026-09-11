"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logoutUser, loginWithGoogle, loginWithEmail, signupWithEmail } from "@/lib/auth";
import type { AuthUser } from "@/types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginGoogle: (role?: string) => Promise<AuthUser | null>;
  loginEmail: (email: string, password: string, role?: string) => Promise<AuthUser | null>;
  signupEmail: (name: string, email: string, password: string, role?: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  /** Update the in-memory user after a successful profile save (confirmed, not optimistic). */
  refreshUser: (updated: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginGoogle: async () => null,
  loginEmail: async () => null,
  signupEmail: async () => null,
  logout: async () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = React.useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user as AuthUser);
        return data.user;
      } else {
        if (res.status !== 401) {
          console.error("[AuthContext] /api/auth/me failed with status:", res.status);
        }
        setUser(null);
        return null;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[AuthContext] Network error reaching /api/auth/me:", message);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // 1. Instantly check backend HTTP-only cookie session on app startup
    fetchSession().finally(() => {
      if (isMounted) setLoading(false);
    });

    // 2. Listen for Firebase auth state changes (e.g. login/logout events)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchSession();
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchSession]);

  const handleLoginGoogle = async (role?: string) => {
    await loginWithGoogle(role);
    return await fetchSession();
  };

  const handleLoginEmail = async (email: string, pass: string, role?: string) => {
    await loginWithEmail(email, pass, role);
    return await fetchSession();
  };

  const handleSignupEmail = async (name: string, email: string, pass: string, role?: string) => {
    await signupWithEmail(name, email, pass, role);
    return await fetchSession();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("[AuthContext] Logout error:", err);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  /** Called by the profile page after a confirmed backend save to keep
   *  the in-memory user state consistent without a full page reload. */
  const refreshUser = (updated: AuthUser) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginGoogle: handleLoginGoogle,
        loginEmail: handleLoginEmail,
        signupEmail: handleSignupEmail,
        logout: handleLogout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);