import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "@/app/globals.css";
import LayoutProviders from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "4Growth",
  description: "Coming soon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutProviders>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </LayoutProviders>
  );
}
