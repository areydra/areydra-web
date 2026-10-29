"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import Field from "@/components/ui/Field";
import TextInput from "@/components/ui/TextInput";
import { useAdminAuth } from "@/providers/majourney/AdminAuthProvider";
import { ApiError } from "@/lib/admin-api-client";

const LoginPage = () => {
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
    <main
      id="main-content"
      className="bg-paper flex min-h-screen items-center justify-center p-6"
    >
      <form
        onSubmit={handleSubmit}
        className="border-ink box-border w-full max-w-95 border-4 bg-white p-10 shadow-[10px_10px_0_#111]"
      >
        <div className="border-ink bg-azure mb-5 h-10 w-10 border-[3px]" />
        <h1 className="text-ink m-0 mb-1 text-[22px] font-extrabold">Portfolio Admin</h1>
        <p className="text-ink-muted m-0 mb-6 text-sm">Sign in to manage your site content.</p>

        <Field label="Email">
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
            disabled={submitting}
          />
        </Field>

        <Field label="Password">
          <TextInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={submitting}
          />
        </Field>

        {error && <p className="text-danger-text m-0 mb-3 text-[13px] font-bold">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="border-ink bg-lime text-ink mt-3 w-full cursor-pointer border-[3px] py-2.75 text-sm font-extrabold shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
