import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const favicon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PHBhdGggZD0ibTE0LjMxIDggNS43NCA5Ljk0Ij48L3BhdGg+PHBhdGggZD0iTTkuNjkgOGgxMS40OCI+PC9wYXRoPjxwYXRoIGQ9Im03Ljc4IDQuMDEgNy43MyA3LjczIj48L3BhdGg+PHBhdGggZD0ibTIuMzQgMTggNS43NC05Ljk0Ij48L3BhdGg+PHBhdGggZD0iTTEuOTYgMTIuMDJoMTEuNDgiPjwvcGF0aD48cGF0aCBkPSJtMTYuMjIgMTkuOTkgNy43My03LjczIj48L3BhdGg+PC9zdmc+';

export const metadata: Metadata = {
  title: 'Visionary Capture',
  description: 'Create and customize stunning screenshots of your code.',
  manifest: '/manifest.json',
  icons: {
    icon: favicon,
    apple: favicon,
  },
};

export const viewport: Viewport = {
  themeColor: '#737CA1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
