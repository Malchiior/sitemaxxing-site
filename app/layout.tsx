import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const tagline =
  "Mog your competition with a fit check from our sitemaxxing AI agent.";

export const metadata: Metadata = {
  title: "Sitemaxxing",
  description: tagline,
  openGraph: {
    title: "Sitemaxxing",
    description: tagline,
    images: [{ url: "/example-card.png", width: 1080, height: 1350 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemaxxing",
    description: tagline,
    images: ["/example-card.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
