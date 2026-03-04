import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" }, // Mantido o seu original
      {
        protocol: "http",
        hostname: "localhost",
        port: "3333",
        pathname: "/files/**", // Libera as fotos do seu banco de dados!
      },
    ],
  },
};

export default nextConfig;