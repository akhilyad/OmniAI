import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin workspace root to this project so Turbopack ignores the
    // stray package.json/package-lock.json in C:\Users\akhil\
    root: ".",
  },
};

export default nextConfig;
