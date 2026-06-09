"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    router.push("/");
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full h-10 px-3 bg-white border border-[#E0E0E0] rounded-[8px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full h-10 px-3 bg-white border border-[#E0E0E0] rounded-[8px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
        />
        <button
          type="submit"
          className="w-full h-10 bg-[#1A1A1A] text-white rounded-[8px] text-[13px] font-medium hover:opacity-90 transition-all duration-200"
        >
          Sign in
        </button>
      </form>
      <div className="flex items-center gap-3 my-5 text-[11px] text-[#BBBBBB]">
        <div className="flex-1 h-px bg-[#E8E8E8]" />
        or
        <div className="flex-1 h-px bg-[#E8E8E8]" />
      </div>
      <button className="w-full h-10 bg-white border border-[#E8E8E8] rounded-[8px] text-[13px] hover:bg-[#F5F5F5] transition-all duration-200 inline-flex items-center justify-center gap-2">
        <span className="font-medium" style={{ color: "#4285F4" }}>
          G
        </span>
        Continue with Google
      </button>
      <p className="text-center text-[12px] text-[#888] mt-5">
        Don't have an account?{" "}
        <Link href="/signup" className="text-[#1A1A1A] font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
