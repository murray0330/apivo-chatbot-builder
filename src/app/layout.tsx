import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bot Builder",
  description: "Configure and deploy your AI chatbot",
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
