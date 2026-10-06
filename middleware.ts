import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { isLocalAuthBypassEnabled } from "@/app/lib/auth-bypass";

// See app/lib/auth-bypass.js — set LOCAL_AUTH_BYPASS=true in .env.local to run
// `next dev` against a backend (e.g. staging) without Google OAuth creds.
export const middleware = isLocalAuthBypassEnabled(process.env)
  ? () => NextResponse.next()
  : auth;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
