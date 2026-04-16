import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence the multi-lockfile workspace root warning on Windows
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
