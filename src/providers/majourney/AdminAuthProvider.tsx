"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { ApiError, getApiBaseUrl } from "@/lib/admin-api-client";
import type { AdminUser } from "@/types/admin.types";

interface AdminAuthContextValue {
  loggedIn: boolean;
  /** False until the session lookup resolves, so the gate never flashes. */
  hydrated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

/**
 * Session state for the admin panel.
 *
 * There is no token here. The API sets an httpOnly cookie on `api.areydra.com`;
 * the browser sends it on every admin call because the frontend is same-site and
 * requests opt in with `credentials: "include"`. JavaScript can only ever
 * observe "who is signed in", never the credential.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // The session read is an external-system read, so it belongs in a mount
  // effect, and it must not set state after unmount.
  /* eslint-disable react-hooks/set-state-in-effect -- session read on mount */
  useEffect(function hydrateSessionFromCookie() {
    let cancelled = false;

    let base: string;
    try {
      base = getApiBaseUrl();
    } catch {
      setHydrated(true);
      return;
    }

    fetch(new URL("/auth/session", base), { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        if (cancelled) return;
        if (!response.ok) {
          setUser(null);
          return;
        }
        const body = (await response.json()) as { user?: AdminUser };
        setUser(body.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(new URL("/admin/login", getApiBaseUrl()).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
      cache: "no-store",
    });

    const body = (await response.json().catch(() => null)) as {
      user?: AdminUser;
      error?: { code?: string; message?: string };
    } | null;

    if (!response.ok) {
      throw new ApiError(
        response.status,
        body?.error?.code ?? "LOGIN_FAILED",
        body?.error?.message ?? "Could not sign in. Try again.",
      );
    }

    setUser(body?.user ?? null);
  }, []);

  const logout = useCallback(async () => {
    // Clear the UI first: the cookie is server-side state, and a signed-out
    // panel should never keep rendering data while a request is in flight.
    setUser(null);
    try {
      await fetch(new URL("/auth/logout", getApiBaseUrl()).toString(), {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      // The next session read settles it.
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ loggedIn: !!user, hydrated, user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export default AdminAuthProvider;
