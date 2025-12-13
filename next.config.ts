import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude better-sqlite3 from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "better-sqlite3": false,
      };
    }
    return config;
  },
  // Ensure better-sqlite3 is only used server-side
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;









