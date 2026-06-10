import type { NextConfig } from "next";
import { execSync } from "child_process";

const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH ?? (() => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "dev";
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_COMMIT_HASH: commitHash,
  },
};

export default nextConfig;
