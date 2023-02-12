import './globals.css';
import { Syne, Inter } from '@next/font/google';

const syne = Syne({
  weight: ['400', '600', '800'],
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const inter = Inter({
  weight: ['200', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const metadata = {
  title: {
    default: 'Telescope | Explore GitHub Stars',
    template: '%s | Telescope | Explore GitHub Stars',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={`${inter.className}`}>{children}</body>
    </html>
  )
}
