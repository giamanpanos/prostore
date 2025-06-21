import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* the necessary config to receive images from an external server */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;
