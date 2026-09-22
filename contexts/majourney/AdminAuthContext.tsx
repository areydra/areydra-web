"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { publicRequest } from "@/lib/majourney/api-client";

const TOKEN_KEY = "portfolio-admin-token";
const EXPIRES_KEY = "portfolio-admin-token-expires-at";

type LoginResponse = { token: string; expiresAt: string };

type AdminAuthContextValue = {
  loggedIn: boolean;
  hydrated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function readStoredToken(): string | null {
  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const expiresAt = window.localStorage.getItem(EXPIRES_KEY);
    if (!token || !expiresAt) return null;
    if (new Date(expiresAt).getTime() <= Date.now()) return null;
    return token;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setToken(readStoredToken());
    setHydrated(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // The backend issues a stateless ~7-day JWT — no refresh flow, no
    // /logout endpoint (see the backend's technical design doc, §4).
    const response = await publicRequest<LoginResponse>("/admin/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(response.token);
    try {
      window.localStorage.setItem(TOKEN_KEY, response.token);
      window.localStorage.setItem(EXPIRES_KEY, response.expiresAt);
    } catch {
      // Ignore write failures (e.g. private browsing) — session just won't persist.
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(EXPIRES_KEY);
    } catch {
      // Ignore write failures.
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ loggedIn: !!token, hydrated, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
