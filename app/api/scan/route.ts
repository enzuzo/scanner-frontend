import { NextRequest, NextResponse } from "next/server";
import { resolveBrowserDriver } from "@/app/lib/browser-driver";

const PROXY_BASE = process.env.PROXY_URL ?? "http://localhost:3000";
const PROXY_TOKEN = process.env.PROXY_TOKEN ?? "mysecret";
const BROWSER_DRIVER = resolveBrowserDriver(process.env);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");
  const email = searchParams.get("email");

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const proxyParams: Record<string, string> = { url };
  if (email) proxyParams.email = email;
  if (searchParams.get("skipBannerInteraction") === "true") proxyParams.skipBannerInteraction = "true";
  if (BROWSER_DRIVER) proxyParams.browserDriver = BROWSER_DRIVER;
  const params = new URLSearchParams(proxyParams);
  searchParams.getAll("regions").forEach((r) => params.append("regions", r));
  const upstream = `${PROXY_BASE}/scan?${params}`;

  try {
    const res = await fetch(upstream, {
      method: "POST",
      headers: { Authorization: `Bearer ${PROXY_TOKEN}` },
    });
    const body = await res.text().catch(() => "");
    return new NextResponse(body, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not reach scanner proxy: ${(err as Error).message}` },
      { status: 502 }
    );
  }
}
