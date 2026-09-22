"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/majourney/AdminAuthContext";
import { ApiError } from "@/lib/majourney/api-client";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter an email and password.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/majourney/profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ebe7d9] p-6">
      <form
        onSubmit={handleSubmit}
        className="box-border w-full max-w-[380px] border-4 border-[#111] bg-white p-10 shadow-[10px_10px_0_#111]"
      >
        <div className="mb-5 h-10 w-10 border-[3px] border-[#111] bg-[#1410ff]" />
        <h1 className="m-0 mb-1 text-[22px] font-extrabold text-[#111]">Portfolio Admin</h1>
        <p className="m-0 mb-6 text-sm text-[#333]">Sign in to manage your site content.</p>

        <label className="mb-1.5 block text-[13px] font-semibold text-[#111]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={submitting}
          className="mb-4 box-border w-full border-[3px] border-[#111] px-3 py-2.5 text-sm font-[inherit] disabled:opacity-60"
        />

        <label className="mb-1.5 block text-[13px] font-semibold text-[#111]">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={submitting}
          className="mb-2 box-border w-full border-[3px] border-[#111] px-3 py-2.5 text-sm font-[inherit] disabled:opacity-60"
        />

        {error && <p className="m-0 mb-3 text-[13px] font-bold text-[#dc2626]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 w-full cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] py-[11px] text-sm font-extrabold text-[#111] shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
