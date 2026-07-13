import type { Metadata } from "next";
import { Sora, Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotTicker from "@/components/HotTicker";
import BoardingPassWidget from "@/components/BoardingPassWidget";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Study & Work Abroad`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <HotTicker />
        <Navbar />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <BoardingPassWidget />
      </body>
    </html>
  );
}
