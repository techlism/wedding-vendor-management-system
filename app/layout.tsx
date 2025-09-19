import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const satoshi = localFont({
  src: "./satoshi.ttf",
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "Wedding Vendor - Contract Management",
  description: "Developed by @techlism"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-[Satoshi] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
