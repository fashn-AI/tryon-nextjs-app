import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FASHN AI Virtual Try-On Demo App",
  description: "Next.js app demonstrating FASHN AI's virtual try-on API, allowing users to visualize clothing items on model images",
  keywords: ["FASHN AI", "virtual try-on", "fashion tech", "AI clothing", "next.js", "demo"],
  authors: [{ name: "FASHN AI" }],
  openGraph: {
    title: "FASHN AI Virtual Try-On Demo App",
    description: "Try on clothing virtually with FASHN AI's advanced technology",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
