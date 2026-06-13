"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/supabase/browser-client";

type AuthMode = "login" | "register";

const copy = {
  login: {
    button: "Sign in",
    switchText: "Don't have an account?",
    switchHref: "/register",
    switchLabel: "Create one",
    success: "",
  },
  register: {
    button: "Create account",
    switchText: "Already have an account?",
    switchHref: "/login",
    switchLabel: "Sign in",
    success: "Check your email to confirm your account, then come back and sign in.",
  },
};

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isRegister = mode === "register";
  const rawNextPath = searchParams.get("next") || "/";
  const nextPath = rawNextPath.startsWith("/") && !rawNextPath.startsWith("//") ? rawNextPath : "/";
  const callbackError = searchParams.get("error");

  const getSupabase = () => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return null;
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { data, error: authError } = isRegister
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (!isRegister && !data.session) {
      setError("Sign in did not create a session. Confirm your email, then try again.");
      return;
    }

    if (isRegister && data.user?.identities?.length === 0) {
      setError("An account with this email already exists. Sign in instead.");
      return;
    }

    if (isRegister && !data.session) {
      setMessage(copy.register.success);
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  return (
    <div className="w-full max-w-[400px] bg-white border border-[#E8E8E8] rounded-[14px] p-9">
      <div className="text-center mb-6">
        <p className="text-[22px] font-medium">Memora</p>
        <p className="text-[13px] text-[#888] mt-1">The AI that never forgets.</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full h-10 px-3 bg-white border border-[#E0E0E0] rounded-[8px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full h-10 px-3 bg-white border border-[#E0E0E0] rounded-[8px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-[#1A1A1A] text-white rounded-[8px] text-[13px] font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200"
        >
          {loading ? "Please wait..." : copy[mode].button}
        </button>
      </form>

      {error || callbackError ? (
        <p className="mt-3 rounded-[8px] bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {error || callbackError}
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 rounded-[8px] bg-green-50 px-3 py-2 text-[12px] text-green-700">
          {message}
        </p>
      ) : null}

      <p className="text-center text-[12px] text-[#888] mt-5">
        {copy[mode].switchText}{" "}
        <Link href={copy[mode].switchHref} className="text-[#1A1A1A] font-medium hover:underline">
          {copy[mode].switchLabel}
        </Link>
      </p>
    </div>
  );
}
