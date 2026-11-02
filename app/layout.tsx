import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteUrl, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "Trophy Kiprono | Speak with Confidence. Lead with Impact.", template: "%s | Trophy Kiprono" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  openGraph: { type: "website", locale: "en_KE", siteName: site.name, title: site.name, description: site.description, images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: ["/opengraph-image"] },
};

export const viewport = { themeColor: "#8f6418", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="bg-white text-gray-800 antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Navbar />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
