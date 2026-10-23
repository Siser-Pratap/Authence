import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/login", destination: "/sign-in", permanent: true }];
  },
};

export default nextConfig;
