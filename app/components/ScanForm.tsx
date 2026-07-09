"use client";

import { useState } from "react";
import { parseEmails, hasSpaceSeparator } from "../lib/email-utils";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; email: string }
  | { type: "error"; message: string };

const REGIONS = [
  { id: "california", label: "California" },
  { id: "florida", label: "Florida" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ScanForm() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [emailSpaceWarning, setEmailSpaceWarning] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [skipBannerInteraction, setSkipBannerInteraction] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  function toggleRegion(id: string) {
    setRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const emails = parseEmails(email);
    const invalidEmails = emails.filter((addr) => !EMAIL_RE.test(addr));
    if (!emails.length || invalidEmails.length) {
      setStatus({
        type: "error",
        message: invalidEmails.length
          ? `Invalid email address${invalidEmails.length > 1 ? "es" : ""}: ${invalidEmails.join(", ")}`
          : "Please enter at least one email address.",
      });
      return;
    }

    setStatus({ type: "loading" });

    const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const params = new URLSearchParams({ url: normalizedUrl, email: emails.join(",") });
    regions.forEach((r) => params.append("regions", r));
    if (skipBannerInteraction) params.set("skipBannerInteraction", "true");

    setStatus({ type: "success", email: emails.join(", ") });

    fetch(`/api/scan?${params}`)
      .then((res) => {
        if (!res.ok) {
          res.text().then(() =>
            setStatus({
              type: "error",
              message: `Scan request failed (${res.status}). Please try again or contact support.`,
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

  if (status.type === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center" style={{ fontFamily: "var(--font-inter)" }}>
        <span
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ background: "rgba(35,220,100,0.15)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#23DC64" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-white">Scan started</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Your results will be sent to{" "}
            <span className="font-medium" style={{ color: "#23DC64" }}>{status.email}</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ fontFamily: "var(--font-inter)" }}>
      <p className="text-sm -mt-2 mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
        Enter a URL and your email to receive the scan results.
      </p>
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
          Recipient email address(es)
        </label>
        <input
          id="email"
          type="text"
          required
          placeholder="john@doe.com, foo@bar.com"
          value={email}
          onChange={(e) => {
            const val = e.target.value;
            setEmail(val);
            setEmailSpaceWarning(hasSpaceSeparator(val));
          }}
          className="rounded-lg px-3 py-2.5 text-sm outline-none bg-white/10 text-white placeholder:text-white/30 border border-white/20 focus:border-[#23DC64] transition"
        />
        {emailSpaceWarning && (
          <p className="text-xs" style={{ color: "#f59e0b" }}>
            Use commas to separate multiple email addresses, not spaces.
          </p>
        )}
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

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
          Options
        </span>
        <div
          role="checkbox"
          aria-checked={skipBannerInteraction}
          tabIndex={0}
          onClick={() => setSkipBannerInteraction((v) => !v)}
          onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setSkipBannerInteraction((v) => !v)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer border transition select-none"
          style={{
            background: skipBannerInteraction ? "rgba(35,220,100,0.12)" : "rgba(255,255,255,0.05)",
            borderColor: skipBannerInteraction ? "#23DC64" : "rgba(255,255,255,0.2)",
          }}
        >
          <span
            className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0 border transition"
            style={{
              background: skipBannerInteraction ? "#23DC64" : "transparent",
              borderColor: skipBannerInteraction ? "#23DC64" : "rgba(255,255,255,0.4)",
            }}
          >
            {skipBannerInteraction && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l2.5 2.5L9 1" stroke="#002F2F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-sm text-white">Don't interact with cookie banner</span>
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

      {status.type === "error" && (
        <p className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(255,100,100,0.15)", color: "#ff6b6b" }}>
          {status.message}
        </p>
      )}
    </form>
  );
}
