"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[20px] bg-[#002F2F] px-8 py-10 shadow-lg">
        <h1
          className="text-2xl font-bold text-white mb-6"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Website Compliance Scanner
        </h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full rounded-lg px-4 py-3 text-sm font-semibold bg-white text-[#002F2F] hover:bg-gray-100 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
