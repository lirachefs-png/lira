import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AllTrip - Passagens Aéreas com Preços Secretos",
    template: "%s | AllTrip"
  },
  description: "Desbloqueie ofertas secretas de voos que as companhias aéreas não querem que você veja. Encontramos os preços mais baratos em segundos.",
  keywords: ["passagens aéreas", "voos baratos", "promoção de passagens", "viagens", "turismo", "alltrip"],
  authors: [{ name: "AllTrip Team" }],
  creator: "AllTrip",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://alltrip.com",
    siteName: "AllTrip",
    title: "AllTrip - Passagens Aéreas com Preços Secretos",
    description: "Desbloqueie ofertas secretas de voos que as companhias aéreas não querem que você veja.",
    images: [
      {
        url: "/og-image.jpg", // We need to ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "AllTrip Hero Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AllTrip - Passagens Aéreas com Preços Secretos",
    description: "Encontramos os preços mais baratos em segundos.",
    images: ["/og-image.jpg"],
    creator: "@alltrip",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

// ... existing code ...

import { RegionProvider } from "@/contexts/RegionContext";

import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(outfit.className, "antialiased")}>
        <RegionProvider>
          <ThemeProvider>
            {children}
            <Footer />
          </ThemeProvider>
        </RegionProvider>
      </body>
    </html>
  );
}
