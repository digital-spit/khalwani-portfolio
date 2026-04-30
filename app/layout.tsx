import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import Cursor from "@/components/cursor";
import Nav from "@/components/nav";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Khaled Halwani — Digital Creative Strategist",
  description:
    "14+ years turning digital ad challenges into performance-driven creative across MENA, US and European markets. Selected work for Vans, Levi's, Gucci, Mercedes, N26 and more.",
  metadataBase: new URL("https://khalwani.com"),
  openGraph: {
    title: "Khaled Halwani — Digital Creative Strategist",
    description:
      "Performance-driven creative strategy. Selected work for Vans, Levi's, Gucci, Mercedes, N26 and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexMono.variable} ${inter.variable} antialiased`}
    >
      <body className="bg-bone text-ink min-h-screen cursor-none">
        <SmoothScroll>
          <Cursor />
          <Nav />
          {children}
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
