import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VA101 Marketplace & Management Platform",
  description:
    "The all-in-one marketplace for hiring vetted virtual assistants, purchasing professional training, and managing your VA business — with built-in screening, interviews, payments, and commission tracking.",
  keywords: [
    "virtual assistant",
    "VA marketplace",
    "hire VA",
    "training marketplace",
    "VA management",
    "remote staffing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-poppins)]">{children}</body>
    </html>
  );
}
