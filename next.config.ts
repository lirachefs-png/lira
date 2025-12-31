import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pic.avs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.duffel.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Security headers for Duffel Payments (uses Stripe internally)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: Duffel, Stripe (required for Duffel Payments)
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://assets.duffel.com https://js.stripe.com https://*.stripe.com",
              // Styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.duffel.com https://cdn.jsdelivr.net",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images
              "img-src 'self' data: blob: https: http: https://dublin.stream-io-cdn.com https://*.stripe.com",
              // Frames: Duffel, Stripe 3D Secure
              "frame-src 'self' https://assets.duffel.com https://js.stripe.com https://*.stripe.com https://hooks.stripe.com",
              // Connections: API calls
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://assets.duffel.com https://api.duffel.com https://chat.stream-io-api.com wss://chat.stream-io-api.com https://api.groq.com https://api.opensky-network.org https://api.stripe.com https://*.stripe.com",
              // Workers
              "worker-src 'self' blob:",
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default nextConfig;


