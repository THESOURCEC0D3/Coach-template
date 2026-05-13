import { Geist } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });

// Canonical production URL. Read from `SITE_URL` env var (set in `.env.local`
// locally and in Vercel project settings in production). Falls back to localhost
// for dev so the template works on first install without any config.
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rachel Rios — Life & Business Coach",
    template: "%s — Rachel Rios",
  },
  description:
    "Work with a certified life and business coach who helps ambitious people break through their limits, gain clarity, and build the life they actually want. Book a free discovery call.",
  applicationName: "Rachel Rios Coaching",
  authors: [{ name: "Rachel Rios" }],
  creator: "Rachel Rios",
  publisher: "Rachel Rios",
  keywords: [
    "life coach",
    "business coach",
    "executive coaching",
    "mindset coach",
    "discovery call",
    "rachel rios",
    "coaching framework",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Rachel Rios",
    title: "Rachel Rios — Life & Business Coach",
    description:
      "Certified coaching to help you break through limits, gain clarity, and build the life you actually want.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rachel Rios — Life & Business Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rachel Rios — Life & Business Coach",
    description:
      "Certified coaching to help you break through limits and build the life you actually want.",
    images: ["/opengraph-image"],
    creator: "@rachelrios",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "lifestyle",
};

export const viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geist.className} bg-white text-gray-800`}>
        <AnnouncementBar />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
