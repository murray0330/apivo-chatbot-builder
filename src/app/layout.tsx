import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vapi Embed Platform",
  description: "Centralized Vapi chatbot embed platform. One script tag per client site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
