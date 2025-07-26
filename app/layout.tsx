import "./globals.css";
import { Inter } from "next/font/google";
import Nav from "./components/nav";
import type { Metadata } from "next";
import { Suspense } from "react";
import PerformanceMonitor from "./components/performance-monitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Telescope",
    template: "%s | Telescope"
  },
  description: "Explore a GitHub user's stars using the GitHub GraphQL API.",
  keywords: ["GitHub", "stars", "repositories", "GraphQL", "Next.js"],
  authors: [{ name: "Telescope Team" }],
  creator: "Telescope",
  publisher: "Telescope",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://telescope.example.com",
    title: "Telescope",
    description: "Explore a GitHub user's stars using the GitHub GraphQL API.",
    siteName: "Telescope",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telescope",
    description: "Explore a GitHub user's stars using the GitHub GraphQL API.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <PerformanceMonitor />
        </Suspense>
        <div className="min-h-screen bg-white">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
