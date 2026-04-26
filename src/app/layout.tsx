import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pehchaan - The Proving Ground for Developers",
  description: "Upskilling platform disguised as a verification engine. For experts, it's an adversarial arena to prove their worth by fixing broken code under pressure. For rookies, it's a zero-penalty training ground to learn debugging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
