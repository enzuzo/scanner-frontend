"use client";

import { useState } from "react";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; email: string }
  | { type: "error"; message: string };

const REGIONS = [
  { id: "california", label: "California" },
  { id: "florida", label: "Florida" },
];

export default function ScanForm() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  function toggleRegion(id: string) {
    setRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "loading" });

    const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const params = new URLSearchParams({ url: normalizedUrl, email });
    regions.forEach((r) => params.append("regions", r));

    setStatus({ type: "success", email });

    fetch(`/api/scan?${params}`)
      .then((res) => {
        if (!res.ok) {
          res.text().then((body) =>
            setStatus({
              type: "error",
              message: `Scan request failed (${res.status})${body ? ": " + body : ""}`,
            })
          );
        }
      })
      .catch((err) => {
        setStatus({
          type: "error",
          message: `Could not reach scanner — is it running? (${err.message})`,
        });
      });
  }

  const loading = status.type === "loading";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ fontFamily: "var(--font-inter)" }}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="url" className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
          Website URL
        </label>
        <input
          id="url"
          type="text"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-lg px-3 py-2.5 text-sm outline-none bg-white/10 text-white placeholder:text-white/30 border border-white/20 focus:border-[#23DC64] transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg px-3 py-2.5 text-sm outline-none bg-white/10 text-white placeholder:text-white/30 border border-white/20 focus:border-[#23DC64] transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
          Regions
        </span>
        <div className="flex flex-col gap-2">
          {REGIONS.map((region) => {
            const checked = regions.includes(region.id);
            return (
              <div
                key={region.id}
                role="checkbox"
                aria-checked={checked}
                tabIndex={0}
                onClick={() => toggleRegion(region.id)}
                onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggleRegion(region.id)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer border transition select-none"
                style={{
                  background: checked ? "rgba(35,220,100,0.12)" : "rgba(255,255,255,0.05)",
                  borderColor: checked ? "#23DC64" : "rgba(255,255,255,0.2)",
                }}
              >
                <span
                  className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0 border transition"
                  style={{
                    background: checked ? "#23DC64" : "transparent",
                    borderColor: checked ? "#23DC64" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#002F2F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-white">{region.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "#23DC64", color: "#002F2F" }}
      >
        {loading ? "Starting scan…" : "Start scan"}
      </button>

      {status.type === "success" && (
        <p className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(35,220,100,0.15)", color: "#23DC64" }}>
          Scan started — results will be sent to <strong>{status.email}</strong>.
        </p>
      )}

      {status.type === "error" && (
        <p className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(255,100,100,0.15)", color: "#ff6b6b" }}>
          {status.message}
        </p>
      )}
    </form>
  );
}
