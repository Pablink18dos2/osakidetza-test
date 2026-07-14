import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite optimizar los SVG placeholder en desarrollo.
    // Al pasar a fotos reales o a un CDN externo (Supabase Storage,
    // Vercel Blob), configurar aquí `remotePatterns` en su lugar.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
