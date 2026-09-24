import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tagline =
  "Get your website launch-ready. Check mobile, Google and AI readability, then get a prioritized fix list for your coding agent.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sitemaxxing.vercel.app"),
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
